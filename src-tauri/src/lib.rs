use jsonwebtoken::{decode, decode_header, DecodingKey, Validation};
use std::env;
use std::error::Error;
use x509_parser::prelude::*;

pub use data::Data;
pub use model::*;

pub mod data;
pub mod errors;
pub mod model;

/// Default url for metadata
static FIDO_METADATA_URL: &str = "https://mds.fidoalliance.org";

/// Fetch from a URL and return text payload
pub(crate) async fn fetch(url: &str) -> Result<String, errors::Error> {
    let body = reqwest::get(url)
        .await
        .map_err(errors::Error::FetchError)?
        .text()
        .await
        .map_err(errors::Error::FetchError)?;

    Ok(body)
}

pub(crate) fn verify_jwt(token: &str) -> Result<MetadataBLOBPayload, Box<dyn Error>> {
    // Pull the algorithm from the alg claim and the
    // X509 cert list from the x5c claim
    let header = decode_header(token)?;
    // This should be RS256. Grab it and use it for the Decode
    let alg = header.alg;

    // x509_parser is kind enough to provide a helper function to
    // grab the x5c list in DER format, rather than PEM.  Thanks!!
    let x5c_list = header.x5c_der()?.unwrap_or_default();

    let mut validation = Validation::new(alg);
    validation.validate_exp = false;
    validation.required_spec_claims = std::collections::HashSet::new();

    // Since order isn't guaranteed in the cert chain, try them all
    // until one succeeds.
    for der in x5c_list {
        // Parse the X.509
        let (_, cert) = X509Certificate::from_der(&der)?;
        // Get the public key in SPKI format
        let public_key_bytes = cert.subject_pki.subject_public_key.as_ref();
        // Create a key from the SPKI
        let key = DecodingKey::from_rsa_der(public_key_bytes);

        // Decode the JWT.
        let result = decode::<MetadataBLOBPayload>(token, &key, &validation);

        if let Ok(token_data) = result {
            let blob = token_data.claims;
            return Ok(blob);
        }
    }
    Err(crate::errors::Error::InvalidSignature.into())
}

/// Download the FIDO Metadata
/// [FIDO_METADATA_URL] is used unless the env `FIDO_METADATA_URL` is set.
pub async fn fetch_fido_metadata() -> Result<MetadataBLOBPayload, Box<dyn Error>> {
    let url = env::var("FIDO_METADATA_URL").unwrap_or_else(|_| FIDO_METADATA_URL.to_string());
    let body = fetch(&url).await?;
    let metadata = verify_jwt(&body)?;
    Ok(metadata)
}
