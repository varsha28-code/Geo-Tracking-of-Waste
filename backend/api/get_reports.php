<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/database.php';

$sql = "SELECT id, image_path, latitude, longitude, is_garbage_detected, detection_data, status, created_at FROM waste_reports ORDER BY created_at DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute();

$reports = $stmt->fetchAll();

echo json_encode($reports);
?>
