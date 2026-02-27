<?php
// register.php
require 'config.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
if (!$name || !$email || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields required']);
    exit;
}
$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
try {
    $stmt->execute([$name, $email, $hash]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(409);
    echo json_encode(['error' => 'Email already exists']);
}
?>
