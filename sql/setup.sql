-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS reviews;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE restaurants (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR
);

CREATE TABLE reviews (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    review VARCHAR NOT NULL,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users (id),
    rest_id BIGINT,
    FOREIGN KEY (rest_id) REFERENCES restaurants (id)
);

INSERT INTO users (
    email,
    password_hash
)
VALUES
  ('rudyboy@gmail.com', 'poodles'),
  ('russell@gmail.com', 'food247'),
  ('theboys@gmail.com', 'foodles4life');

INSERT INTO restaurants (
    name
)
VALUES
  ('Luc Lac'),
  ('Non La'),
  ('Waffle Window');

INSERT INTO reviews (
    review,
    user_id,
    rest_id
)
VALUES
  ('Best cream cheese wontons!', '2', '1'),
  ('Beef Pho? Pho yeah!', '1', '2'),
  ('Give me the three Bs please! Brie, bacon, and basil. 10/10 recommend', '3', '3'),
  ('Bahn Mi a sandwich', '1', '1'),
  ('And in the morning, I am making waffles!', '2', '3'),
  ('Mmmmm soup', '3', '3');
