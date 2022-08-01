#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use app::Data;
use mongodb::{bson::Document, options::FindOptions};
use std::error::Error;

#[tauri::command(async)]
async fn search(
    filter: Option<Document>,
    options: Option<FindOptions>,
) -> Result<Vec<app::MetadataStatement>, String> {
    let data = Data::new().await;
    let result = data
        .find_statement(filter, options)
        .await
        .map_err(|e| format!("{:?}", e))?;
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
            data.put_entry(blob.no, &statement)
                .await
                .map_err(|e| format!("{:?}", &e.to_string()))?;
        }
    }

    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![fetch_metadata, search])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}
