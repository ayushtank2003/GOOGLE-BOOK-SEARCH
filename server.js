const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.render('index', { books: [], error: null }); // Always define error, even if it's null
});

app.post('/search', async (req, res) => {
    const userInput = req.body.bookName.trim();
    if (!userInput) {
        return res.render('index', { books: [], error: 'Please enter a book name.' });
    }

    try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(userInput)}`);
        const books = response.data.items || [];
        res.render('index', { books: books, error: null });
    } catch (error) {
        res.render('index', { books: [], error: 'Error fetching data.' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
