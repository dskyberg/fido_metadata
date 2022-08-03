use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, Document},
    options::{ClientOptions, FindOneOptions, FindOptions, ResolverConfig},
    Client, Database,
};
use std::env;
use std::error::Error;

use crate::data::model::*;
use crate::model::*;

// Password: ycw!FNT0nqy!wtq.pun
// URL Encoded: ycw%21FNT0nqy%21wtq.pun
static MONGODB_URL: &str = "mongodb+srv://davidskyberg:ycw%21FNT0nqy%21wtq.pun@cluster0.zwhiti2.mongodb.net/?retryWrites=true&w=majority";
static DEFAULT_DB: &str = "fido";

pub struct Data {
    pub client: Client,
    pub database: Database,
}

impl Data {
    pub async fn new() -> Self {
        let client_uri = env::var("MONGODB_URI").unwrap_or_else(|_| MONGODB_URL.to_string());
        let db_name = env::var("MONGODB_DB").unwrap_or_else(|_| DEFAULT_DB.to_string());
        // A Client is needed to connect to MongoDB:
        // An extra line of code to work around a DNS issue on Windows:
        let options =
            ClientOptions::parse_with_resolver_config(&client_uri, ResolverConfig::cloudflare())
                .await
                .expect("Failed to create Mongo ClientOptions");
        let client = Client::with_options(options).expect("Failed to creaate Mongo Client");
        let database = client.database(&db_name);
        Self { client, database }
    }

    pub async fn drop(&self) -> Result<(), Box<dyn Error>> {
        self.database
            .collection::<MetadataStatement>("entries")
            .drop(None)
            .await?;
        self.database
            .collection::<Metadata>("metadata")
            .drop(None)
            .await?;
        Ok(())
    }

    pub async fn put_metadata_blob(
        &self,
        blob: &MetadataBLOBPayload,
    ) -> Result<String, Box<dyn Error>> {
        let metadata = Metadata::from(blob);
        self.put_metadata(&metadata).await
    }

    pub async fn put_metadata(&self, metadata: &Metadata) -> Result<String, Box<dyn Error>> {
        // Drop the existing data
        self.drop().await?;

        let result = self
            .database
            .collection::<Metadata>("metadata")
            .insert_one(metadata, None)
            .await?;
        let id = result.inserted_id.to_string();
        Ok(id)
    }

    pub async fn get_metadata_by_no(&self, no: u32) -> Result<Option<Metadata>, Box<dyn Error>> {
        Ok(self
            .database
            .collection::<Metadata>("metadata")
            .find_one(doc! {"no": no}, None)
            .await?)
    }

    pub async fn put_entry(&self, statement: &MetadataStatement) -> Result<(), Box<dyn Error>> {
        let _result = self
            .database
            .collection::<MetadataStatement>("entries")
            .insert_one(statement, None)
            .await?;
        Ok(())
    }

    pub async fn find_statement(
        &self,
        filter: Option<Document>,
        options: Option<FindOptions>,
    ) -> Result<Vec<MetadataStatement>, Box<dyn Error>> {
        let mut cursor = self
            .database
            .collection::<MetadataStatement>("entries")
            .find(filter, options)
            .await?;
        let mut entries: Vec<MetadataStatement> = Vec::new();

        while let Some(statement) = cursor.try_next().await? {
            entries.push(statement);
        }
        Ok(entries)
    }

    pub async fn find_one_statement(
        &self,
        filter: Document,
        options: Option<FindOneOptions>,
    ) -> Result<Option<MetadataStatement>, Box<dyn Error>> {
        let result = self
            .database
            .collection::<MetadataStatement>("entries")
            .find_one(filter, options)
            .await?;
        match result {
            Some(statement) => Ok(Some(statement)),
            _ => Ok(None),
        }
    }

    pub async fn find_by_aaguid(
        &self,
        metadata_no: u32,
        aaguid: &str,
    ) -> Result<Option<MetadataStatement>, Box<dyn Error>> {
        let filter = doc! {"metadata_no": metadata_no, "statement.aaguid": aaguid};
        let options = None;
        self.find_one_statement(filter, options).await
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_drop() {
        let data = Data::new().await;
        data.drop().await.expect("oops");
    }

    #[tokio::test]
    async fn test_get_metadata_by_no() {
        let data = Data::new().await;
        let md = data.get_metadata_by_no(17).await.expect("Failed to fetch");
        dbg!(&md);
    }

    #[tokio::test]
    async fn test_put_metadata() {
        let metadata = Metadata::new (
            Some("Retrieval and use of this BLOB indicates acceptance of the appropriate agreement located at https://fidoalliance.org/metadata/metadata-legal-terms/".to_string()),
            17,
            "2022-08-01".to_string()
        );

        let data = Data::new().await;

        let md = data
            .put_metadata(&metadata)
            .await
            .expect("Failed to put metadata");
        dbg!(&md);
    }

    #[tokio::test]
    async fn test_find_by_aaguid() {
        let data = Data::new().await;

        let res = data
            .find_by_aaguid(17, "9c835346-796b-4c27-8898-d6032f515cc5")
            .await
            .expect("oops");
        dbg!(&res);
    }

    #[tokio::test]
    async fn test_find() {
        let data = Data::new().await;
        let filter = doc! {"aaguid": {"$exists":true}};
        let result = data.find_statement(Some(filter), None).await.expect("oops");
        for statement in result {
            println!("{}", &statement.aaguid.unwrap());
        }
    }
    use serde_json;

    #[tokio::test]
    async fn test_find_types() {
        let data = Data::new().await;
        let filter_str = r#"{
            "aaguid": {
                "$exists":true
            }
        }"#;
        let filter_str2 = r#"{"aaguid":"9c835346-796b-4c27-8898-d6032f515cc5"}"#;
        dbg!(filter_str);
        let filter: Document = serde_json::from_str(filter_str2).expect("parse failed");
        dbg!(&filter);
        let result = data.find_statement(Some(filter), None).await.expect("oops");
        for statement in result {
            println!("{}", &statement.aaguid.unwrap());
        }
    }

    #[tokio::test]
    async fn test_find_regex() {
        let data = Data::new().await;
        let filter_str = r#"{
            "aaguid": {"$regex":"796b-4c27-8898"}
        }"#;
        //let filter_str2 = r#"{"aaguid":"9c835346-796b-4c27-8898-d6032f515cc5"}"#;
        dbg!(filter_str);
        let filter: Document = serde_json::from_str(filter_str).expect("parse failed");
        dbg!(&filter);
        let result = data.find_statement(Some(filter), None).await.expect("oops");
        for statement in result {
            println!("{}", &statement.aaguid.unwrap());
        }
    }

}
