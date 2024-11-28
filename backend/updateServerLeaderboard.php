<?php

//import in connectToDatabase file
require './connectToDatabase.php';
require './createLeaderboardTable.php';

//import in the database secrets file accessed by its environment variable name
$pathToSecrets = getenv('DB_SECRETS_PATH');
require $pathToSecrets;

function updateServerLeaderboard() {
    createLeaderboardTable();

    //establish the connection to the postGreSql database
    $connection = connectToDatabase();

    if (!$connection) {
        echo json_encode(['success' => false, 'message' => 'Failed to connect to the database']);
        exit;  //switched to exit to ensure function ends immediately if connection is not established
    }

    $username = $_GET['username'];
    $timeToStore = $_GET['timeToStore'];

    //creating a query to pass to the database once a connection is established
    $query = $connection-> prepare("INSERT INTO leaderboard (username, timescore) VALUES (:username, :timescore)");
    
    //binding the created query to the GET array values, then executing
    $query->bindParam(':username', $username);
    $query->bindParam(':timescore', $timeToStore);
    $query -> execute();

    $query = null;
    $connection = null;
}

// Call the function
updateServerLeaderboard();
?>