DROP DATABASE IF EXISTS twe;

CREATE DATABASE twe DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE twe;

CREATE TABLE account (
    id int NOT NULL AUTO_INCREMENT,
    username varchar(60) NOT NULL,
    password varchar(60) NOT NULL,
    email varchar(100),
    creationTime bigint NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB CHARSET=utf8;

CREATE VIEW view_account_complete AS SELECT * FROM account;