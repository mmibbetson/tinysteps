CREATE TABLE music_key (
    id INTEGER PRIMARY KEY,
    root TEXT NOT NULL,
    quality TEXT NOT NULL,
);

CREATE TABLE chord (
    id INTEGER PRIMARY KEY,
    music_key_id INTEGER NOT NULL,
    root TEXT NOT NULL,
    suffix TEXT NOT NULL,
    function TEXT NOT NULL,
    extension TEXT NOT NULL,
    FOREIGN KEY (music_key_id) REFERENCES music_key (id)
);

CREATE TABLE progression (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    body TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TABLE user (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    UNIQUE (username)
);
