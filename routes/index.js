const express = require('express')
const Book = require('../models/book');
const router = express.Router()


router.get('/', async(req, res) => {
    let books
    try {
        books = await Book.find().limit(2).sort({ createdAt: -1 }).exec();
    } catch {
        books = []
    }
    res.render('index', { books: books })
})


module.exports = router;