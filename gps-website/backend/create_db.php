<?php
declare(strict_types=1);

function gps_setup_env(string $key, string $default): string
{
    $value = getenv($key);
    if ($value === false || $value === '') {
        return $default;
    }

    return $value;
}

$host = gps_setup_env('GPS_DB_HOST', '127.0.0.1');
$rootUser = gps_setup_env('GPS_SETUP_ROOT_USER', 'root');
$rootPass = gps_setup_env('GPS_SETUP_ROOT_PASS', '');
$db = gps_setup_env('GPS_DB_NAME', 'crestech_db');
$appUser = gps_setup_env('GPS_DB_USER', 'crestech_user');
$appPass = gps_setup_env('GPS_DB_PASS', 'Crestech@12345');

$conn = new mysqli($host, $rootUser, $rootPass);
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

$databaseSql = "CREATE DATABASE IF NOT EXISTS `$db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
if ($conn->query($databaseSql) !== TRUE) {
    die('Error creating database: ' . $conn->error);
}

$userSql = "CREATE USER IF NOT EXISTS '$appUser'@'localhost' IDENTIFIED BY '$appPass'";
if ($conn->query($userSql) !== TRUE) {
    die('Error creating user: ' . $conn->error);
}

$grantSql = "GRANT ALL PRIVILEGES ON `$db`.* TO '$appUser'@'localhost'";
if ($conn->query($grantSql) !== TRUE) {
    die('Error granting privileges: ' . $conn->error);
}

if ($conn->query('FLUSH PRIVILEGES') !== TRUE) {
    die('Error flushing privileges: ' . $conn->error);
}

if (!$conn->select_db($db)) {
    die('Error selecting database: ' . $conn->error);
}

$tableSql = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB";

if ($conn->query($tableSql) !== TRUE) {
    die('Error creating users table: ' . $conn->error);
}

echo 'Setup complete. Database, user, grants, and users table are ready.';
$conn->close();
?>
