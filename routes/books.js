const express = require('express')
const Book = require('../models/book');
const path = require('path');

const multer = require('multer');
const uploadPath = Book.coverImageBasePath;
const fs = require('fs');
const Author = require('../models/author');
const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join('public', uploadPath)),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage: storage });


router.get('/', async(req, res) => {
    let searchOption = {}
    const publishDateAfter = req.query.publishDateAfter;
    const publishDateBefore = req.query.publishDateBefore;
    if (req.query.title !== null && req.query.title !== '') {
        searchOption.title = { $regex: new RegExp(req.query.title, 'i') };
    }

    if (publishDateAfter !== '' && publishDateBefore !== '') {
        searchOption.publishDate = {
            $gte: publishDateAfter,
            $lte: publishDateBefore
        }
    } else if (publishDateAfter !== '') {
        searchOption.publishDate = { $gte: publishDateAfter }
    } else if (publishDateBefore !== '') {
        searchOption.publishDate = { $lte: publishDateBefore }
    }

    console.log("after" + publishDateAfter);
    console.log("before" + publishDateBefore);
    try {
        const books = await Book.find(searchOption);
        res.render('books/', ({
            books: books,
            searchOption: req.query
        }))
    } catch (err) {
        console.log(err);
    }
})


router.get('/new', async(req, res) => {
    renderNewPage(res, new Book());
})

router.post('/', upload.single('cover'), async(req, res) => {

    try {
        const book = new Book({
            title: req.body.title,
            publishDate: req.body.publishDate,
            author: req.body.author,
            pageCount: req.body.pageCount,
            coverImageName: req.file.filename,
            description: req.body.description
        })

        await book.save()
        res.redirect('books')
    } catch (err) {
        removeCover(req.file.filename)
        renderNewPage(res, new Book(), true);
    }
});



async function renderNewPage(res, book, hasErr = false) {
    try {

        const authors = await Author.find()
        const params = {
            authors: authors,
            book: book
        }

        if (hasErr) params.errMessage = 'Error Creating Book'
        res.render('books/new', params)

    } catch (err) {
        res.render('books', params)
    }
}

async function removeCover(fileName) {
    const directoryPath = path.join(__dirname, '..');
    const filePath = path.join(directoryPath, 'public', uploadPath, fileName);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}



module.exports = router;