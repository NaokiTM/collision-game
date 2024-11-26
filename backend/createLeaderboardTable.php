<?php
function createLeaderboardTable($connection) {
    // Create the leaderboard table
    $query = 
    "CREATE TABLE IF NOT EXISTS leaderboard (
        username VARCHAR(14) PRIMARY KEY,
        timescore INTERVAL
    )";

    // Execute the query
    $response = pg_query($connection, $query);

    if ($response) {
        echo "Table created successfully\n";
    } else {
        echo "Table creation failed: " . pg_last_error($connection) . "\n";
    }
}
?>