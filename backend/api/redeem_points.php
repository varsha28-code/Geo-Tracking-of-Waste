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
    $username = $data['username'] ?? null;
    $pointsToRedeem = $data['points'] ?? null;
    $rewardName = $data['reward_name'] ?? 'Reward Redemption';

    if (!$username || !$pointsToRedeem) {
        echo json_encode(['error' => 'Username and points are required.']);
        exit;
    }

    try {
        // Check current balance
        $stmt = $pdo->prepare("SELECT SUM(points) as total FROM point_history WHERE username = ?");
        $stmt->execute([$username]);
        $total = $stmt->fetchColumn() ?: 0;

        if ($total < $pointsToRedeem) {
            echo json_encode(['error' => 'Insufficient points. Total: ' . $total]);
            exit;
        }

        // Subtract points by adding a negative entry
        $insertStmt = $pdo->prepare("INSERT INTO point_history (username, action, points) VALUES (?, ?, ?)");
        $insertStmt->execute([$username, "Redeemed: " . $rewardName, -$pointsToRedeem]);

        echo json_encode([
            'success' => 'Points redeemed successfully',
            'new_total' => $total - $pointsToRedeem
        ]);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>
