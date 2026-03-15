CREATE DATABASE IF NOT EXISTS waste_tracking;
USE waste_tracking;

CREATE TABLE IF NOT EXISTS collectors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    phone_number VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS waste_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_path VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    is_garbage_detected BOOLEAN DEFAULT FALSE,
    detection_data JSON,
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some mock collectors for testing
INSERT IGNORE INTO collectors (name, latitude, longitude, phone_number) VALUES
('Collector A', 17.3850, 78.4867, '+1234567890'),
('Collector B', 17.3950, 78.4967, '+0987654321'),
('Collector C', 17.3750, 78.4767, '+1122334455');

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255)
);

-- Mock user
INSERT IGNORE INTO users (username) VALUES ('Citizen');

CREATE TABLE IF NOT EXISTS point_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    action VARCHAR(255) NOT NULL,
    points INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
