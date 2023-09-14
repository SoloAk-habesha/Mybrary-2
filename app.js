if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express')
const mongoose = require('mongoose');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');

const authorRouter = require('./routes/authors');
const app = express()
const port = process.env.PORT || 3000


app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(ejsLayouts);


app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/layout');
app.use('/authors', authorRouter)


app.get('/', (req, res) => {
    res.render('index')
})



mongoose.connect(process.env.DATABASE_URL).then(() => console.log('connected to database'))

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})