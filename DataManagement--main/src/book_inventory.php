<?php
$conn = new mysqli('localhost', 'root', '', 'book_inventory');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

header('Content-Type: application/json');  // Set header to JSON

// Handle Add Book Request
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["action"]) && $_POST["action"] == 'add') {
    $title = $_POST["title"];
    $author = $_POST["author"];
    $genre = $_POST["genre"];
    $publication_date = $_POST["publication_date"];
    $isbn = $_POST["isbn"];

    // Insert book into the database
    $sql = "INSERT INTO inventory (title, author, genre, publication_date, isbn) 
            VALUES ('$title', '$author', '$genre', '$publication_date', '$isbn')";

    if ($conn->query($sql) === TRUE) {
        // Get the ID of the newly inserted book
        $book_id = $conn->insert_id;

        // Send the book data along with the success status
        echo json_encode([
            'status' => 'success',
            'message' => 'Book Added Successfully',
            'book' => [
                'id' => $book_id,
                'title' => $title,
                'author' => $author,
                'genre' => $genre,
                'publication_date' => $publication_date,
                'isbn' => $isbn
            ]
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Error: ' . $conn->error
        ]);
    }

    exit; // Make sure to stop execution here for POST requests.
}

// Handle Edit Book Request
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["action"]) && $_POST["action"] == 'update') {  // Corrected 'edit' to 'update'
    $id = $_POST["id"];
    $title = $_POST["title"];
    $author = $_POST["author"];
    $genre = $_POST["genre"];
    $publication_date = $_POST["publication_date"];
    $isbn = $_POST["isbn"];

    // Update book details in the database
    $sql = "UPDATE inventory 
            SET title='$title', author='$author', genre='$genre', publication_date='$publication_date', isbn='$isbn' 
            WHERE id=$id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Book updated successfully',
            'book' => [
                'id' => $id,
                'title' => $title,
                'author' => $author,
                'genre' => $genre,
                'publication_date' => $publication_date,
                'isbn' => $isbn
            ]
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Error: ' . $conn->error
        ]);
    }

    exit;
}

// Handle Delete Book Request
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["action"]) && $_POST["action"] == 'delete') {
    $id = $_POST["id"];

    // Delete book from the database
    $sql = "DELETE FROM inventory WHERE id=$id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Book deleted successfully'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Error: ' . $conn->error
        ]);
    }

    exit;
}

// Fetch all books from the database
$sql = "SELECT * FROM inventory";
$result = $conn->query($sql);

$books = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $books[] = $row;
    }
}

echo json_encode($books); // Return books as JSON
$conn->close();
?>
