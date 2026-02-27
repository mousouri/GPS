<?php
declare(strict_types=1);

function gps_env(string $key, string $default): string
{
    $value = getenv($key);
    if ($value === false || $value === '') {
        return $default;
    }

    return $value;
}

$host = gps_env('GPS_DB_HOST', '127.0.0.1');
$db = gps_env('GPS_DB_NAME', 'crestech_db');
$dbUser = gps_env('GPS_DB_USER', 'crestech_user');
$dbPass = gps_env('GPS_DB_PASS', 'Crestech@12345');
$charset = gps_env('GPS_DB_CHARSET', 'utf8mb4');

$dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', $host, $db, $charset);
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $dbUser, $dbPass, $options);
} catch (PDOException $exception) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'error' => 'Database connection failed. Check GPS_DB_* environment variables.',
        'details' => $exception->getMessage(),
    ]);
    exit;
}
?>
