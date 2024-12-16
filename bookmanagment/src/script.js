document.addEventListener('DOMContentLoaded', function() {
    
    fetchBooks();
    startPolling();
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', function() {
        filterTable(searchInput.value);
    });
    // Polling 
    setInterval(fetchBooks, 5000);  

    const addBookForm = document.getElementById('add-book-form');
    const isbnInput = document.getElementById('isbn');
    const isbnError = document.getElementById('isbn-error');
    
    
    isbnInput.addEventListener('input', function() {
        isbnError.style.display = 'none'; 
    });

    addBookForm.addEventListener('submit', function(e) {
        e.preventDefault();

       
        const isbn = isbnInput.value.trim();

        if (!validateISBN(isbn)) {
            isbnError.style.display = 'inline'; 
            return;
        } else {
            isbnError.style.display = 'none'; 
        }

        // form data
        const formData = new FormData(addBookForm);
        formData.append('action', 'add'); 

        fetch('book_inventory.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);
                addBookToTable(data.book);  
                addBookForm.reset(); 
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

let books = [];  
let pollingActive = true;  
let pollInterval = null; 

// Fetch books from the db
function fetchBooks() {
    fetch('book_inventory.php')
    .then(response => response.json())
    .then(data => {
        books = data;  
        if (!isSearching()) {
            renderBooks(books);  
        }
    })
    .catch(error => {
        console.error('Error fetching books:', error);
        alert('There was an error fetching the book list. Please try again.');
    });
}

// Render books 
function renderBooks(books) {
    const tableBody = document.querySelector('#book-table tbody');
    tableBody.innerHTML = ''; 

    
    books.forEach(book => {
        addBookToTable(book);
    });
}

// Add a book 
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
    tableBody.appendChild(row); 
}

// gfilter the table by search query
function filterTable(query) {
    const rows = document.querySelectorAll('#book-table tbody tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const title = cells[1].textContent.toLowerCase();
        const author = cells[2].textContent.toLowerCase();
        const genre = cells[3].textContent.toLowerCase();
        const isbn = cells[5].textContent.toLowerCase();  

        
        const text = title + " " + author + " " + genre + " " + isbn;

        if (text.toLowerCase().includes(query.toLowerCase())) {
            row.style.display = '';  
        } else {
            row.style.display = 'none'; 
        }
    });
}


// Start polling
function startPolling() {
    if (!pollInterval) {
        pollInterval = setInterval(fetchBooks, 5000);  
    }
}

// Stop polling
function stopPolling() {
    if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }
}


function isSearching() {
    const searchQuery = document.getElementById('search').value.trim();
    return searchQuery !== '';  
}


document.getElementById('search').addEventListener('input', function() {
    const query = this.value.trim();

 
    if (query !== '') {
        stopPolling();
        filterTable(query);  
    } else {
        renderBooks(books);  
        startPolling();  
    }
});




pollingInterval = setInterval(fetchBooks, 5000);  
document.getElementById('export-csv').addEventListener('click', function() {
    exportTableToCSV('book_inventory.csv');
});

// Export table 
function exportTableToCSV(filename) {
    let csv = [];
    const rows = document.querySelectorAll('#book-table tbody tr');  

    
    const headers = document.querySelectorAll('#book-table thead th');
    let headerData = [];
    headers.forEach(header => {
        headerData.push(header.textContent.trim());
    });
    csv.push(headerData.join(','));  

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');  
        let rowData = [];

        for (let i = 0; i < cells.length - 1; i++) {  
            rowData.push(cells[i].textContent.trim());  
        }
        
        csv.push(rowData.join(','));  
    });

    const csvContent = csv.join('\n');
    
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function addBookToTable(book) {
    const tableBody = document.querySelector('#book-table tbody');
    const row = document.createElement('tr');

    row.classList.add('bg-white/5', 'border-b', 'border-white/10');

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

    tableBody.appendChild(row);

    row.querySelector('.edit-btn').addEventListener('click', function() {
        editBook(book);
    });

    row.querySelector('.delete-btn').addEventListener('click', function() {
        deleteBook(book.id);
    });
}

function validateTextInput(input) {
    const validTextPattern = /^[a-zA-Z0-9\s'.,!?-]*$/; 
    return validTextPattern.test(input);
}
function validateISBN(isbn) {
    const isbnPattern = /^\d{13}$/;  
    return isbnPattern.test(isbn);
}

// Edit a book
function editBook(book) {
    const modal = document.getElementById('edit-book-form');
    modal.classList.remove('hidden'); 
    
    document.getElementById('edit-book-id').value = book.id;
    document.getElementById('edit-title').value = book.title;
    document.getElementById('edit-author').value = book.author;
    document.getElementById('edit-genre').value = book.genre;
    document.getElementById('edit-publication_date').value = book.publication_date;
    document.getElementById('edit-isbn').value = book.isbn;

    const editBookForm = document.getElementById('edit-book-modal-form');
    const closeEditFormButton = document.getElementById('close-edit-form');
    
    editBookForm.addEventListener('submit', function(e) {
        e.preventDefault();
    
        const updatedTitle = document.getElementById('edit-title').value.trim();
        const updatedAuthor = document.getElementById('edit-author').value.trim();
        const updatedGenre = document.getElementById('edit-genre').value.trim();
        const updatedPublicationDate = document.getElementById('edit-publication_date').value;
        const updatedIsbn = document.getElementById('edit-isbn').value.trim();
    
        if (!validateTextInput(updatedTitle) || !validateTextInput(updatedAuthor) || !validateTextInput(updatedGenre)) {
            alert("Title, Author, and Genre can contain letters, numbers, spaces, and some special characters (e.g., apostrophes, commas).");
            return;
        }
    
        if (!validateISBN(updatedIsbn)) {
            alert('Invalid ISBN. It must be 13 digits.');
            return;
        }
    
        // Send the updated data to the server
        fetch('book_inventory.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=update&id=${book.id}&title=${updatedTitle}&author=${updatedAuthor}&genre=${updatedGenre}&publication_date=${updatedPublicationDate}&isbn=${updatedIsbn}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Book updated successfully!');
                modal.classList.add('hidden'); 
                fetchBooks();  
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error updating book:', error);
            alert('There was an error updating the book. Please try again.');
        });
    });

   
    closeEditFormButton.addEventListener('click', function() {
        modal.classList.add('hidden');
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.add('hidden'); 
        }
    });
}


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
                fetchBooks(); 
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
