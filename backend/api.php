<?php
include("database.php");

$action = $_REQUEST("action");
$data = json_decode("data") or die('{"success":false, "data":"Parameter data must be valid json!"}');








?>