use serde::{
    Serialize,
    Deserialize
};

#[derive(Serialize, Deserialize, Debug)]
pub struct Claims {
    pub username: String,
    pub exp: i64,
}