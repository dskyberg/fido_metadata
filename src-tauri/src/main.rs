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

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![search])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}
