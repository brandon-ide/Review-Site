<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');

session_destroy();

echo json_encode(["success" => true, "message" => "Logged out"]);
