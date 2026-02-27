<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

gps_bootstrap_api($pdo);

$action = isset($_GET['action']) ? trim((string) $_GET['action']) : '';
if ($action === '') {
    gps_respond(['error' => 'Missing action parameter.'], 400);
}

switch ($action) {
    case 'login':
        gps_handle_login($pdo);
        break;
    case 'register':
        gps_handle_register($pdo);
        break;
    case 'me':
        gps_handle_me($pdo);
        break;
    case 'logout':
        gps_handle_logout($pdo);
        break;
    case 'forgot_password':
        gps_handle_forgot_password($pdo);
        break;
    case 'reset_password':
        gps_handle_reset_password($pdo);
        break;
    case 'dashboard':
        gps_handle_dashboard($pdo);
        break;
    case 'vehicles':
        gps_handle_vehicles($pdo);
        break;
    case 'geofences':
        gps_handle_geofences($pdo);
        break;
    case 'reports':
        gps_handle_reports($pdo);
        break;
    case 'admin_dashboard':
        gps_handle_admin_dashboard($pdo);
        break;
    case 'admin_billing':
        gps_handle_admin_billing($pdo);
        break;
    case 'admin_audit_log':
        gps_handle_admin_audit_log($pdo);
        break;
    case 'admin_user':
        gps_handle_admin_user($pdo);
        break;
    case 'profile':
        gps_handle_profile($pdo);
        break;
    default:
        gps_respond(['error' => 'Unknown action.'], 404);
}

function gps_bootstrap_api(PDO $pdo): void
{
    $allowedOrigin = gps_env('GPS_FRONTEND_ORIGIN', 'http://localhost:5173');
    $requestOrigin = isset($_SERVER['HTTP_ORIGIN']) ? (string) $_SERVER['HTTP_ORIGIN'] : '';

    if ($allowedOrigin === '*' || $requestOrigin === '' || $requestOrigin === $allowedOrigin) {
        header('Access-Control-Allow-Origin: ' . ($allowedOrigin === '*' || $requestOrigin === '' ? $allowedOrigin : $requestOrigin));
    }

    header('Vary: Origin');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Content-Type: application/json');

    if (gps_method() === 'OPTIONS') {
        http_response_code(204);
        exit;
    }

    gps_ensure_schema($pdo);
    gps_seed_defaults($pdo);
    gps_purge_expired_sessions($pdo);
}

function gps_handle_login(PDO $pdo): void
{
    gps_require_method(['POST']);
    $payload = gps_json_input();

    $email = strtolower(trim((string) ($payload['email'] ?? '')));
    $password = (string) ($payload['password'] ?? '');
    $role = trim((string) ($payload['role'] ?? ''));

    if ($email === '' || $password === '') {
        gps_respond(['error' => 'Email and password are required.'], 400);
    }

    $statement = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    $statement->execute([$email]);
    $user = $statement->fetch();

    if (!$user || !password_verify($password, (string) $user['password'])) {
        gps_record_audit($pdo, null, 'Failed Login Attempt', $email, 'auth', 'critical', 'Failed login attempt detected');
        gps_respond(['error' => 'Invalid credentials.'], 401);
    }

    if ($role !== '' && $user['role'] !== $role) {
        gps_respond(['error' => 'This account does not have the required role.'], 403);
    }

    if ((string) ($user['status'] ?? 'active') === 'suspended') {
        gps_respond(['error' => 'This account is suspended.'], 403);
    }

    $pdo->prepare('UPDATE users SET last_login_at = NOW() WHERE id = ?')->execute([(int) $user['id']]);
    $user = gps_fetch_user($pdo, (int) $user['id']);
    $token = gps_issue_session($pdo, (int) $user['id']);
    gps_record_audit($pdo, $user, $user['role'] === 'admin' ? 'Admin Login' : 'User Login', $user['email'], 'auth', 'info', 'Successful authentication');

    gps_respond([
        'success' => true,
        'token' => $token,
        'user' => gps_format_user($user),
    ]);
}

function gps_handle_register(PDO $pdo): void
{
    gps_require_method(['POST']);
    $payload = gps_json_input();

    $name = trim((string) ($payload['name'] ?? ''));
    $email = strtolower(trim((string) ($payload['email'] ?? '')));
    $password = (string) ($payload['password'] ?? '');
    $company = trim((string) ($payload['company'] ?? ''));
    $plan = trim((string) ($payload['plan'] ?? 'Professional'));

    if ($name === '' || $email === '' || $password === '') {
        gps_respond(['error' => 'Name, email, and password are required.'], 400);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        gps_respond(['error' => 'Enter a valid email address.'], 400);
    }

    if (strlen($password) < 6) {
        gps_respond(['error' => 'Password must be at least 6 characters.'], 400);
    }

    $exists = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $exists->execute([$email]);
    if ($exists->fetch()) {
        gps_respond(['error' => 'Email already exists.'], 409);
    }

    $insert = $pdo->prepare(
        'INSERT INTO users (name, email, password, role, company, plan, status, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $insert->execute([
        $name,
        $email,
        password_hash($password, PASSWORD_DEFAULT),
        'user',
        $company !== '' ? $company : 'Independent Fleet',
        gps_normalize_plan($plan),
        'active',
        '/images/person-man-2.jpg',
    ]);

    $userId = (int) $pdo->lastInsertId();
    $user = gps_fetch_user($pdo, $userId);
    gps_seed_user_assets($pdo, $user);

    $token = gps_issue_session($pdo, $userId);
    gps_record_audit($pdo, $user, 'User Created', $email, 'user', 'low', 'Self-service registration completed');

    gps_respond([
        'success' => true,
        'token' => $token,
        'user' => gps_format_user($user),
    ], 201);
}

function gps_handle_me(PDO $pdo): void
{
    gps_require_method(['GET']);
    $user = gps_require_auth($pdo);

    gps_respond([
        'success' => true,
        'user' => gps_format_user($user),
    ]);
}

function gps_handle_logout(PDO $pdo): void
{
    gps_require_method(['POST']);
    $token = gps_extract_token();
    $user = $token !== null ? gps_user_from_token($pdo, $token) : null;

    if ($token !== null) {
        $pdo->prepare('DELETE FROM sessions WHERE token = ?')->execute([$token]);
    }

    if ($user) {
        gps_record_audit($pdo, $user, $user['role'] === 'admin' ? 'Admin Logout' : 'User Logout', $user['email'], 'auth', 'info', 'Session terminated');
    }

    gps_respond(['success' => true]);
}

