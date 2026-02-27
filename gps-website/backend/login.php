<?php
// login.php
require 'config.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password required']);
    exit;
}
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();
if ($user && password_verify($password, $user['password'])) {
    echo json_encode(['success' => true, 'user' => ['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email']]]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
}
?>
