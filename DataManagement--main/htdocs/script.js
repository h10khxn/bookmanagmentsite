document.addEventListener('DOMContentLoaded', function() {
    // Fetch the books list when the page loads
    fetchBooks();
    startPolling();
    // Search functionality
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', function() {
        filterTable(searchInput.value);
    });
    // Set up polling to fetch the book list every 5 seconds
    setInterval(fetchBooks, 5000);  // 5000ms = 5 seconds

    // Handle form submission for adding books
    const addBookForm = document.getElementById('add-book-form');
    const isbnInput = document.getElementById('isbn');
    const isbnError = document.getElementById('isbn-error');
    
    // Listen for user input to hide error if ISBN is corrected
    isbnInput.addEventListener('input', function() {
        isbnError.style.display = 'none'; // Hide error message as user corrects the input
    });

    addBookForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate ISBN
        const isbn = isbnInput.value.trim();

        if (!validateISBN(isbn)) {
            isbnError.style.display = 'inline'; // Show error message
            return;
        } else {
            isbnError.style.display = 'none'; // Hide error message
        }

        // Get form data
        const formData = new FormData(addBookForm);
        formData.append('action', 'add'); // Add action type for adding books

        // Sending data to server using fetch
        fetch('book_inventory.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);
                addBookToTable(data.book);  // Add new book to the table
                addBookForm.reset(); // Clear the form after successful submission
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error adding book:', error);
            alert('There was an error while adding the book. Please try again.');
        });
    });
});

let books = [];  // Store the latest list of books
let pollingActive = true;  // Track polling state (active or paused)
let pollInterval = null; // Variable to store setInterval ID for polling

// Fetch all books from the database and display them
function fetchBooks() {
    fetch('book_inventory.php')
    .then(response => response.json())
    .then(data => {
        books = data;  // Store fetched books data
        if (!isSearching()) {
            renderBooks(books);  // Only render the books if not searching
        }
    })
    .catch(error => {
        console.error('Error fetching books:', error);
        alert('There was an error fetching the book list. Please try again.');
    });
}

// Render books in the table
function renderBooks(books) {
    const tableBody = document.querySelector('#book-table tbody');
    tableBody.innerHTML = ''; // Clear existing table rows

    // Add each book to the table
    books.forEach(book => {
        addBookToTable(book);
    });
}

