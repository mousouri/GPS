CREATE DATABASE IF NOT EXISTS `crestech_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'crestech_user'@'localhost'
  IDENTIFIED BY 'Crestech@12345';

GRANT ALL PRIVILEGES ON `crestech_db`.* TO 'crestech_user'@'localhost';
FLUSH PRIVILEGES;

USE `crestech_db`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
