<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    header('Location: index.html');
    exit();
}

require 'login.php';

$conn = new mysqli($hostname, $username, $password, $database);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$userId = $_SESSION['user_id'];
$firstName = $_SESSION['first_name'];

$stmt = $conn->prepare("SELECT header, review, date, stars FROM reviews WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$reviews = [];
while ($row = $result->fetch_assoc()) {
    $reviews[] = $row;
}
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Reviews Dashboard</title>
</head>
<body>
    <h1>Welcome, <?= htmlspecialchars($firstName) ?>!</h1>
    <a href="logout.php">Logout</a>

    <h2>Submit a New Review</h2>
    <form id="reviewForm" method="post" action="review.php">
        <label for="header">Review Header:</label><br>
        <input type="text" id="header" name="header" required><br>

        <label for="review">Review Text:</label><br>
        <textarea id="review" name="review" required></textarea><br>

        <label for="stars">Rating (1-5):</label><br>
        <input type="number" id="stars" name="stars" min="1" max="5" required><br>

        <button type="submit">Submit Review</button>
    </form>

    <h2>Your Previous Reviews</h2>
    <ul>
        <?php foreach ($reviews as $r): ?>
            <li>
                <strong><?= htmlspecialchars($r['header']) ?></strong><br>
                <?= nl2br(htmlspecialchars($r['review'])) ?><br>
                Rating: <?= intval($r['stars']) ?> stars<br>
                Date: <?= htmlspecialchars($r['date']) ?>
            </li>
        <?php endforeach; ?>
    </ul>
</body>
</html>
