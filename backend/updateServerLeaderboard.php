<?php
//import in connectToDatabase file
require 'connectToDatabase.php';

//import in the database secrets file accessed by its environment variable name
$pathToSecrets = getenv('DB_SECRETS_PATH');
require $pathToSecrets;

function updateServerLeaderboard() {
    //establish the connection to the postGreSql database
    $connection = connectToDatabase();

    //decode data object sent from game.js
    $data = json_decode(file_get_contents("php://input"), true);

    //split object into seperate variables
    $username = $data['username'];
    $timescore = $data['timescore'];

    //insert them into server side leaderboard table
    $query = "INSERT INTO leaderboard (username, timescore) VALUES ($1, $2)";

    //execute the insertion query and store its result
    $result = pg_query_params($connection, $query, array($username, $timescore));

    // Check if the insertion was successful
    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Data inserted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to insert data', 'error' => pg_last_error($connection)]);
    }

    pg_close($connection);
}

?>