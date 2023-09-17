const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    publishDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },


    pageCount: {
        type: Number,
        required: true,
        min: 1
    },
    coverImageName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    coverImageBasePath: {
        type: String,
        default: 'uploads/book_covers'
    }


});


module.exports = mongoose.model('Book', bookSchema);