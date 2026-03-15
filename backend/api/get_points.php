<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config/database.php';

$username = $_GET['username'] ?? 'Citizen';

try {
    // Get total points
    $stmt = $pdo->prepare("SELECT SUM(points) as total FROM point_history WHERE username = ?");
    $stmt->execute([$username]);
    $total = $stmt->fetchColumn() ?: 0;

    // Get point history
    $stmt = $pdo->prepare("SELECT action, points, created_at FROM point_history WHERE username = ? ORDER BY created_at DESC LIMIT 50");
    $stmt->execute([$username]);
    $history = $stmt->fetchAll();

    echo json_encode([
        'totalPoints' => (int)$total,
        'pointHistory' => $history
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => 'Could not fetch points: ' . $e->getMessage()]);
}
?>
