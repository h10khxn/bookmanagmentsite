<?php
// Database connection settings
$host = 'localhost'; 
$dbname = 'book_inventory'; 
$username = 'root'; 
$password = ''; 

$conn = new mysqli($host, $username, $password);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create the database if it doesn't exist
$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($conn->query($sql) === TRUE) {
    echo "Database created successfully or already exists.\n";
} else {
    echo "Error creating database: " . $conn->error . "\n";
}

$conn->select_db($dbname);

$tableSQL = "
    CREATE TABLE IF NOT EXISTS inventory (
        id INT AUTO_INCREMENT PRIMARY KEY,       
        title VARCHAR(255) NOT NULL,             
        author VARCHAR(255) NOT NULL,             
        genre VARCHAR(100),                       
        publication_date DATE,                   
        isbn VARCHAR(20) NOT NULL UNIQUE         
    )
";

if ($conn->query($tableSQL) === TRUE) {
    echo "Table 'inventory' created successfully or already exists.\n";
} else {
    echo "Error creating table: " . $conn->error . "\n";
}

$conn->close();
?>