function gps_handle_forgot_password(PDO $pdo): void
{
    gps_require_method(['POST']);
    $payload = gps_json_input();
    $email = strtolower(trim((string) ($payload['email'] ?? '')));

    if ($email === '') {
        gps_respond(['error' => 'Email is required.'], 400);
    }

    $statement = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    $statement->execute([$email]);
    $user = $statement->fetch();

    if (!$user) {
        gps_respond([
            'success' => true,
            'message' => 'If that email exists, a reset link has been generated.',
        ]);
    }

    $token = bin2hex(random_bytes(24));
    $expiresAt = (new DateTimeImmutable('+1 hour'))->format('Y-m-d H:i:s');

    $pdo->prepare('DELETE FROM password_resets WHERE user_id = ?')->execute([(int) $user['id']]);
    $pdo->prepare(
        'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)'
    )->execute([(int) $user['id'], $token, $expiresAt]);

    $resetLink = rtrim(gps_env('GPS_APP_URL', 'http://localhost:5173'), '/') . '/reset-password?token=' . $token;
    $message = sprintf("Use this reset link: %s", $resetLink);
    @mail($email, 'CRESTECH password reset', $message);

    gps_record_audit($pdo, $user, 'Password Reset Requested', $email, 'security', 'medium', 'Password reset token issued');

    gps_respond([
        'success' => true,
        'message' => 'If that email exists, a reset link has been generated.',
        'debugResetToken' => gps_env('GPS_DEBUG_EXPOSE_RESET_TOKEN', '1') === '1' ? $token : null,
        'resetLink' => gps_env('GPS_DEBUG_EXPOSE_RESET_TOKEN', '1') === '1' ? $resetLink : null,
    ]);
}

function gps_handle_reset_password(PDO $pdo): void
{
    gps_require_method(['POST']);
    $payload = gps_json_input();

    $token = trim((string) ($payload['token'] ?? ''));
    $password = (string) ($payload['password'] ?? '');

    if ($token === '' || $password === '') {
        gps_respond(['error' => 'Token and new password are required.'], 400);
    }

    if (strlen($password) < 6) {
        gps_respond(['error' => 'Password must be at least 6 characters.'], 400);
    }

    $statement = $pdo->prepare(
        'SELECT pr.*, u.email, u.name, u.role
         FROM password_resets pr
         INNER JOIN users u ON u.id = pr.user_id
         WHERE pr.token = ? AND pr.used_at IS NULL AND pr.expires_at > NOW()
         LIMIT 1'
    );
    $statement->execute([$token]);
    $reset = $statement->fetch();

    if (!$reset) {
        gps_respond(['error' => 'This reset token is invalid or expired.'], 400);
    }

    $pdo->prepare('UPDATE users SET password = ? WHERE id = ?')->execute([
        password_hash($password, PASSWORD_DEFAULT),
        (int) $reset['user_id'],
    ]);
    $pdo->prepare('UPDATE password_resets SET used_at = NOW() WHERE id = ?')->execute([(int) $reset['id']]);
    $pdo->prepare('DELETE FROM sessions WHERE user_id = ?')->execute([(int) $reset['user_id']]);

    gps_record_audit($pdo, $reset, 'Password Reset Completed', $reset['email'], 'security', 'info', 'Password updated from reset flow');

    gps_respond(['success' => true]);
}

function gps_handle_dashboard(PDO $pdo): void
{
    gps_require_method(['GET']);
    $user = gps_require_auth($pdo);
    $vehicles = gps_vehicle_rows($pdo, (int) $user['id']);
    $geofences = gps_geofence_rows($pdo, (int) $user['id']);

    $alerts = [];
    foreach ($vehicles as $vehicle) {
        if ((int) $vehicle['fuel'] < 35) {
            $alerts[] = [
                'type' => 'warning',
                'message' => $vehicle['name'] . ' fuel level below 35%',
                'time' => 'Live',
            ];
        }
        if ((int) $vehicle['battery'] < 40) {
            $alerts[] = [
                'type' => 'danger',
                'message' => $vehicle['name'] . ' battery below 40%',
                'time' => 'Live',
            ];
        }
    }

    foreach ($geofences as $zone) {
        if ((int) $zone['alerts'] > 0) {
            $alerts[] = [
                'type' => 'info',
                'message' => $zone['name'] . ' generated ' . $zone['alerts'] . ' recent alerts',
                'time' => '7d',
            ];
        }
    }

    gps_respond([
        'success' => true,
        'stats' => [
            'totalVehicles' => count($vehicles),
            'activeVehicles' => count(array_filter($vehicles, static function (array $vehicle): bool {
                return $vehicle['status'] === 'active';
            })),
            'idleVehicles' => count(array_filter($vehicles, static function (array $vehicle): bool {
                return $vehicle['status'] === 'idle';
            })),
            'maintenanceVehicles' => count(array_filter($vehicles, static function (array $vehicle): bool {
                return $vehicle['status'] === 'maintenance';
            })),
        ],
        'vehicles' => $vehicles,
        'alerts' => array_slice($alerts, 0, 6),
    ]);
}

function gps_handle_vehicles(PDO $pdo): void
{
    gps_require_method(['GET']);
    $user = gps_require_auth($pdo);

    $targetUserId = (int) $user['id'];
    if ($user['role'] === 'admin' && isset($_GET['user_id']) && ctype_digit((string) $_GET['user_id'])) {
        $targetUserId = (int) $_GET['user_id'];
    }

    gps_respond([
        'success' => true,
        'vehicles' => gps_vehicle_rows($pdo, $targetUserId),
    ]);
}

