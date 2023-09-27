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


    coverImage: {
        type: Buffer,
        required: true
    },
    description: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }


});

bookSchema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null) {
        const dataURI = `data:${this.coverImage.contentType};base64,${this.coverImage.toString('base64')}`;
        return dataURI;
    }
});


module.exports = mongoose.model('Book', bookSchema);