#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use app::Data;
use mongodb::{bson::Document, options::FindOptions};
use std::error::Error;

#[tauri::command(async)]
async fn search(
    filter_str: String,  /*Document */
    options_str: String, /*FindOptions */
) -> Result<Vec<app::MetadataStatement>, String> {
    println!("{:?} - {:?}", &filter_str, &options_str);
    let data = Data::new().await;
    let mut filter: Option<Document> = None;
    let mut options: Option<FindOptions> = None;

    if !filter_str.is_empty() {
        let tmp: Document =
            serde_json::from_str(&filter_str).map_err(|e| format!("Filter: {}", e))?;
        filter = Some(tmp);
    }

    if !options_str.is_empty() {
        let tmp: FindOptions =
            serde_json::from_str(&options_str).map_err(|e| format!("Options: {}", e))?;
        options = Some(tmp);
    }

    let result = data.find_statement(filter, options).await.map_err(|e| {
        log::info!("{}", e.to_string());
        format!("{:?}", e)
    })?;
    Ok(result)
}

/// Fetch the latest metadata
#[tauri::command]
async fn fetch_metadata() -> Result<(), String> {
    // Fetch the metadata from the FIDO site
    let blob = app::fetch_fido_metadata()
        .await
        .map_err(|e| format!("{:?}", &e.to_string()))?;

    // Store the metadata header info
    let data = Data::new().await;
    let _ = data
        .put_metadata_blob(&blob)
        .await
        .map_err(|e| format!("{:?}", &e.to_string()))?;

    // Store each of the statements
    for entry in blob.entries {
        if let Some(statement) = entry.metadata_statement {
            data.put_entry(&statement)
                .await
                .map_err(|e| format!("{:?}", &e.to_string()))?;
        }
    }

    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    env_logger::init();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![fetch_metadata, search])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}