// Add a book to the table
function addBookToTable(book) {
    const tableBody = document.querySelector('#book-table tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.genre}</td>
        <td>${book.publication_date}</td>
        <td>${book.isbn}</td>
        <td>
            <button class="edit-btn bg-blue-500 text-white py-1 px-2 rounded-md cursor-pointer hover:bg-blue-600" data-id="${book.id}">Edit</button>
            <button class="delete-btn bg-red-500 text-white py-1 px-2 rounded-md cursor-pointer hover:bg-red-600" data-id="${book.id}">Delete</button>
        </td>
    `;
    tableBody.appendChild(row); // Add new row to the table body
}

// Filter the table by search query
function filterTable(query) {
    const rows = document.querySelectorAll('#book-table tbody tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const title = cells[1].textContent.toLowerCase();
        const author = cells[2].textContent.toLowerCase();
        const genre = cells[3].textContent.toLowerCase();

        const text = title + " " + author + " " + genre;

        if (text.toLowerCase().includes(query.toLowerCase())) {
            row.style.display = '';  // Show row
        } else {
            row.style.display = 'none';  // Hide row
        }
    });
}

// Start polling
function startPolling() {
    if (!pollInterval) {
        pollInterval = setInterval(fetchBooks, 5000);  // Fetch data every 5 seconds
    }
}

// Stop polling
function stopPolling() {
    if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }
}

// Check if the user is searching
function isSearching() {
    const searchQuery = document.getElementById('search').value.trim();
    return searchQuery !== '';  // Return true if there is a search query
}

// Set up event listener for search input
document.getElementById('search').addEventListener('input', function() {
    const query = this.value.trim();

    // Stop polling if searching
    if (query !== '') {
        stopPolling();
        filterTable(query);  // Filter the table based on the search query
    } else {
        renderBooks(books);  // If search is cleared, render the full table again
        startPolling();  // Resume polling
    }
});



// Start polling when the page loads
pollingInterval = setInterval(fetchBooks, 5000);  // 5000ms = 5 seconds
document.getElementById('export-csv').addEventListener('click', function() {
    exportTableToCSV('book_inventory.csv');
});

// Export table data to CSV function
function exportTableToCSV(filename) {
    let csv = [];
    const rows = document.querySelectorAll('#book-table tbody tr');  // Only target body rows, exclude header

    // Add headers to CSV
    const headers = document.querySelectorAll('#book-table thead th');
    let headerData = [];
    headers.forEach(header => {
        headerData.push(header.textContent.trim());
    });
    csv.push(headerData.join(','));  // Add headers as the first row

    // Iterate through each row of the table (excluding header)
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');  // Only target actual data cells, not buttons
        let rowData = [];

        // Loop through the cells and add them to rowData (skip the last cell with buttons)
        for (let i = 0; i < cells.length - 1; i++) {  // Skip the last column (buttons)
            rowData.push(cells[i].textContent.trim());  // Get text content and add to row data
        }
        
        // Only push rows with actual book data (excluding button columns)
        csv.push(rowData.join(','));  // Join row data with commas
    });

    // Create CSV content
    const csvContent = csv.join('\n');
    
    // Create a link to download CSV
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    link.download = filename;
    link.style.display = 'none';

    // Append link, trigger click, and remove link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


// Add a book to the table
function addBookToTable(book) {
    const tableBody = document.querySelector('#book-table tbody');
    const row = document.createElement('tr');
    
    // Updated Zebra striping and transparency
    // If it's too opaque, adjust the alpha value, e.g., 'bg-white/5' or 'bg-slate-800/10'
    row.classList.add('bg-white/5', 'border-b', 'border-white/10');

    // Create the row content
    row.innerHTML = `
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.genre}</td>
        <td>${book.publication_date}</td>
        <td>${book.isbn}</td>
        <td>
            <button class="edit-btn text-purple-400 hover:text-purple-300" data-id="${book.id}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
            </button>
            <button class="delete-btn text-pink-400 hover:text-pink-300" data-id="${book.id}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </td>
    `;
    
    tableBody.appendChild(row); // Add new row to the table body

    // Attach event listener to the Edit button
    row.querySelector('.edit-btn').addEventListener('click', function() {
        editBook(book);
    });

    // Attach event listener to the Delete button
    row.querySelector('.delete-btn').addEventListener('click', function() {
        deleteBook(book.id);
    });
}


// Validate ISBN (only 13 digits allowed)
function validateISBN(isbn) {
    const isbnPattern = /^\d{13}$/;  // Check for exactly 13 digits
    return isbnPattern.test(isbn);
}

// Edit a book
function editBook(book) {
    const modal = document.getElementById('edit-book-form');
    modal.classList.remove('hidden'); // Show the modal
    
    // Fill the form inputs with current book data
    document.getElementById('edit-book-id').value = book.id;
    document.getElementById('edit-title').value = book.title;
    document.getElementById('edit-author').value = book.author;
    document.getElementById('edit-genre').value = book.genre;
    document.getElementById('edit-publication_date').value = book.publication_date;
    document.getElementById('edit-isbn').value = book.isbn;

    // Handle form submission for editing a book
    const editBookForm = document.getElementById('edit-book-modal-form');
    const closeEditFormButton = document.getElementById('close-edit-form');
    
    // Add event listener to handle form submission
    editBookForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get updated values
        const updatedTitle = document.getElementById('edit-title').value.trim();
        const updatedAuthor = document.getElementById('edit-author').value.trim();
        const updatedGenre = document.getElementById('edit-genre').value.trim();
        const updatedPublicationDate = document.getElementById('edit-publication_date').value;
        const updatedIsbn = document.getElementById('edit-isbn').value.trim();

        // Validate ISBN
        if (!validateISBN(updatedIsbn)) {
            alert('Invalid ISBN. It must be 13 digits.');
            return;
        }

        // Send update request to server
        fetch('book_inventory.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=update&id=${book.id}&title=${updatedTitle}&author=${updatedAuthor}&genre=${updatedGenre}&publication_date=${updatedPublicationDate}&isbn=${updatedIsbn}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Book updated successfully!');
                modal.classList.add('hidden');  // Hide the modal after successful update
                fetchBooks();  // Fetch the updated book list
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error updating book:', error);
            alert('There was an error updating the book. Please try again.');
        });
    });

    // Add event listener to close the modal
    closeEditFormButton.addEventListener('click', function() {
        modal.classList.add('hidden'); // Hide the modal when clicking close button
    });

    // Optional: Close modal when clicking outside the modal
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.add('hidden'); // Close modal if clicked outside
        }
    });
}


// Delete a book
function deleteBook(bookId) {
    const confirmDelete = confirm("Are you sure you want to delete this book?");
    if (confirmDelete) {
        fetch('book_inventory.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=delete&id=${bookId}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);
                fetchBooks(); // Refresh the book list
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error deleting book:', error);
            alert('There was an error while deleting the book. Please try again.');
        });
    }
}
