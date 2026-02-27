<?php
// config.php
$host = 'localhost';
$db   = 'crestech_db';
$appUser = 'crestech_user';
$appPass = 'Crestech@12345';
$rootUser = 'root';
$rootPass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];
try {
     $pdo = new PDO($dsn, $appUser, $appPass, $options);
     $user = $appUser;
     $pass = $appPass;
} catch (PDOException $e) {
     try {
          $pdo = new PDO($dsn, $rootUser, $rootPass, $options);
          $user = $rootUser;
          $pass = $rootPass;
     } catch (PDOException $fallbackError) {
          throw new PDOException($fallbackError->getMessage(), (int)$fallbackError->getCode());
     }
}
?>
