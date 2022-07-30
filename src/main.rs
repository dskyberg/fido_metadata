use std::error::Error;
use std::fmt::Write;
fn main() -> Result<(), Box<dyn Error>> {
    let metadata = metadata::load_metadata("metadata.json")?;
    let mut count = 0;
    if let Some(header) = metadata.legal_header {
        println!("{}", &header);
        println!("Number: {}", &metadata.no);
        println!("Next Update: {}", &metadata.next_update);
        println!("-------------------------------------------------------------------\n");

        println!("{:^6}| {:^38} | {:^16}", "No", "ID", "Status");
        println!("-------------------------------------------------------------------");
    }

    for entry in metadata.entries {
        count += 1;
        let mut line = String::new();
        write!(&mut line, "{:<6}|", &count)?;
        if let Some(aaid) = entry.aaid {
            write!(&mut line, " {:38} |", &aaid)?;
        } else if let Some(aaguid) = entry.aaguid {
            write!(&mut line, " {:38} |", &aaguid)?;
        } else {
            write!(&mut line, " {:38} |", " ")?;
        }
        write!(&mut line, " {:?}", entry.status_reports[0].status)?;
        println!("{}", &line);
    }
    Ok(())
}
