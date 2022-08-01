use thiserror::Error;

#[derive(Error, Debug)]
pub enum Error {
    #[error("JWT is malformed")]
    BadJWT,
    #[error("Bad base64 for JWT")]
    B64Decode(#[from] base64::DecodeError),
    #[error("JWT deserialize error")]
    JSONDeserialize(#[from] serde_json::Error),
    #[error("Error fetching url")]
    FetchError(#[from] reqwest::Error),
    #[error("mongodb error: {0}")]
    DatabaseError(#[from] mongodb::error::Error),
    #[error("could not access field in document: {0}")]
    MongoDataError(#[from] mongodb::bson::document::ValueAccessError),
}
