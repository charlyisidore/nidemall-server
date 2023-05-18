drop database if exists nidemall;
drop user if exists 'nidemall'@'%';
create database nidemall default character set utf8mb4 collate utf8mb4_unicode_ci;
use nidemall;
create user 'nidemall'@'%' identified with mysql_native_password by '88888888';
grant all privileges on nidemall.* to 'nidemall'@'%';
flush privileges;