function gps_handle_geofences(PDO $pdo): void
{
    $user = gps_require_auth($pdo);

    if (gps_method() === 'GET') {
        gps_respond([
            'success' => true,
            'geofences' => gps_geofence_rows($pdo, (int) $user['id']),
        ]);
    }

    gps_require_method(['POST']);
    $payload = gps_json_input();

    $name = trim((string) ($payload['name'] ?? ''));
    $type = trim((string) ($payload['type'] ?? 'circle'));
    $radiusMeters = isset($payload['radiusMeters']) ? (int) $payload['radiusMeters'] : 500;
    $color = trim((string) ($payload['color'] ?? '#06b6d4'));
    $latitude = isset($payload['latitude']) ? (float) $payload['latitude'] : 40.7128;
    $longitude = isset($payload['longitude']) ? (float) $payload['longitude'] : -74.0060;

    if ($name === '') {
        gps_respond(['error' => 'Zone name is required.'], 400);
    }

    $code = gps_create_code('GF');
    $insert = $pdo->prepare(
        'INSERT INTO geofences
        (geofence_code, user_id, name, type, status, alerts_count, radius_meters, color, vehicles_inside, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $insert->execute([
        $code,
        (int) $user['id'],
        $name,
        in_array($type, ['circle', 'polygon', 'rectangle'], true) ? $type : 'circle',
        'active',
        0,
        max(50, $radiusMeters),
        $color !== '' ? $color : '#06b6d4',
        0,
        $latitude,
        $longitude,
    ]);

    gps_record_audit($pdo, $user, 'Geofence Created', $code, 'config', 'low', 'Created geofence ' . $name);

    gps_respond([
        'success' => true,
        'geofences' => gps_geofence_rows($pdo, (int) $user['id']),
    ], 201);
}

function gps_handle_reports(PDO $pdo): void
{
    gps_require_method(['GET']);
    $user = gps_require_auth($pdo);

    $statement = $pdo->prepare(
        'SELECT * FROM reports WHERE user_id = ? ORDER BY report_date DESC, id DESC'
    );
    $statement->execute([(int) $user['id']]);
    $rows = $statement->fetchAll();

    $reports = array_map('gps_format_report', $rows);

    $totalDistance = 0;
    $totalFuel = 0;
    $totalTrips = 0;
    $speedSum = 0;
    $activeHours = 0;

    foreach ($rows as $row) {
        $totalDistance += (int) $row['distance_miles'];
        $totalFuel += (int) $row['fuel_gallons'];
        $totalTrips += (int) $row['trip_count'];
        $speedSum += (int) $row['avg_speed'];
        $activeHours += (int) $row['active_hours'];
    }

    $reportCount = max(1, count($rows));
    $tripData = array_map(static function (array $row): array {
        return [
            'date' => date('M d', strtotime((string) $row['report_date'])),
            'trips' => (int) $row['trip_count'],
            'distance' => (int) $row['distance_miles'],
            'fuel' => (int) $row['fuel_gallons'],
            'avgSpeed' => (int) $row['avg_speed'],
        ];
    }, $rows);

    gps_respond([
        'success' => true,
        'summary' => [
            'totalDistance' => $totalDistance,
            'fuelUsed' => $totalFuel,
            'avgSpeed' => (int) round($speedSum / $reportCount),
            'activeHours' => $activeHours,
            'totalTrips' => $totalTrips,
        ],
        'tripData' => $tripData,
        'reports' => $reports,
    ]);
}

function gps_handle_admin_dashboard(PDO $pdo): void
{
    gps_require_method(['GET']);
    gps_require_auth($pdo, 'admin');

    $totalUsers = (int) $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'user'")->fetchColumn();
    $activeDevices = (int) $pdo->query("SELECT COUNT(*) FROM vehicles WHERE status = 'active'")->fetchColumn();
    $newSignups = (int) $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'user' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)")->fetchColumn();
    $revenueMTD = (int) $pdo->query("SELECT COALESCE(SUM(amount_cents), 0) FROM invoices WHERE status = 'completed' AND YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE())")->fetchColumn();

    $recentUsersStatement = $pdo->query(
        "SELECT id, name, email, plan, status, company, avatar, created_at
         FROM users
         WHERE role = 'user'
         ORDER BY created_at DESC
         LIMIT 6"
    );
    $recentUsers = [];
    foreach ($recentUsersStatement->fetchAll() as $row) {
        $devices = $pdo->prepare('SELECT COUNT(*) FROM vehicles WHERE user_id = ?');
        $devices->execute([(int) $row['id']]);
        $revenue = $pdo->prepare("SELECT COALESCE(SUM(amount_cents), 0) FROM invoices WHERE user_id = ? AND status = 'completed'");
        $revenue->execute([(int) $row['id']]);

        $recentUsers[] = [
            'id' => 'USR-' . (int) $row['id'],
            'name' => $row['company'] !== '' ? $row['company'] : $row['name'],
            'email' => $row['email'],
            'plan' => $row['plan'],
            'devices' => (int) $devices->fetchColumn(),
            'status' => $row['status'],
            'revenue' => '$' . number_format(((int) $revenue->fetchColumn()) / 100, 0) . '/mo',
            'joinDate' => date('M d, Y', strtotime((string) $row['created_at'])),
            'avatar' => $row['avatar'] !== '' ? $row['avatar'] : '/images/person-businessman.jpg',
        ];
    }

    $revenueRows = $pdo->query(
        "SELECT DATE_FORMAT(created_at, '%b') AS month_label, COALESCE(SUM(CASE WHEN status = 'completed' THEN amount_cents ELSE 0 END), 0) AS revenue
         FROM invoices
         GROUP BY YEAR(created_at), MONTH(created_at)
         ORDER BY YEAR(created_at) DESC, MONTH(created_at) DESC
         LIMIT 6"
    )->fetchAll();
    $revenueRows = array_reverse($revenueRows);

    $revenueData = array_map(static function (array $row): array {
        return [
            'month' => $row['month_label'],
            'value' => (int) round(((int) $row['revenue']) / 100),
        ];
    }, $revenueRows);

    gps_respond([
        'success' => true,
        'stats' => [
            'totalUsers' => $totalUsers,
            'revenueMTD' => '$' . number_format($revenueMTD / 100, 0),
            'activeDevices' => $activeDevices,
            'newSignups' => $newSignups,
        ],
        'recentUsers' => $recentUsers,
        'systemHealth' => [
            ['label' => 'API Server', 'status' => 'operational', 'uptime' => '99.99%'],
            ['label' => 'Database Cluster', 'status' => 'operational', 'uptime' => '99.97%'],
            ['label' => 'GPS Processing', 'status' => 'operational', 'uptime' => '99.91%'],
            ['label' => 'Storage', 'status' => 'operational', 'uptime' => '99.99%'],
        ],
        'revenueData' => $revenueData,
    ]);
}

function gps_handle_admin_billing(PDO $pdo): void
{
    gps_require_method(['GET']);
    gps_require_auth($pdo, 'admin');

    $monthlyRevenue = (int) $pdo->query("SELECT COALESCE(SUM(amount_cents), 0) FROM invoices WHERE status = 'completed' AND YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE())")->fetchColumn();
    $activeSubscriptions = (int) $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'user' AND status = 'active'")->fetchColumn();
    $failedPayments = (int) $pdo->query("SELECT COUNT(*) FROM invoices WHERE status = 'failed'")->fetchColumn();
    $avgRevenuePerUser = $activeSubscriptions > 0 ? (int) round(($monthlyRevenue / 100) / $activeSubscriptions) : 0;

    $monthlyRows = $pdo->query(
        "SELECT DATE_FORMAT(created_at, '%b') AS month_label, COALESCE(SUM(CASE WHEN status = 'completed' THEN amount_cents ELSE 0 END), 0) AS revenue
         FROM invoices
         GROUP BY YEAR(created_at), MONTH(created_at)
         ORDER BY YEAR(created_at) DESC, MONTH(created_at) DESC
         LIMIT 6"
    )->fetchAll();
    $monthlyRows = array_reverse($monthlyRows);

    $planRows = $pdo->query(
        "SELECT u.plan, COUNT(DISTINCT u.id) AS users, COALESCE(SUM(CASE WHEN i.status = 'completed' THEN i.amount_cents ELSE 0 END), 0) AS revenue
         FROM users u
         LEFT JOIN invoices i ON i.user_id = u.id
         WHERE u.role = 'user'
         GROUP BY u.plan
         ORDER BY revenue DESC"
    )->fetchAll();

    $totalRevenue = 0;
    foreach ($planRows as $row) {
        $totalRevenue += (int) $row['revenue'];
    }

    $transactions = $pdo->query(
        "SELECT i.invoice_code, i.amount_cents, i.status, i.payment_method, i.created_at, u.plan, u.company, u.name
         FROM invoices i
         INNER JOIN users u ON u.id = i.user_id
         ORDER BY i.created_at DESC, i.id DESC
         LIMIT 20"
    )->fetchAll();

    $transactionData = array_map(static function (array $row): array {
        return [
            'id' => $row['invoice_code'],
            'customer' => $row['company'] !== '' ? $row['company'] : $row['name'],
            'plan' => $row['plan'],
            'amount' => '$' . number_format(((int) $row['amount_cents']) / 100, 2),
            'date' => date('M d, Y', strtotime((string) $row['created_at'])),
            'status' => $row['status'],
            'method' => $row['payment_method'],
        ];
    }, $transactions);

    $planBreakdown = [];
    foreach ($planRows as $row) {
        $percent = $totalRevenue > 0 ? (int) round((((int) $row['revenue']) / $totalRevenue) * 100) : 0;
        $planBreakdown[] = [
            'plan' => $row['plan'],
            'users' => (int) $row['users'],
            'revenue' => (int) round(((int) $row['revenue']) / 100),
            'percent' => $percent,
            'color' => $row['plan'] === 'Enterprise' ? '#f59e0b' : ($row['plan'] === 'Professional' ? '#06b6d4' : '#84cc16'),
        ];
    }

    gps_respond([
        'success' => true,
        'summary' => [
            'monthlyRevenue' => '$' . number_format($monthlyRevenue / 100, 0),
            'activeSubscriptions' => $activeSubscriptions,
            'avgRevenuePerUser' => '$' . number_format($avgRevenuePerUser, 0),
            'failedPayments' => $failedPayments,
        ],
        'monthlyRevenue' => array_map(static function (array $row): array {
            return [
                'month' => $row['month_label'],
                'revenue' => (int) round(((int) $row['revenue']) / 100),
            ];
        }, $monthlyRows),
        'planBreakdown' => $planBreakdown,
        'transactions' => $transactionData,
    ]);
}

function gps_handle_admin_audit_log(PDO $pdo): void
{
    gps_require_method(['GET']);
    gps_require_auth($pdo, 'admin');

    $summary = [
        'totalEvents' => (int) $pdo->query('SELECT COUNT(*) FROM audit_logs')->fetchColumn(),
        'criticalEvents' => (int) $pdo->query("SELECT COUNT(*) FROM audit_logs WHERE severity = 'critical'")->fetchColumn(),
        'adminActions' => (int) $pdo->query("SELECT COUNT(*) FROM audit_logs WHERE category <> 'system'")->fetchColumn(),
        'systemEvents' => (int) $pdo->query("SELECT COUNT(*) FROM audit_logs WHERE category = 'system'")->fetchColumn(),
    ];

    $entries = $pdo->query(
        'SELECT id, actor_name, action, target, category, severity, created_at, ip_address, details
         FROM audit_logs
         ORDER BY created_at DESC, id DESC
         LIMIT 50'
    )->fetchAll();

    $entryData = array_map(static function (array $row): array {
        return [
            'id' => (int) $row['id'],
            'admin' => $row['actor_name'],
            'action' => $row['action'],
            'target' => $row['target'],
            'category' => $row['category'],
            'severity' => $row['severity'],
            'timestamp' => date('Y-m-d H:i:s', strtotime((string) $row['created_at'])),
            'ip' => $row['ip_address'],
            'details' => $row['details'],
        ];
    }, $entries);

    gps_respond([
        'success' => true,
        'summary' => $summary,
        'entries' => $entryData,
    ]);
}

function gps_handle_admin_user(PDO $pdo): void
{
    $admin = gps_require_auth($pdo, 'admin');
    $identifier = isset($_GET['id']) ? trim((string) $_GET['id']) : '';

    if ($identifier === '') {
        gps_respond(['error' => 'Missing user identifier.'], 400);
    }

    $userId = gps_resolve_user_id($identifier);
    if ($userId === null) {
        gps_respond(['error' => 'Unsupported user identifier.'], 400);
    }

    if (gps_method() === 'POST') {
        $payload = gps_json_input();
        $action = trim((string) ($payload['action'] ?? ''));

        if ($action === 'suspend' || $action === 'reactivate') {
            $nextStatus = $action === 'suspend' ? 'suspended' : 'active';
            $pdo->prepare('UPDATE users SET status = ? WHERE id = ? AND role = ?')->execute([$nextStatus, $userId, 'user']);
            $targetUser = gps_fetch_user($pdo, $userId);
            if (!$targetUser) {
                gps_respond(['error' => 'User not found.'], 404);
            }
            gps_record_audit(
                $pdo,
                $admin,
                $action === 'suspend' ? 'User Suspended' : 'User Reactivated',
                $targetUser['email'],
                'user',
                $action === 'suspend' ? 'high' : 'low',
                'Admin changed account status'
            );
        }
    }

    $user = gps_fetch_user($pdo, $userId);
    if (!$user || $user['role'] !== 'user') {
        gps_respond(['error' => 'User not found.'], 404);
    }

    $deviceRows = gps_vehicle_rows($pdo, $userId);
    $activityStatement = $pdo->prepare(
        'SELECT action, created_at, category, details FROM audit_logs WHERE actor_user_id = ? OR target = ? ORDER BY created_at DESC LIMIT 12'
    );
    $activityStatement->execute([$userId, $user['email']]);
    $activityRows = $activityStatement->fetchAll();

    $invoiceStatement = $pdo->prepare(
        'SELECT invoice_code, amount_cents, status, created_at FROM invoices WHERE user_id = ? ORDER BY created_at DESC'
    );
    $invoiceStatement->execute([$userId]);
    $invoiceRows = $invoiceStatement->fetchAll();

    $completedRevenue = 0;
    foreach ($invoiceRows as $row) {
        if ($row['status'] === 'completed') {
            $completedRevenue += (int) $row['amount_cents'];
        }
    }

    gps_respond([
        'success' => true,
        'user' => [
            'id' => 'USR-' . (int) $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'company' => $user['company'],
            'plan' => $user['plan'],
            'role' => $user['role'] === 'user' ? 'Fleet Manager' : 'Administrator',
            'status' => $user['status'],
            'joinDate' => date('F d, Y', strtotime((string) $user['created_at'])),
            'lastLogin' => $user['last_login_at'] ? date('M d, Y H:i', strtotime((string) $user['last_login_at'])) : 'Never',
            'avatar' => $user['avatar'] !== '' ? $user['avatar'] : '/images/person-woman-4.jpg',
            'devices' => count($deviceRows),
            'monthlySpend' => '$' . number_format(gps_plan_monthly_price($user['plan']), 0),
            'totalSpent' => '$' . number_format($completedRevenue / 100, 0),
        ],
        'devices' => array_map(static function (array $vehicle): array {
            return [
                'id' => $vehicle['id'],
                'name' => $vehicle['type'],
                'vehicle' => $vehicle['name'],
                'status' => $vehicle['status'] === 'maintenance' ? 'offline' : 'online',
                'lastPing' => date('M d H:i', strtotime((string) $vehicle['lastPingAt'])),
                'battery' => (int) $vehicle['battery'],
            ];
        }, $deviceRows),
        'activity' => array_map(static function (array $row): array {
            return [
                'action' => $row['action'],
                'time' => date('M d H:i', strtotime((string) $row['created_at'])),
                'type' => $row['category'],
                'details' => $row['details'],
            ];
        }, $activityRows),
        'invoices' => array_map(static function (array $row): array {
            return [
                'id' => $row['invoice_code'],
                'date' => date('M d, Y', strtotime((string) $row['created_at'])),
                'amount' => '$' . number_format(((int) $row['amount_cents']) / 100, 2),
                'status' => $row['status'],
            ];
        }, $invoiceRows),
    ]);
}

function gps_handle_profile(PDO $pdo): void
{
    $user = gps_require_auth($pdo);

    if (gps_method() === 'GET') {
        gps_respond([
            'success' => true,
            'user' => gps_format_user($user),
            'preferences' => [
                'emailAlerts' => true,
                'smsAlerts' => false,
                'pushAlerts' => true,
                'speedAlerts' => true,
                'geofenceAlerts' => true,
                'maintenanceAlerts' => true,
                'fuelAlerts' => false,
            ],
        ]);
    }

    if (gps_method() === 'PUT') {
        $payload = gps_json_input();
        $name = trim((string) ($payload['name'] ?? $user['name']));
        $email = strtolower(trim((string) ($payload['email'] ?? $user['email'])));
        $company = trim((string) ($payload['company'] ?? $user['company']));
        $phone = trim((string) ($payload['phone'] ?? $user['phone']));
        $timezone = trim((string) ($payload['timezone'] ?? $user['timezone']));

        $duplicate = $pdo->prepare('SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1');
        $duplicate->execute([$email, (int) $user['id']]);
        if ($duplicate->fetch()) {
            gps_respond(['error' => 'That email is already in use.'], 409);
        }

        $pdo->prepare(
            'UPDATE users SET name = ?, email = ?, company = ?, phone = ?, timezone = ? WHERE id = ?'
        )->execute([$name, $email, $company, $phone, $timezone, (int) $user['id']]);

        $updated = gps_fetch_user($pdo, (int) $user['id']);
        gps_record_audit($pdo, $updated, 'Profile Updated', $updated['email'], 'user', 'low', 'Updated profile details');

        gps_respond([
            'success' => true,
            'user' => gps_format_user($updated),
        ]);
    }

    if (gps_method() === 'POST') {
        $payload = gps_json_input();
        $currentPassword = (string) ($payload['currentPassword'] ?? '');
        $newPassword = (string) ($payload['newPassword'] ?? '');

        if ($currentPassword === '' || $newPassword === '') {
            gps_respond(['error' => 'Current and new password are required.'], 400);
        }

        if (!password_verify($currentPassword, (string) $user['password'])) {
            gps_respond(['error' => 'Current password is incorrect.'], 400);
        }

        if (strlen($newPassword) < 6) {
            gps_respond(['error' => 'New password must be at least 6 characters.'], 400);
        }

        $pdo->prepare('UPDATE users SET password = ? WHERE id = ?')->execute([
            password_hash($newPassword, PASSWORD_DEFAULT),
            (int) $user['id'],
        ]);

        gps_record_audit($pdo, $user, 'Changed Password', $user['email'], 'security', 'medium', 'Updated password from profile settings');
        gps_respond(['success' => true]);
    }

    gps_respond(['error' => 'Unsupported method.'], 405);
}

function gps_require_method(array $methods): void
{
    if (!in_array(gps_method(), $methods, true)) {
        gps_respond(['error' => 'Unsupported method.'], 405);
    }
}

function gps_method(): string
{
    return strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
}

function gps_json_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        gps_respond(['error' => 'Invalid JSON payload.'], 400);
    }

    return $decoded;
}

