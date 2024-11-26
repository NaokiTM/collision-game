<?php

//import the variables from db_secrets (change to match db_secrets on your own machine)
require '/home/naoki/Documents/db_secrets.php';

function connectToDatabase() {

    //try connecting using the variables from db_secrets 
    $connection = pg_connect("host=" . DB_HOST . "port=" . DB_PORT . "dbname=" . DB_NAME . "user=" . DB_USER . "password=" . DB_PASSWORD);

    //handling failed connection
    if (!$connection) {
        die("Connection to the PostgreSQL database failed: " . pg_last_error());
    }

    return $connection;
}
?>