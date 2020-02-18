CREATE DATABASE AppCobros;

USE AppCobros;

-- TABLE USER
-- all pasword wil be encrypted using SHA1
CREATE TABLE users (
  id INT(11) NOT NULL,
  tipo_ide INT(11),
  number_id VARCHAR(150),
  username VARCHAR(16) NOT NULL,
  password VARCHAR(60) NOT NULL,
  name VARCHAR(200) NOT NULL,
  lastname VARCHAR(200),
  tipou_id INT(11),
  tipo_of INT(11),
  customers_id INT(11),
  FOREIGN KEY (customers_id) REFERENCES customers(id),
  FOREIGN KEY (tipou_id) REFERENCES tipo_users(id),
  FOREIGN KEY (tipo_ide) REFERENCES tipo_id(id),
  FOREIGN KEY (tipo_of) REFERENCES office(id)
);

ALTER TABLE users
  ADD PRIMARY KEY (id);

ALTER TABLE users
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;


DESCRIBE users;

INSERT INTO users (id, username, password, fullname) 
  VALUES (1, 'carlos.garcia', '$2a$10$QvWtmiZthg5BASS31hdzZO3eI52o5vBNV0yILnzB5eGZ/.6V8/alW', 'Carlos Ivan Garcia Chacon');

SELECT * FROM users;

ALTER TABLE users
  ADD PRIMARY KEY (id);

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

CREATE TABLE tipo_users (
  id INT(11)  NOT NULL,
  tipo VARCHAR(60) NOT NULL
);

ALTER TABLE users 
  ADD tipo_users_id INT(11);

ALTER TABLE tipo_users
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

ALTER TABLE tipo_users
    CONSTRAINT fk_users FOREIGN KEY(users_id) REFERENCES tipo_users(id);

ALTER TABLE tipo_users
  ADD PRIMARY KEY (id);


-- Table Customers

CREATE TABLE customers(
    id INT(11) NOT NULL,
    name VARCHAR(16) NOT NULL,
    email VARCHAR(60) NULL,
    phone VARCHAR(100) NULL,
    active VARCHAR(2) NOT NULL
);

ALTER TABLE customers
   ADD Primary Key (id);

ALTER TABLE customers
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT =1;




    CREATE TABLE office(
    id INT(11) NOT NULL,
    tipo_id INT(11),
    number_id VARCHAR(200) NOT NULL,
    name VARCHAR(200) NOT NULL,
    address VARCHAR(250) NOT NULL,
    city VARCHAR(200) NOT NULL,
    responsable VARCHAR(200) NOT NULL,
    customers_id INT(11),
    active VARCHAR(2) NOT NULL
    CONSTRAINT fk_customers FOREIGN KEY (customers_id) REFERENCES customers(id)
);


ALTER TABLE office
    ADD PRIMARY KEY (id);

ALTER TABLE office
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;
