use actix_web::{
    web,
    HttpResponse,
    cookie::{
        Cookie,
        SameSite,
        time::Duration as CookieDuration
    },
    HttpRequest, 
    FromRequest,
    Error as ActixError,
    dev::Payload,
    error
};
use argon2::{
    password_hash::{
        SaltString,
        rand_core::OsRng
    },
    Argon2,
    PasswordHasher,
    PasswordHash, 
    PasswordVerifier
};
use serde_json::json;
use chrono::{
    Utc,
    Duration as ChronoDuration
};
use jsonwebtoken::{
    encode as JwtEncode,
    Header,
    EncodingKey,
    decode as JwtDecode,
    Validation,
    Algorithm,
    DecodingKey
};
use std::future::{
    Ready,
    ready
};

use crate::{
    auth::{
        model::{
            CredentialsBuilder,
            Credentials,
        },
        types::Claims
    },
    types::AppState
};

pub async fn register(
    app_state: web::Data<AppState>,
    payload: web::Json<CredentialsBuilder>
) -> HttpResponse 
{
    let CredentialsBuilder { username, password } = payload.into_inner();
    let conn = &app_state.get_ref().db_pool;

    // hashing credentials password
    let salt = SaltString::generate(OsRng);
    let argon2 = Argon2::default();
    let hashed_password = argon2
        .hash_password(password.as_bytes(), &salt);
    if let Err(err) = hashed_password {
        return HttpResponse::InternalServerError().json(
            json!({
                "message": err.to_string()
            })
        );
    }

    // storing credentials
    let query_result = sqlx::query("INSERT INTO credentials (username, password) VALUES (?, ?);")
        .bind(username)
        .bind(hashed_password.unwrap().to_string())
        .execute(conn)
        .await;

    match query_result {
        Ok(_) => HttpResponse::Ok().json(
            json!({
                "message": "Credentials registered successfully"
            })
        ),
        Err(err) => HttpResponse::InternalServerError().json(
            json!({
                "message": err.to_string()
            })
        )
    }
}

pub async fn login(
    app_state: web::Data<AppState>,
    payload: web::Json<CredentialsBuilder>
) -> HttpResponse
{
    let CredentialsBuilder { username, password } = payload.into_inner();
    let AppState { db_pool, secret_key } = app_state.get_ref();

    // Checking payload credentials
    let query_result = sqlx::query_as::<_, Credentials>("SELECT * FROM credentials WHERE username = ?;")
        .bind(username)
        .fetch_one(db_pool)
        .await;
    if let Err(err) = query_result {
        return HttpResponse::InternalServerError().json(
            json!({
                "message": err.to_string()
            })
        );
    }
    let stored_credentials = query_result.unwrap();

    // Verifying payload password
    let hash_stored_password = PasswordHash::new(&stored_credentials.password).unwrap();
    let argon2 = Argon2::default();
    let is_verified = argon2
        .verify_password(password.as_bytes(), &hash_stored_password).is_ok();
    if !is_verified {
        return HttpResponse::InternalServerError().json(
            json!({
                "message": "Invalid credentials"
            })
        );
    }

    // Create JWT token
    let claims = Claims { 
        username: stored_credentials.username,
        exp: (Utc::now().naive_utc() + ChronoDuration::minutes(1)).timestamp()
    };
    let encoded_access_token = JwtEncode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret_key.as_ref())
    );
    if let Err(err) = encoded_access_token {
        return HttpResponse::InternalServerError().json(
            json!({
                "message": err.to_string()
            })
        );
    }

    let yay_cookie = Cookie::build("access_token", encoded_access_token.unwrap())
        .secure(false)
        .http_only(true)
        .same_site(SameSite::Lax)
        .path("/")
        .max_age(CookieDuration::hours(1))
        .finish();
    HttpResponse::Ok()
        .cookie(yay_cookie)
        .json(
            json!({
                "message": "Logged in successfully"
            })
        )
}

pub async fn logout(
    http_request: HttpRequest  
) -> HttpResponse 
{
    let access_token = http_request.cookie("access_token");
    if access_token.is_none() {
        return HttpResponse::Ok().json(
            json!({
                "message": "Already logged out"
            })
        );
    }
    
    let yay_cookie = Cookie::build("access_token", "")
        .secure(false)
        .http_only(false)
        .same_site(SameSite::Lax)
        .path("/")
        .max_age(CookieDuration::seconds(-1))
        .finish();
    HttpResponse::Ok()
        .cookie(yay_cookie)
        .json(
            json!({
                "message": "Logged out successfully"
            })
        )
}

pub struct JwtAuth;
impl FromRequest for JwtAuth {
    type Error = ActixError;
    type Future = Ready<Result<Self, Self::Error>>;

    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        // let auth_token = req.headers()
        //     .get(header::AUTHORIZATION)
        //     .map_or("", |hv| hv.to_str().unwrap_or(""))
        //     .split_whitespace()
        //     .collect::<Vec<&str>>();
        // if auth_token.len() != 2 || auth_token[0] != "Bearer" {
        //     return ready(Err(error::ErrorUnauthorized("Invalid bearer token.")))
        // }

        // Takes access_token cookie
        let access_token = req.cookie("access_token")
            .map(|cookie| cookie.value().to_owned());
        if let None = access_token {
            return ready(Err(error::ErrorUnauthorized("Please login to access")))
        }

        // Takes secret_key for decoding jwt token
        let secret_key = req.app_data::<web::Data<AppState>>()
            .map(|app_state| &app_state.get_ref().secret_key);
        if let None = secret_key {
            return ready(Err(error::ErrorInternalServerError("Invalid secret key.")));
        }

        // Decoding token and returning Claims object
        let decoded_token = JwtDecode::<Claims>(
            &access_token.unwrap(),
            &DecodingKey::from_secret(secret_key.unwrap().as_ref()),
            &Validation::new(Algorithm::HS256)
        );

        match decoded_token {
            Ok(token) => {
                if Utc::now().naive_utc().timestamp() > token.claims.exp {
                    return ready(Err(error::ErrorUnauthorized("Expired token")))
                }

                return ready(Ok(Self))
            },
            Err(err) => {
                return ready(Err(error::ErrorUnauthorized(err.to_string())))
            }
         }
    }
}