function gps_respond(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function gps_extract_token(): ?string
{
    $header = '';

    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $header = (string) $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (isset($headers['Authorization'])) {
            $header = (string) $headers['Authorization'];
        }
    }

    if ($header === '' || stripos($header, 'Bearer ') !== 0) {
        return null;
    }

    return trim(substr($header, 7));
}

function gps_require_auth(PDO $pdo, string $requiredRole = ''): array
{
    $token = gps_extract_token();
    if ($token === null) {
        gps_respond(['error' => 'Authentication required.'], 401);
    }

    $user = gps_user_from_token($pdo, $token);
    if (!$user) {
        gps_respond(['error' => 'Your session has expired.'], 401);
    }

    if ($requiredRole !== '' && $user['role'] !== $requiredRole) {
        gps_respond(['error' => 'You do not have access to this resource.'], 403);
    }

    return $user;
}

function gps_user_from_token(PDO $pdo, string $token): ?array
{
    $statement = $pdo->prepare(
        'SELECT u.*
         FROM sessions s
         INNER JOIN users u ON u.id = s.user_id
         WHERE s.token = ? AND s.expires_at > NOW()
         LIMIT 1'
    );
    $statement->execute([$token]);
    $user = $statement->fetch();

    return $user ?: null;
}

function gps_issue_session(PDO $pdo, int $userId): string
{
    $token = bin2hex(random_bytes(32));
    $ttlHours = max(1, (int) gps_env('GPS_SESSION_TTL_HOURS', '12'));
    $expiresAt = (new DateTimeImmutable('+' . $ttlHours . ' hours'))->format('Y-m-d H:i:s');

    $pdo->prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)')->execute([
        $userId,
        $token,
        $expiresAt,
    ]);

    return $token;
}

