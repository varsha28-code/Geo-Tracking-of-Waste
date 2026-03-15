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
    $reportId = $data['report_id'] ?? null;
    $status = $data['status'] ?? null;

    if (!$reportId || !$status) {
        echo json_encode(['error' => 'Report ID and Status are required.']);
        exit;
    }

    $validStatuses = ['pending', 'in_progress', 'completed'];
    if (!in_array($status, $validStatuses)) {
        echo json_encode(['error' => 'Invalid status value.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE waste_reports SET status = ? WHERE id = ?");
        $stmt->execute([$status, $reportId]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => 'Status updated successfully.']);
        } else {
            echo json_encode(['error' => 'Report not found or status already set.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>
