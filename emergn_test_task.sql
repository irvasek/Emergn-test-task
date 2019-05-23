CREATE DATABASE emergn_test_task;

CREATE USER 'user'@'localhost' IDENTIFIED BY 'user';

GRANT ALL PRIVILEGES ON emergn_test_task.* to 'user'@'localhost';

USE emergn_test_task;

CREATE TABLE user(
    id BIGINT AUTO_INCREMENT, 
    login VARCHAR(255), 
    username VARCHAR(255), 
    email VARCHAR(255), 
    password VARCHAR(255), 
    active INT, 
    PRIMARY KEY (id)
);

CREATE TABLE role(
    id BIGINT AUTO_INCREMENT,  
    name VARCHAR(255), 
    PRIMARY KEY (id)
);

CREATE TABLE user_role(
    user_id BIGINT,  
    role_id BIGINT, 
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id)  REFERENCES user (id),
    FOREIGN KEY (role_id)  REFERENCES role (id)
);

INSERT INTO role(id, name) VALUES(1, 'USER');

INSERT INTO user(id, login, username, email, password, active) VALUES(1, 'mylogin1', 'username1', 'mycool.email@gmail.com', '11111111', 1);
INSERT INTO user(id, login, username, email, password, active) VALUES(2, 'mylogin2', 'username2', 'mycool1.email@gmail.com', '11111111', 1);
INSERT INTO user(id, login, username, email, password, active) VALUES(3, 'mylogin3', 'username3', 'mycool2.email@gmail.com', '11111111', 1);
INSERT INTO user(id, login, username, email, password, active) VALUES(4, 'mylogin4', 'username1', 'mycool4.email@gmail.com', '11111111', 1);
INSERT INTO user(id, login, username, email, password, active) VALUES(5, 'mylogin5', 'username3', 'mycool3.email@gmail.com', '11111111', 1);

INSERT INTO user_role(user_id, role_id) VALUES(1, 1);
INSERT INTO user_role(user_id, role_id) VALUES(2, 1);
INSERT INTO user_role(user_id, role_id) VALUES(3, 1);
INSERT INTO user_role(user_id, role_id) VALUES(4, 1);
INSERT INTO user_role(user_id, role_id) VALUES(5, 1);