function gps_purge_expired_sessions(PDO $pdo): void
{
    $pdo->exec('DELETE FROM sessions WHERE expires_at <= NOW()');
}

function gps_fetch_user(PDO $pdo, int $userId): ?array
{
    $statement = $pdo->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
    $statement->execute([$userId]);
    $user = $statement->fetch();

    return $user ?: null;
}

function gps_format_user(array $user): array
{
    return [
        'id' => 'USR-' . (int) $user['id'],
        'numericId' => (int) $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role'],
        'avatar' => $user['avatar'] !== '' ? $user['avatar'] : ($user['role'] === 'admin' ? '/images/person-woman-4.jpg' : '/images/person-man-2.jpg'),
        'company' => $user['company'],
        'plan' => $user['plan'],
        'phone' => $user['phone'],
        'timezone' => $user['timezone'],
        'status' => $user['status'],
        'joinDate' => date('Y-m-d', strtotime((string) $user['created_at'])),
        'lastLoginAt' => $user['last_login_at'],
    ];
}

function gps_vehicle_rows(PDO $pdo, int $userId): array
{
    $statement = $pdo->prepare(
        'SELECT vehicle_code, name, status, speed, fuel_level, battery_level, driver_name, location_label, latitude, longitude, vehicle_type, last_ping_at
         FROM vehicles
         WHERE user_id = ?
         ORDER BY name ASC'
    );
    $statement->execute([$userId]);
    $rows = $statement->fetchAll();

    return array_map(static function (array $row): array {
        return [
            'id' => $row['vehicle_code'],
            'name' => $row['name'],
            'status' => $row['status'],
            'speed' => (int) $row['speed'],
            'fuel' => (int) $row['fuel_level'],
            'battery' => (int) $row['battery_level'],
            'driver' => $row['driver_name'],
            'location' => $row['location_label'],
            'lat' => (float) $row['latitude'],
            'lng' => (float) $row['longitude'],
            'type' => $row['vehicle_type'],
            'lastPingAt' => $row['last_ping_at'],
        ];
    }, $rows);
}

