<?php
require 'backend/config/database.php';
$sql = file_get_contents('database/schema.sql');
$pdo->exec($sql);
echo "Schema applied successfully.\n";
