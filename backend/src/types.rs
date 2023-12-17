use sqlx::MySqlPool;

pub type DbPool = MySqlPool;

#[derive(Clone)]
pub struct AppState {
    pub db_pool: DbPool,
    pub secret_key: String
}