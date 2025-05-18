<?php
ob_start();

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');
require_once 'config.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$header = $_POST['review_header'] ?? '';
$review = $_POST['review_body'] ?? '';
$date = $_POST['review_date'] ?? date('Y-m-d H:i:s');
$stars = $_POST['stars'] ?? 0;

if (!$header || !$review || !$stars) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$conn = new mysqli('127.0.0.1', $username, $password, $database);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO reviews (user_id, review_header, review_body, stars, review_date) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("issis", $user_id, $header, $review, $stars, $date);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Review submitted"]);
} else {
    echo json_encode(["success" => false, "message" => "Insert failed"]);
}

$stmt->close();
$conn->close();

ob_end_flush();
