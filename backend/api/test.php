<?php
require '../config/database.php';
$_POST = ['latitude'=>'17.4236', 'longitude'=>'78.2914', 'username'=>'Citizen'];
$_FILES = ['image'=>['error'=>UPLOAD_ERR_OK, 'tmp_name'=>'test', 'name'=>'test.jpg']];
$_SERVER['REQUEST_METHOD'] = 'POST';

// Mock move_uploaded_file for the test
namespace test;
function move_uploaded_file($from, $to) { return true; }

include 'report_waste.php';
?>
