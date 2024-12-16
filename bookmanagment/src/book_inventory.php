<?php
$conn = new mysqli('localhost', 'root', '', 'book_inventory'); 

// Check the db connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

header('Content-Type: application/json');  

//request to add book
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["action"]) && $_POST["action"] == 'add') {
    $title = $_POST["title"];
    $author = $_POST["author"];
    $genre = $_POST["genre"];
    $publication_date = $_POST["publication_date"];
    $isbn = $_POST["isbn"];

    $stmt = $conn->prepare("INSERT INTO inventory (title, author, genre, publication_date, isbn) 
                            VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $title, $author, $genre, $publication_date, $isbn);

    if ($stmt->execute()) {
        $book_id = $stmt->insert_id;

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
            'message' => 'Error: ' . $stmt->error
        ]);
    }

    $stmt->close(); 
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["action"]) && $_POST["action"] == 'update') { 
    $id = $_POST["id"];
    $title = $_POST["title"];
    $author = $_POST["author"];
    $genre = $_POST["genre"];
    $publication_date = $_POST["publication_date"];
    $isbn = $_POST["isbn"];

    $stmt = $conn->prepare("UPDATE inventory 
                            SET title=?, author=?, genre=?, publication_date=?, isbn=? 
                            WHERE id=?");
    $stmt->bind_param("sssssi", $title, $author, $genre, $publication_date, $isbn, $id);

    if ($stmt->execute()) {
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
            'message' => 'Error: ' . $stmt->error
        ]);
    }

    $stmt->close(); 
    exit;
}

// Handle Delete Book Request
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["action"]) && $_POST["action"] == 'delete') {
    $id = $_POST["id"];

    $stmt = $conn->prepare("DELETE FROM inventory WHERE id=?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Book deleted successfully'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Error: ' . $stmt->error
        ]);
    }

    $stmt->close(); 
    exit;
}

$sql = "SELECT * FROM inventory";
$result = $conn->query($sql);

$books = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $books[] = $row;
    }
}

echo json_encode($books); 
$conn->close();
?>
