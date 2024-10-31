/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
require('dotenv').config();

const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
 
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000 // Timeout nach 5 Sekunden
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const Book = mongoose.model('books', new mongoose.Schema({
  title: String,
  comments: [String]
}));

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await Book.find({})
        const bookList = books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments ? book.comments.length : 0
        }));
        return res.json(bookList)
      } catch (err) {
        console.error("Connection error:", err);
        return res.status(500).send('Internal Server Error')
      }
    })

    .post(async function (req, res) {
      let title = req.body.title;//response will contain new book object including atleast _id and title
      console.log("Title from request:", title);

      if (!title) {
        console.log("Missing title field");
        return res.send('missing required field title');
      }

      // Ein neues Buchobjekt mit einer eindeutigen ID erstellen
      const newBook = new Book({
        title,
        comments: []

      });
      try {
        const saveBook = await newBook.save();
        console.log("Book saved successfully:", saveBook);
        return res.json(saveBook)
      } catch (err) {
        console.error("Error saving book:", err);
        return res.status(500).send(err)
      }

    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      try {
        await Book.deleteMany({});
        return res.send('complete delete successful');
      } catch (err) {
        return res.status(500).send(err)
      }

    });


  app.route('/api/books/:id')
    .get(async function (req, res) {
      let bookid = req.params.id;

      try {
        const book = await Book.findById(bookid);
        if (!book) return res.send('no book exists')

        return res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments || []
        })
      } catch (err) {
        return res.send('no book exists')
      }

    })
    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      // console.log(bookid, comment)

      if (!comment) return res.send('missing required field comment')

      try {
        const book = await Book.findById(bookid)
        if (!book) return res.send('no book exists')

        book.comments.push(comment)
        const updatedBook = await book.save();
        return res.json({
          _id: updatedBook._id,
          title: updatedBook.title,
          comments: updatedBook.comments
        })
      } catch (err) {
        return res.status(500).send(err)
      }
    })


    .delete(async function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      try {
        const book = await Book.findByIdAndDelete(bookid)
        if (!book) return res.send('no book exists')
        return res.send('delete successful')

      } catch (err) {
        res.status(500).send(err)
      }


    });

};
