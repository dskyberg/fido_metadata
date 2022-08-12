#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use serde_json::Value;
use std::{
    collections::HashMap,
    error::Error,
    sync::{Arc, Mutex},
};
use tauri::State;

#[derive(Default)]
struct Database(Arc<Mutex<HashMap<String, Value>>>);

#[tauri::command]
fn search(
    _filter_str: Option<String>,  /*Document */
    _options_str: Option<String>, /*FindOptions */
    db: State<'_, Database>,
) -> Result<Vec<serde_json::Value>, String> {
    let cache = db.0.lock().unwrap();

    if let Some(value) = cache.get("entries") {
        return match value {
            Value::Array(array) => Ok(array.clone()),
            _ => Err("I really wanted an array here".to_string()),
        };
    }
    Err("Well, this is awkward".to_string())
}

/// Fetch the latest metadata
#[tauri::command]
fn fetch_metadata(db: State<'_, Database>) -> Result<(), String> {
    // Fetch the metadata from the FIDO site
    let blob = app::fetch_fido_metadata().map_err(|e| format!("{:?}", &e.to_string()))?;
    let mut cache = db.0.lock().unwrap();
    for entry in blob {
        cache.insert(entry.0, entry.1);
    }
    Ok(())
}

fn main() -> Result<(), Box<dyn Error>> {
    env_logger::init();
    tauri::Builder::default()
        .manage(Database(Default::default()))
        .invoke_handler(tauri::generate_handler![fetch_metadata, search])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}
