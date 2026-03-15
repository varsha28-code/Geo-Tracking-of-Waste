<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/database.php';

$sql = "SELECT id, name, latitude, longitude, phone_number FROM collectors";
$stmt = $pdo->prepare($sql);
$stmt->execute();

$collectors = $stmt->fetchAll();

echo json_encode($collectors);
?>
