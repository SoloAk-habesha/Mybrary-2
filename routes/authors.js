const express = require('express')
const Author = require('../models/author');
const Book = require('../models/book');
const router = express.Router()


router.get('/', async(req, res) => {
    let searchOption = {}
    if (req.query.name !== null || req.query.name !== '') {
        searchOption.name = { $regex: new RegExp(req.query.name, 'i') };
    }

    try {
        const authors = await Author.find(searchOption);
        res.render('authors/', ({
            authors: authors,
            searchOption: req.query
        }))
    } catch (err) {
        console.log(err);
    }
})

router.get('/new', (req, res) => {
    res.render('authors/new')
})

router.post('/', async(req, res) => {

    const author = new Author({
        name: req.body.name
    })

    try {
        await author.save()
        res.redirect('authors/')
    } catch (err) {
        console.log(err);
        res.redirect('authors/')
    }
})


router.get('/:id', async(req, res) => {

    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: req.params.id }).limit(6).exec();
    try {
        res.render(`authors/show`, {
            author: author,
            books: books
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async(req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render(`authors/edit`, { author: author })
    } catch (err) {
        console.log(err);
        res.redirect('authors/')
    }
})

router.put('/:id', async(req, res) => {

    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author._id}`)
    } catch {
        if (author == null) {
            res.redirect('/')
        } else {
            res.render('authors/edit', {
                author: author,
                errMessage: 'Error Updating Author'
            })
        }

    }
})

router.delete('/:id', async(req, res) => {
    let author;
    try {
        const book = await Book.findOne({ author: req.params.id });
        if (book) {
            console.log(`It connected to`);
            return res.redirect(`/authors/${ req.params.id }`);
        } else {
            author = await Author.findByIdAndDelete(req.params.id);
            return res.redirect('/authors');
        }
    } catch (err) {
        console.log(err);
        if (author == null) {
            return res.redirect('/');
        } else {
            return res.redirect(`/authors/${req.params.id}`);
        }
    }
});


module.exports = router;