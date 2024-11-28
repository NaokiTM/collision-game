<?php
function createLeaderboardTable($connection) {
    // Create the leaderboard table
    $query = 
    "CREATE TABLE IF NOT EXISTS leaderboard (
        username VARCHAR(14) PRIMARY KEY,
        timescore INTERVAL
    )";

    // Execute the query

    try {
        $connection->exec($query);
    } catch(PDOException $e) {
        error_log("Error updating leaderboard: " . $e->getMessage());
    }
}
?>