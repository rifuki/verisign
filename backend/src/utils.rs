use sqlx::mysql::MySqlPoolOptions;
use std::time::Duration;

use crate::types::DbPool;

pub async fn establish_connection(db_url: &str) -> DbPool {
    MySqlPoolOptions::new()
        .acquire_timeout(Duration::from_secs(1))
        .connect(db_url)
        .await
        .unwrap_or_else(|err| {
            panic!("Failed to establish connection. {:?}", err);
        })
}