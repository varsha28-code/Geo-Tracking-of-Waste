<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $latitude = $_POST['latitude'] ?? null;
    $longitude = $_POST['longitude'] ?? null;
    
    // Check if an image is uploaded
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['error' => 'No image uploaded or upload error.']);
        exit;
    }
    
    // Validate lat/lng
    if (!$latitude || !$longitude) {
        echo json_encode(['error' => 'Latitude and Longitude are required.']);
        exit;
    }
    
    // Save image
    $targetDir = "../../uploads/";
    if (!is_dir($targetDir)) mkdir($targetDir, 0777, true);
    
    $fileName = time() . '_' . basename($_FILES['image']['name']);
    $targetFilePath = $targetDir . $fileName;
    
    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFilePath)) {
        // Run AI Module
        $pythonScript = realpath("../../ai_module/detect_waste.py");
        $absTargetFilePath = realpath($targetFilePath);
        
        $command = "python " . escapeshellarg($pythonScript) . " " . escapeshellarg($absTargetFilePath);
        $output = shell_exec($command);
        
        $aiResult = json_decode($output, true);
        $isGarbageDetected = $aiResult['garbage_detected'] ?? false;
        
        try {
            // Save to Database
            $status = 'pending';
            $stmt = $pdo->prepare("INSERT INTO waste_reports (image_path, latitude, longitude, is_garbage_detected, detection_data, status) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute(['uploads/' . $fileName, $latitude, $longitude, $isGarbageDetected ? 1 : 0, $output, $status]);
            $reportId = $pdo->lastInsertId();
            
            $response = [
                'success' => 'Waste reported successfully',
                'report_id' => $reportId,
                'is_garbage_detected' => $isGarbageDetected
            ];
            
            // Notify Nearest Collector if garbage is detected
            if ($isGarbageDetected) {
                // Find nearest collector using Haversine formula
                $sql = "SELECT id, name, phone_number,
                        (6371 * acos(cos(radians(:lat1)) * cos(radians(latitude)) * cos(radians(longitude) - radians(:lng)) + sin(radians(:lat2)) * sin(radians(latitude)))) AS distance
                        FROM collectors
                        ORDER BY distance ASC LIMIT 1";
                $collectorStmt = $pdo->prepare($sql);
                $collectorStmt->execute([
                    ':lat1' => (float)$latitude, 
                    ':lat2' => (float)$latitude, 
                    ':lng'  => (float)$longitude
                ]);
                $nearestCollector = $collectorStmt->fetch();
                
                if ($nearestCollector) {
                    // Mock notification
                    $response['nearest_collector_notified'] = $nearestCollector['name'];
                    $response['collector_distance_km'] = round($nearestCollector['distance'], 2);
                }
            }

            // Award points
            $username = $_POST['username'] ?? 'Citizen';
            $points = $isGarbageDetected ? 20 : 5; // 20 points for verified garbage, 5 for unverifiable
            $action = $isGarbageDetected ? 'Verified Garbage Report' : 'Garbage Report Uploaded';
            
            $pointStmt = $pdo->prepare("INSERT INTO point_history (username, action, points) VALUES (?, ?, ?)");
            $pointStmt->execute([$username, $action, $points]);
            
            $response['points_awarded'] = $points;
            
            echo json_encode($response);
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'Failed to save the image.']);
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>
