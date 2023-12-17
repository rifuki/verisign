use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use std::env;

use backend::{auth::route::scoped_auth, types::AppState, utils::establish_connection};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    // Import the environment variables from .env file
    let app_port = env::var("APP_PORT")
        .unwrap_or("80".to_string())
        .parse::<u16>()
        .unwrap_or_default();
    let db_url = env::var("DATABASE_URL")
        .unwrap_or_else(|err| panic!("DATABASE_URL cannot be empty. {:#?}", err));
    let secret_key = env::var("SECRET_KEY")
        .unwrap_or_else(|err| panic!("SECRET_KEY cannot be empty. {:#?}", err));

    // Create database pool connection
    let db_pool = establish_connection(&db_url).await;

    // Running the database migrations
    sqlx::migrate!().run(&db_pool).await.unwrap_or_else(|err| {
        panic!("Failed to migrate database. {:?}", err);
    });

    let app_state = AppState {
        db_pool,
        secret_key,
    };

    // Start server
    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_header()
            .allow_any_method()
            .allow_any_origin()
            .supports_credentials();
        App::new()
            .app_data(web::Data::new(app_state.clone()))
            .wrap(cors)
            .configure(scoped_auth)
    })
    .bind(("0.0.0.0", app_port))?
    .run()
    .await
}
