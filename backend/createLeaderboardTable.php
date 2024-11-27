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
        echo "Table created successfully\n";
    } catch(PDOException $e) {
        echo "Table creation failed: " . $e->getMessage() . "\n";
    }
}
?>