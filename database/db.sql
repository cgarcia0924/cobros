CREATE DATABASE AppCobros;

USE AppCobros;

-- TABLE USER
-- all pasword wil be encrypted using SHA1
CREATE TABLE users (
  id INT(11) NOT NULL,
  username VARCHAR(16) NOT NULL,
  password VARCHAR(60) NOT NULL,
  fullname VARCHAR(100) NOT NULL
);

ALTER TABLE users
  ADD PRIMARY KEY (id);

ALTER TABLE users
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;


DESCRIBE users;

INSERT INTO users (id, username, password, fullname) 
  VALUES (1, 'carlos.garcia', '$2a$10$QvWtmiZthg5BASS31hdzZO3eI52o5vBNV0yILnzB5eGZ/.6V8/alW', 'Carlos Ivan Garcia Chacon');

SELECT * FROM users;


-- LINKS TABLE
CREATE TABLE links (
  id INT(11) NOT NULL,
  title VARCHAR(150) NOT NULL,
  url VARCHAR(255) NOT NULL,
  description TEXT,
  user_id INT(11),
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE links
  ADD PRIMARY KEY (id);

ALTER TABLE links
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

DESCRIBE links;

CREATE TABLE sessions (
  session_id VARCHAR(128) ,
  expires INT NOT NULL,
  data MEDIUMTEXT NOT NULL
);

ALTER TABLE sessions
  ADD PRIMARY KEY (session_id);