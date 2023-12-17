use serde::{
    Deserialize,
    Serialize
};
use sqlx::FromRow;

#[derive(Serialize, FromRow)]
pub struct Credentials{
    pub username: String,
    pub password: String
}

#[derive(Deserialize)]
pub struct CredentialsBuilder {
    pub username: String,
    pub password: String
}