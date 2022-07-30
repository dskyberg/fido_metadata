use std::error::Error;
use std::fs::File;
use std::io::prelude::*;

use josekit::{jws::RS256, jwt};

pub use metadata::*;
pub mod metadata;

pub fn get_str(filename: &str) -> Result<String, Box<dyn Error>> {
    let mut f = File::open(filename)?;
    let mut s = String::new();
    f.read_to_string(&mut s)?;

    Ok(s)
}

pub fn decode_jwt(token_file: &str, pem_file: &str) -> Result<(), Box<dyn Error>> {
    let token = get_str(token_file)?;
    let pem = get_str(pem_file)?;

    let verifier = RS256.verifier_from_pem(&pem.as_bytes())?;
    let _result = jwt::decode_with_verifier(&token.as_bytes(), &verifier).map_err(|e| {
        println!("Error! {:?}", &e);
        e
    })?;

    println!("We got a token!");
    Ok(())
}

pub fn load_metadata(filename: &str) -> Result<MetadataBLOBPayload, Box<dyn Error>> {
    let json = get_str(filename)?;

    let payload: MetadataBLOBPayload = serde_json::from_slice(json.as_bytes())?;
    Ok(payload)
}