function gps_geofence_rows(PDO $pdo, int $userId): array
{
    $statement = $pdo->prepare(
        'SELECT geofence_code, name, type, status, alerts_count, radius_meters, color, vehicles_inside, latitude, longitude
         FROM geofences
         WHERE user_id = ?
         ORDER BY name ASC'
    );
    $statement->execute([$userId]);
    $rows = $statement->fetchAll();

    return array_map(static function (array $row): array {
        return [
            'id' => $row['geofence_code'],
            'name' => $row['name'],
            'type' => $row['type'],
            'status' => $row['status'],
            'alerts' => (int) $row['alerts_count'],
            'radius' => (int) $row['radius_meters'],
            'color' => $row['color'],
            'vehicles' => (int) $row['vehicles_inside'],
            'lat' => (float) $row['latitude'],
            'lng' => (float) $row['longitude'],
        ];
    }, $rows);
}

function gps_format_report(array $row): array
{
    $sizeKb = (int) $row['file_size_kb'];
    $size = $sizeKb >= 1024
        ? number_format($sizeKb / 1024, 1) . ' MB'
        : $sizeKb . ' KB';

    return [
        'id' => $row['report_code'],
        'name' => $row['name'],
        'type' => $row['type'],
        'date' => date('M d, Y', strtotime((string) $row['report_date'])),
        'size' => $size,
        'status' => $row['status'],
        'tripCount' => (int) $row['trip_count'],
        'distance' => (int) $row['distance_miles'],
        'fuel' => (int) $row['fuel_gallons'],
        'avgSpeed' => (int) $row['avg_speed'],
        'activeHours' => (int) $row['active_hours'],
    ];
}

function gps_record_audit(
    PDO $pdo,
    ?array $actor,
    string $action,
    string $target,
    string $category,
    string $severity,
    string $details
): void {
    $actorId = $actor && isset($actor['id']) ? (int) $actor['id'] : null;
    $actorName = $actor ? (string) ($actor['name'] ?? 'System') : 'System';
    $ipAddress = isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : '127.0.0.1';

    $statement = $pdo->prepare(
        'INSERT INTO audit_logs (actor_user_id, actor_name, action, target, category, severity, details, ip_address)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $statement->execute([$actorId, $actorName, $action, $target, $category, $severity, $details, $ipAddress]);
}

function gps_resolve_user_id(string $identifier): ?int
{
    if (strpos($identifier, 'USR-') === 0) {
        $value = substr($identifier, 4);
        return ctype_digit($value) ? (int) $value : null;
    }

    return ctype_digit($identifier) ? (int) $identifier : null;
}

function gps_create_code(string $prefix): string
{
    return $prefix . '-' . strtoupper(substr(bin2hex(random_bytes(5)), 0, 8));
}

function gps_normalize_plan(string $plan): string
{
    $normalized = strtolower($plan);
    if ($normalized === 'starter') {
        return 'Starter';
    }
    if ($normalized === 'enterprise') {
        return 'Enterprise';
    }

    return 'Professional';
}

function gps_plan_monthly_price(string $plan): int
{
    if ($plan === 'Starter') {
        return 29;
    }
    if ($plan === 'Enterprise') {
        return 199;
    }

    return 79;
}

function gps_ensure_schema(PDO $pdo): void
{
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(20) NOT NULL DEFAULT 'user',
            company VARCHAR(150) NOT NULL DEFAULT '',
            plan VARCHAR(50) NOT NULL DEFAULT 'Professional',
            phone VARCHAR(50) NOT NULL DEFAULT '',
            timezone VARCHAR(100) NOT NULL DEFAULT 'America/New_York',
            status VARCHAR(20) NOT NULL DEFAULT 'active',
            avatar VARCHAR(255) NOT NULL DEFAULT '',
            last_login_at DATETIME NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    );

    gps_add_column_if_missing($pdo, 'users', 'role', "VARCHAR(20) NOT NULL DEFAULT 'user'");
    gps_add_column_if_missing($pdo, 'users', 'company', "VARCHAR(150) NOT NULL DEFAULT ''");
    gps_add_column_if_missing($pdo, 'users', 'plan', "VARCHAR(50) NOT NULL DEFAULT 'Professional'");
    gps_add_column_if_missing($pdo, 'users', 'phone', "VARCHAR(50) NOT NULL DEFAULT ''");
    gps_add_column_if_missing($pdo, 'users', 'timezone', "VARCHAR(100) NOT NULL DEFAULT 'America/New_York'");
    gps_add_column_if_missing($pdo, 'users', 'status', "VARCHAR(20) NOT NULL DEFAULT 'active'");
    gps_add_column_if_missing($pdo, 'users', 'avatar', "VARCHAR(255) NOT NULL DEFAULT ''");
    gps_add_column_if_missing($pdo, 'users', 'last_login_at', 'DATETIME NULL');

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS sessions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            token VARCHAR(128) NOT NULL UNIQUE,
            expires_at DATETIME NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX (user_id),
            CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    );

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS password_resets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            token VARCHAR(96) NOT NULL UNIQUE,
            expires_at DATETIME NOT NULL,
            used_at DATETIME NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX (user_id),
            CONSTRAINT fk_resets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    );

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS vehicles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vehicle_code VARCHAR(20) NOT NULL UNIQUE,
            user_id INT NOT NULL,
            name VARCHAR(150) NOT NULL,
            status VARCHAR(20) NOT NULL,
            speed INT NOT NULL DEFAULT 0,
            fuel_level INT NOT NULL DEFAULT 0,
            battery_level INT NOT NULL DEFAULT 0,
            driver_name VARCHAR(120) NOT NULL DEFAULT '',
            location_label VARCHAR(255) NOT NULL DEFAULT '',
            latitude DECIMAL(10, 6) NOT NULL,
            longitude DECIMAL(10, 6) NOT NULL,
            vehicle_type VARCHAR(80) NOT NULL DEFAULT 'GPS Tracker Pro',
            last_ping_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX (user_id),
            CONSTRAINT fk_vehicles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    );

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS geofences (
            id INT AUTO_INCREMENT PRIMARY KEY,
            geofence_code VARCHAR(20) NOT NULL UNIQUE,
            user_id INT NOT NULL,
            name VARCHAR(150) NOT NULL,
            type VARCHAR(20) NOT NULL DEFAULT 'circle',
            status VARCHAR(20) NOT NULL DEFAULT 'active',
            alerts_count INT NOT NULL DEFAULT 0,
            radius_meters INT NOT NULL DEFAULT 500,
            color VARCHAR(20) NOT NULL DEFAULT '#06b6d4',
            vehicles_inside INT NOT NULL DEFAULT 0,
            latitude DECIMAL(10, 6) NOT NULL,
            longitude DECIMAL(10, 6) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX (user_id),
            CONSTRAINT fk_geofences_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    );

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS reports (
            id INT AUTO_INCREMENT PRIMARY KEY,
            report_code VARCHAR(24) NOT NULL UNIQUE,
            user_id INT NOT NULL,
            name VARCHAR(150) NOT NULL,
            type VARCHAR(80) NOT NULL,
            report_date DATE NOT NULL,
            file_size_kb INT NOT NULL DEFAULT 0,
            status VARCHAR(20) NOT NULL DEFAULT 'ready',
            trip_count INT NOT NULL DEFAULT 0,
            distance_miles INT NOT NULL DEFAULT 0,
            fuel_gallons INT NOT NULL DEFAULT 0,
            avg_speed INT NOT NULL DEFAULT 0,
            active_hours INT NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX (user_id),
            CONSTRAINT fk_reports_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    );

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS invoices (
            id INT AUTO_INCREMENT PRIMARY KEY,
            invoice_code VARCHAR(24) NOT NULL UNIQUE,
            user_id INT NOT NULL,
            amount_cents INT NOT NULL DEFAULT 0,
            status VARCHAR(20) NOT NULL DEFAULT 'completed',
            payment_method VARCHAR(120) NOT NULL DEFAULT 'Card',
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX (user_id),
            CONSTRAINT fk_invoices_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    );

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS audit_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            actor_user_id INT NULL,
            actor_name VARCHAR(120) NOT NULL DEFAULT 'System',
            action VARCHAR(150) NOT NULL,
            target VARCHAR(255) NOT NULL,
            category VARCHAR(50) NOT NULL,
            severity VARCHAR(20) NOT NULL,
            details TEXT NOT NULL,
            ip_address VARCHAR(64) NOT NULL DEFAULT '127.0.0.1',
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX (actor_user_id),
            CONSTRAINT fk_audit_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    );
}

