<?php

$pathToSecrets = getenv('DB_SECRETS_PATH');
require $pathToSecrets;

function connectToDatabase() {
    $data_source_name = DB_DRIVER.":host=".DB_HOST.";dbname=".DB_NAME;

    try {
        return new PDO($data_source_name, DB_USER, DB_PASSWORD);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database connection error: ' . $e->getMessage()]);
        return null;
    }
}


?>