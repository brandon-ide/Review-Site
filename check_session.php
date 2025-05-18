<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (isset($_SESSION['user_id']) && isset($_SESSION['first_name'])) {
    echo json_encode([
        'loggedIn' => true,
        'firstName' => $_SESSION['first_name']
    ]);
} else {
    echo json_encode(['loggedIn' => false]);
}
