<?php
$pathToSecrets = getenv('DB_SECRETS_PATH');

require $pathToSecrets;
require 'connectToDatabase.php';

?>