function gps_add_column_if_missing(PDO $pdo, string $table, string $column, string $definition): void
{
    $statement = $pdo->prepare('SHOW COLUMNS FROM `' . $table . '` LIKE ?');
    $statement->execute([$column]);

    if (!$statement->fetch()) {
        $pdo->exec('ALTER TABLE `' . $table . '` ADD COLUMN `' . $column . '` ' . $definition);
    }
}

function gps_seed_defaults(PDO $pdo): void
{
    $admin = gps_seed_user($pdo, [
        'name' => 'Sarah Mitchell',
        'email' => 'admin@crestech.co.tz',
        'password' => 'admin123',
        'role' => 'admin',
        'company' => 'CRESTECH',
        'plan' => 'Enterprise',
        'phone' => '+1 (555) 000-0001',
        'timezone' => 'America/New_York',
        'status' => 'active',
        'avatar' => '/images/person-woman-4.jpg',
    ]);

    $user = gps_seed_user($pdo, [
        'name' => 'John Anderson',
        'email' => 'user@crestech.co.tz',
        'password' => 'user123',
        'role' => 'user',
        'company' => 'CRESTECH',
        'plan' => 'Professional',
        'phone' => '+1 (555) 000-0002',
        'timezone' => 'America/New_York',
        'status' => 'active',
        'avatar' => '/images/person-man-2.jpg',
    ]);

    if ($user) {
        gps_seed_user_assets($pdo, $user);
    }
    if ($admin) {
        gps_seed_admin_audit($pdo, $admin);
    }
}

function gps_seed_user(PDO $pdo, array $data): ?array
{
    $statement = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    $statement->execute([$data['email']]);
    $existing = $statement->fetch();

    if ($existing) {
        return $existing;
    }

    $insert = $pdo->prepare(
        'INSERT INTO users (name, email, password, role, company, plan, phone, timezone, status, avatar)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $insert->execute([
        $data['name'],
        $data['email'],
        password_hash($data['password'], PASSWORD_DEFAULT),
        $data['role'],
        $data['company'],
        $data['plan'],
        $data['phone'],
        $data['timezone'],
        $data['status'],
        $data['avatar'],
    ]);

    return gps_fetch_user($pdo, (int) $pdo->lastInsertId());
}

