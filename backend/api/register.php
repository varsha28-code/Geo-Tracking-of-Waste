<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $data['username'] ?? ($_POST['username'] ?? null);
    $password = $data['password'] ?? ($_POST['password'] ?? null);

    if (!$username || !$password) {
        echo json_encode(['error' => 'Username and password are required.']);
        exit;
    }

    // Basic password rules (could be expanded)
    if (strlen($password) < 5) {
        echo json_encode(['error' => 'Password must be at least 5 characters long.']);
        exit;
    }
    
    try {
        // Check if username already exists
        $checkStmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $checkStmt->execute([$username]);
        if ($checkStmt->fetch()) {
            echo json_encode(['error' => 'Username already exists.']);
            exit;
        }

        // Hash password
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        $insertStmt = $pdo->prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)");
        $insertStmt->execute([$username, $passwordHash]);

        echo json_encode([
            'success' => true,
            'message' => 'Registration successful.'
        ]);
        
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>
