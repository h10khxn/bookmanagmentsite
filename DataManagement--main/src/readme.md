# Library Book Management System

A web-based book management system where you can add, update, and delete books from your inventory. This system is built with PHP for the backend and uses MySQL to store book data. While the frontend consists of HTML, Javascript, Tailwind CSS

## Prerequisites

To run this project locally, you will need the following:

- **WAMP** or **XAMPP**  to run PHP and MySQL.
- A modern web browser 

## Installation & setup

### 1. Extract the Project Files

Extract the ZIP file you received into C:\wamp64\www\ if using WAMP or htdocs for XAMPP. 

### 2. Import the Database
Option 1:  Automatic Database Setup
Go to the file "setup_database.php" and "book_inventory.php" and ensure to change the login and password to yours.
$host = 'localhost'; 
$dbname = 'book_inventory'; 
$username = 'root'; // root by default
$password = ''; // Empty on default
Navigate to "http://localhost/BookManagment-HamdanKhan/DataManagement--main/src/setup_database.php"
Database should now be setup
Option 2: Backup(If option 1 does not work.)
- Open the `inventory.sql` file that is included in the project folder.
- Import it into your MySQL database using phpMyAdmin or MySQL command line.

#### Using phpMyAdmin:
1. Open phpMyAdmin in your browser (typically `http://localhost/phpmyadmin`).
2. Create a new database `book_inventory`.
3. Import the `inventory.sql` file into the newly created database:
   - Click on the **Import** tab.
   - Choose the `inventory.sql` file and click **Go**.

#### Using MySQL Command Line:
1. Open the command line or terminal.
2. Log in to MySQL with the following command:
   mysql -u root -p
3. Once logged in, create database
    CREATE DATABASE book_inventory;
4. Use inventory.sql to populate database
    mysql -u root -p book_inventory < DataManagement--main\src\inventory.sql

### 3. Configure your server
Make sure that your local server (WAMP/XAMPP) is running and place the project folder into the appropriate directory.
    For WAMP:
    C:\wamp64\www\
    For XAMPP:
    C:\xampp\htdocs\
### 4. Update Database Connection
In the PHP file book_inventory.php, make sure to update the database connection settings:

### 5. Access the project
Once your server is running and the database is set up, open your browser and go to:
http://localhost/BookManagment-HamdanKhan/DataManagement--main/src/

### Features
1. View Book Inventory
The inventory page will display all the books in the book_inventory database. Each row shows the book's ID, title, author, genre, publication date, and ISBN.

2. Add a New Book
To add a new book:

Go to the "Add Book" form.
Fill in the details for the book: title, author, genre, publication date, and ISBN.
Click Add Book to save the new book to the database.
3. Edit an Existing Book
To edit an existing book:

Click the Edit button next to the book you want to modify.
Update the details (title, author, genre, publication date, ISBN).
Click Save to update the book in the database.
4. Delete a Book
To delete a book:

Click the Delete button next to the book you want to remove.
Confirm the deletion when prompted.
The book will be removed from the inventory.
File Structure
index.html: The main landing page with the book list and controls for adding, editing, and deleting books.
book_inventory.php: The PHP backend that connects to the MySQL database and handles the CRUD operations (Create, Read, Update, Delete).
inventory.sql: The SQL file containing the schema and initial data for the book_inventory table.
main.js & script.js : JavaScript files for handling front-end functionality and Fetch API.
styles.css: Styling
setup_database.php: Automatic dB setup.