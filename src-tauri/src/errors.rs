use thiserror::Error;

#[derive(Error, Debug)]
pub enum Error {
    #[error("JWT is malformed")]
    BadJWT,
    #[error("JWT deserialize error")]
    JSONDeserialize(#[from] serde_json::Error),
    #[error("Error fetching url")]
    FetchError(#[from] reqwest::Error),
    #[error("Invalid Signature")]
    InvalidSignature,
}
