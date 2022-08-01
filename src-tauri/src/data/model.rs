use chrono::{DateTime, Utc};
use mongodb::bson::serde_helpers::chrono_datetime_as_bson_datetime;
use serde::{Deserialize, Serialize};

use crate::model::*;

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Metadata {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub legal_header: Option<String>, // DOMString                          legalHeader;
    pub no: u32,             // required Number                    no;
    pub next_update: String, //required DOMString                 nextUpdate;
    #[serde(with = "chrono_datetime_as_bson_datetime")]
    date: DateTime<Utc>,
}
impl Metadata {
    pub fn new(legal_header: Option<String>, no: u32, next_update: String) -> Self {
        Self {
            legal_header,
            no,
            next_update,
            date: Utc::now(),
        }
    }
}

impl From<&MetadataBLOBPayload> for Metadata {
    fn from(m: &MetadataBLOBPayload) -> Self {
        Self {
            legal_header: (m.legal_header.clone()),
            no: (m.no),
            next_update: (m.next_update.clone()),
            date: Utc::now(),
        }
    }
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct MetadataEntry {
    pub metadata_no: u32,
    pub statement: MetadataStatement,
}
