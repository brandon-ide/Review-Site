<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');
require_once 'config.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit;
}

$conn = new mysqli($hostname, $username, $password, $database);
if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}

$userId = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT review_header, review_body, review_date, stars FROM reviews WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$reviews = [];
while ($row = $result->fetch_assoc()) {
    $reviews[] = $row;
}

echo json_encode($reviews);
$stmt->close();
$conn->close();
