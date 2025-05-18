<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require 'login.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit();
}

$conn = new mysqli($hostname, $username, $password, $database);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$userId = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT header, review, date, stars FROM reviews WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$reviews = [];
while ($row = $result->fetch_assoc()) {
    $reviews[] = $row;
}

echo json_encode($reviews);
$conn->close();
