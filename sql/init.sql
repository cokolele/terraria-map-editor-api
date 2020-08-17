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

CREATE TABLE error (
    id int NOT NULL AUTO_INCREMENT,
    text mediumtext,
    uploadTime bigint NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE suggestion (
    id int NOT NULL AUTO_INCREMENT,
    text mediumtext,
    uploadTime bigint NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE error_auto (
    id int NOT NULL AUTO_INCREMENT,
    text mediumtext,
    uploadTime bigint NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE map (
    id int NOT NULL AUTO_INCREMENT,
    id_account int NOT NULL,
    fileId varchar(255) NOT NULL,
    name varchar(50) NOT NULL,
    size int NOT NULL,
    uploadTime bigint NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_account) REFERENCES account(id)
) ENGINE = InnoDB CHARSET=utf8;