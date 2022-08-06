use std::error::Error;

use crate::data::model::*;
use crate::model::*;

#[derive(Debug, Default)]
pub struct JsonCache {
    metadata: String,
    entries: String,
}

impl JsonCache {
    pub fn put_metadata(&mut self, metadata: &Metadata) -> Result<(), Box<dyn Error>> {
        let json = serde_json::to_string(metadata)?;
        self.metadata = json;
        Ok(())
    }

    pub fn put_entries(&mut self, blob: &MetadataBLOBPayload) -> Result<(), Box<dyn Error>> {
        let mut entries = Vec::<MetadataStatement>::new();
        for entry in &blob.entries {
            if let Some(statement) = &entry.metadata_statement {
                entries.push(statement.clone())
            }
        }
        let json = serde_json::to_string(&entries)?;
        self.entries = json;
        Ok(())
    }

    pub fn put_metadata_blob(&mut self, blob: &MetadataBLOBPayload) -> Result<(), Box<dyn Error>> {
        let metadata = Metadata::from(blob);
        self.put_metadata(&metadata)?;
        self.put_entries(blob)?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use std::sync::{Arc, Mutex};

    use super::*;

    #[derive(Debug)]
    struct Database(Arc<Mutex<JsonCache>>);

    #[test]
    fn test_static() {
        let cache = JsonCache::default();
        dbg!(&cache);
    }

    #[test]
    fn test_arc() {
        let db = Database(Default::default());
        {
            let mut cache = db.0.lock().unwrap();
            cache.metadata = "hello".to_string();
        }
        {
            let cache = db.0.lock().unwrap();
            dbg!("{:?}", &cache);
        }
    }
}
