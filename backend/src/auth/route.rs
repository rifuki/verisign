use actix_web::web;

use crate::auth::handler::{
    register,
    login,
    logout,
    JwtAuth
};

pub fn scoped_auth(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/auth")
            .route("/ping", web::get().to(|_: JwtAuth| async { "PONG" }))
            .route("/register", web::post().to(register))
            .route("/login", web::post().to(login))
            .route("/logout", web::get().to(logout))
    );
}