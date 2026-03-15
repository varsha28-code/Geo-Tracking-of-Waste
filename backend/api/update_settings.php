<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

// Get JSON post data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $data['username'] ?? ($_POST['username'] ?? null);

    if (!$username) {
        echo json_encode(['error' => 'Username is required.']);
        exit;
    }

    try {
        // Check if user exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user) {
            // Update (nothing to update currently besides maybe password in future)
            //$updateStmt = $pdo->prepare("UPDATE users SET email = ? WHERE username = ?");
            //$updateStmt->execute([$email, $username]);
        } else {
            // Insert new user
            $insertStmt = $pdo->prepare("INSERT INTO users (username) VALUES (?)");
            $insertStmt->execute([$username]);
        }

        echo json_encode(['success' => 'Settings stored successfully.']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>
