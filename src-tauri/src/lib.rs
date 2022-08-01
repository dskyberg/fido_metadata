use std::env;
use std::error::Error;
use std::fs::File;
use std::io::prelude::*;

use josekit::{jws::RS256, jwt};

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

/// Return file contents as string
pub(crate) fn get_file_as_str(filename: &str) -> Result<String, Box<dyn Error>> {
    let mut f = File::open(filename)?;
    let mut s = String::new();
    f.read_to_string(&mut s)?;

    Ok(s)
}

/// Attempt to verify the JWT.  
/// This currently does not work with [josekit]
pub fn verify_jwt(token_file: &str, pem_file: &str) -> Result<(), Box<dyn Error>> {
    let token = get_file_as_str(token_file)?;
    let pem = get_file_as_str(pem_file)?;

    let verifier = RS256.verifier_from_pem(&pem.as_bytes())?;
    let _result = jwt::decode_with_verifier(&token.as_bytes(), &verifier).map_err(|e| {
        println!("Error! {:?}", &e);
        e
    })?;

    println!("We got a token!");
    Ok(())
}

/// Deserialize the JWT and JSON payload
/// This method does not verify the JWT signature.  It just deseriaizes the payload.
pub fn deserialize_jwt(jwt: &str) -> Result<MetadataBLOBPayload, Box<dyn Error>> {
    let indexies: Vec<usize> = jwt
        .as_bytes()
        .iter()
        .enumerate()
        .filter(|(_, b)| **b == b'.')
        .map(|(pos, _)| pos)
        .collect();
    if indexies.len() != 2 {
        return Err(Box::new(errors::Error::BadJWT));
    }

    let payload = &jwt[(indexies[0] + 1)..(indexies[1])];
    let payload = base64::decode_config(payload, base64::URL_SAFE_NO_PAD)
        .map_err(errors::Error::B64Decode)?;

    let metadata = serde_json::from_slice::<MetadataBLOBPayload>(&payload)
        .map_err(errors::Error::JSONDeserialize)?;
    Ok(metadata)
}

/// Download the FIDO Metadata
/// [FIDO_METADATA_URL] is used unless the env `FIDO_METADATA_URL` is set.
pub async fn fetch_fido_metadata() -> Result<MetadataBLOBPayload, Box<dyn Error>> {
    let url = env::var("FIDO_METADATA_URL").unwrap_or_else(|_| FIDO_METADATA_URL.to_string());
    let body = fetch(&url).await?;
    let metadata = deserialize_jwt(&body)?;
    Ok(metadata)
}

#[cfg(test)]
mod tests {
    use super::*;
    use josekit::jws::{deserialize_compact, RS256};
    #[test]
    fn test_decode() {
        let token = get_file_as_str("./test/fido_metadata.jwt").expect("no token file");
        let pem = get_file_as_str("./test/x5c_1_key.pem").expect("no pem file");

        let verifier = RS256
            .verifier_from_pem(&pem.as_bytes())
            .expect("verifier failed");

        let _result = deserialize_compact(&token.as_bytes(), &verifier).expect("oops");
        println!("We got a token!");
    }

    #[test]
    fn test_deserialize_jwt() {
        let jwt = get_file_as_str("./test/fido_metadata.jwt").expect("No file");
        let metadata = deserialize_jwt(&jwt).expect("no token file");
        dbg!(&metadata);
    }
}
