const express = require('express')
const Author = require('../models/author');
const router = express.Router()


router.get('/', async(req, res) => {
    try {
        const authors = await Author.find();
        res.render('authors/', ({ authors: authors }))
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





module.exports = router;