function gps_seed_user_assets(PDO $pdo, array $user): void
{
    $countVehicles = $pdo->prepare('SELECT COUNT(*) FROM vehicles WHERE user_id = ?');
        $countVehicles->execute([(int) $user['id']]);
    if ((int) $countVehicles->fetchColumn() === 0) {
        $vehicleSeed = [
            ['Truck Alpha', 'active', 62, 78, 95, 'Mike Ross', 'Highway I-95, NJ', 40.7128, -74.0060, 'GPS Tracker Pro', '-5 minutes'],
            ['Van Beta', 'active', 45, 54, 88, 'Lisa Chen', 'Route 66, AZ', 35.1983, -111.6513, 'GPS Tracker Pro', '-12 minutes'],
            ['Truck Gamma', 'idle', 0, 92, 100, 'Sam Patel', 'Depot A, Houston TX', 29.7604, -95.3698, 'GPS Mini', '-2 hours'],
            ['Sedan Delta', 'active', 38, 31, 72, 'Amy Woods', 'I-10 Freeway, LA', 34.0522, -118.2437, 'OBD Connector', '-3 minutes'],
            ['Van Epsilon', 'maintenance', 0, 65, 45, 'Dan Kim', 'Service Center, Dallas', 32.7767, -96.7970, 'GPS Tracker Pro', '-1 day'],
            ['Truck Zeta', 'active', 71, 43, 90, 'Rob Taylor', 'I-80 East, PA', 41.2033, -77.1945, 'GPS Tracker Pro', '-7 minutes'],
            ['SUV Eta', 'active', 55, 67, 81, 'Jen Parker', 'I-75 North, FL', 27.6648, -81.5158, 'OBD Connector', '-9 minutes'],
            ['Truck Theta', 'idle', 0, 84, 63, 'Carl Weber', 'Depot B, Chicago IL', 41.8781, -87.6298, 'GPS Mini', '-45 minutes'],
        ];

        $insert = $pdo->prepare(
            'INSERT INTO vehicles
            (vehicle_code, user_id, name, status, speed, fuel_level, battery_level, driver_name, location_label, latitude, longitude, vehicle_type, last_ping_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );

        foreach ($vehicleSeed as $row) {
            $insert->execute([
                gps_create_code('V'),
                (int) $user['id'],
                $row[0],
                $row[1],
                $row[2],
                $row[3],
                $row[4],
                $row[5],
                $row[6],
                $row[7],
                $row[8],
                $row[9],
                gps_shifted_datetime($row[10]),
            ]);
        }
    }

    $countZones = $pdo->prepare('SELECT COUNT(*) FROM geofences WHERE user_id = ?');
    $countZones->execute([(int) $user['id']]);
    if ((int) $countZones->fetchColumn() === 0) {
        $zones = [
            ['Main Depot Zone', 'circle', 'active', 3, 500, '#eab308', 12, 40.7357, -74.1724],
            ['Downtown Restricted', 'polygon', 'active', 8, 300, '#ef4444', 5, 40.7580, -73.9855],
            ['Warehouse District', 'rectangle', 'active', 1, 400, '#f59e0b', 8, 29.7436, -95.3644],
            ['School Zone Alpha', 'circle', 'active', 12, 200, '#f59e0b', 3, 34.0522, -118.2437],
            ['Highway Corridor', 'polygon', 'inactive', 0, 600, '#8b5cf6', 0, 41.2033, -77.1945],
            ['Client Site - Acme', 'circle', 'active', 2, 300, '#06b6d4', 4, 32.7767, -96.7970],
        ];

        $insert = $pdo->prepare(
            'INSERT INTO geofences
            (geofence_code, user_id, name, type, status, alerts_count, radius_meters, color, vehicles_inside, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );

        foreach ($zones as $row) {
            $insert->execute([
                gps_create_code('GF'),
                (int) $user['id'],
                $row[0],
                $row[1],
                $row[2],
                $row[3],
                $row[4],
                $row[5],
                $row[6],
                $row[7],
                $row[8],
            ]);
        }
    }

    $countReports = $pdo->prepare('SELECT COUNT(*) FROM reports WHERE user_id = ?');
    $countReports->execute([(int) $user['id']]);
    if ((int) $countReports->fetchColumn() === 0) {
        $reports = [
            ['Fleet Performance Report', 'Performance', '-6 days', 2450, 'ready', 24, 890, 120, 52, 160],
            ['Monthly Fuel Consumption', 'Fuel', '-5 days', 1840, 'ready', 31, 1120, 148, 48, 182],
            ['Driver Behavior Analysis', 'Safety', '-4 days', 3170, 'ready', 28, 980, 132, 55, 170],
            ['Route Optimization Summary', 'Routes', '-3 days', 1220, 'generating', 35, 1340, 175, 51, 196],
            ['Geofence Violation Log', 'Compliance', '-2 days', 890, 'ready', 22, 760, 98, 49, 155],
            ['Weekly Fleet Snapshot', 'Operations', '-1 days', 950, 'ready', 29, 1050, 140, 53, 179],
            ['Executive Summary', 'Executive', 'now', 1100, 'ready', 33, 1200, 158, 50, 206],
        ];

        $insert = $pdo->prepare(
            'INSERT INTO reports
            (report_code, user_id, name, type, report_date, file_size_kb, status, trip_count, distance_miles, fuel_gallons, avg_speed, active_hours)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );

        foreach ($reports as $row) {
            $insert->execute([
                gps_create_code('RPT'),
                (int) $user['id'],
                $row[0],
                $row[1],
                gps_shifted_date($row[2]),
                $row[3],
                $row[4],
                $row[5],
                $row[6],
                $row[7],
                $row[8],
                $row[9],
            ]);
        }
    }

    $countInvoices = $pdo->prepare('SELECT COUNT(*) FROM invoices WHERE user_id = ?');
    $countInvoices->execute([(int) $user['id']]);
    if ((int) $countInvoices->fetchColumn() === 0) {
        $amount = gps_plan_monthly_price((string) $user['plan']) * 100;
        $invoices = [
            [$amount, 'completed', 'Visa •••• 4242', '-150 days'],
            [$amount, 'completed', 'Mastercard •••• 8888', '-120 days'],
            [$amount, 'completed', 'ACH Transfer', '-90 days'],
            [$amount, 'pending', 'Visa •••• 1234', '-60 days'],
            [$amount, 'completed', 'PayPal', '-30 days'],
            [$amount, 'failed', 'Visa •••• 9999', '-7 days'],
            [$amount, 'completed', 'Stripe', 'now'],
        ];

        $insert = $pdo->prepare(
            'INSERT INTO invoices (invoice_code, user_id, amount_cents, status, payment_method, created_at)
             VALUES (?, ?, ?, ?, ?, ?)'
        );

        foreach ($invoices as $row) {
            $insert->execute([gps_create_code('TXN'), (int) $user['id'], $row[0], $row[1], $row[2], gps_shifted_datetime($row[3])]);
        }
    }
}

function gps_seed_admin_audit(PDO $pdo, array $admin): void
{
    $count = (int) $pdo->query('SELECT COUNT(*) FROM audit_logs')->fetchColumn();
    if ($count > 0) {
        return;
    }

    $entries = [
        ['User Suspended', 'user@crestech.co.tz', 'user', 'high', 'Suspended user account for policy review'],
        ['Auto-Backup Completed', 'Database', 'system', 'info', 'Scheduled daily backup completed successfully'],
        ['Plan Changed', 'user@crestech.co.tz', 'billing', 'medium', 'Changed plan from Professional to Enterprise'],
        ['Admin Login', 'admin@crestech.co.tz', 'auth', 'info', 'Successful admin login'],
        ['API Key Generated', 'CRESTECH', 'security', 'high', 'New API key generated for client integration'],
        ['Failed Login Attempt', 'unknown@test.com', 'auth', 'critical', 'Five consecutive failed login attempts detected'],
        ['Device Deleted', 'V-008', 'device', 'medium', 'Removed device from fleet management'],
        ['SSL Certificate Renewed', 'crestech.co.tz', 'system', 'info', 'Auto-renewal of SSL certificate completed'],
    ];

    $insert = $pdo->prepare(
        'INSERT INTO audit_logs (actor_user_id, actor_name, action, target, category, severity, details, ip_address, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );

    $hours = [-24, -22, -20, -18, -16, -12, -8, -4];
    foreach ($entries as $index => $entry) {
        $insert->execute([
            (int) $admin['id'],
            $admin['name'],
            $entry[0],
            $entry[1],
            $entry[2],
            $entry[3],
            $entry[4],
            '127.0.0.1',
            gps_shifted_datetime($hours[$index] . ' hours'),
        ]);
    }
}

function gps_shifted_date(string $descriptor): string
{
    $expression = $descriptor === 'now' ? 'now' : $descriptor;
    return (new DateTimeImmutable($expression))->format('Y-m-d');
}

function gps_shifted_datetime(string $descriptor): string
{
    $expression = $descriptor === 'now' ? 'now' : $descriptor;
    return (new DateTimeImmutable($expression))->format('Y-m-d H:i:s');
}
?>
