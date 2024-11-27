<?php

$pathToSecrets = getenv('DB_SECRETS_PATH');
require $pathToSecrets;

function connectToDatabase() {
    $data_source_name = DB_DRIVER.":host=".DB_HOST.";dbname=".DB_NAME;

    try {
        return new PDO($data_source_name, DB_USER, DB_PASSWORD);
    } catch (PDOException $e) {
        echo "couldn't get a handle on the database!".$e."\n";
        return NULL;
    }
}


?>