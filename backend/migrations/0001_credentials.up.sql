-- Add up migration script here
CREATE TABLE IF NOT EXISTS credentials (
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (username)
);