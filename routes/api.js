/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

let books = []


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const bookList = books.map(book => ({
        _id: book._id,
        title: book.title,
        commentcount: book.comments ? book.comments.length : 0
      }))
      return res.json(bookList)
    })

    .post(function (req, res) {
      let title = req.body.title;//response will contain new book object including atleast _id and title

      if (!title) {
        return res.send('missing required field title');
      }

      // Ein neues Buchobjekt mit einer eindeutigen ID erstellen
      const newBook = {
        _id: `${title.length + 1}`, // Beispiel-ID (normalerweise würde eine Datenbank dies generieren)
        title,
        comment: []

      };

      books.push(newBook); // Buch in die temporäre Speicherstruktur hinzufügen
      return res.json(newBook); // Rückgabe des neuen Buchobjekts
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      books = []
      return res.send('complete delete successful')
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      let book = books.find(b => b._id === bookid)
      if (!book) return res.send('no book exists')

      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      return res.json({
        _id: book._id,
        title: book.title,
        comments: book.comments || []
      })
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      console.log(bookid, comment)
      let book = books.find(b => b._id === bookid)
      if (!book) return res.send('no book exists')
      if (!comment) return res.send('missing required field comment')
      if (!book.comments) book.comments = [];
      book.comments.push(comment)
      return res.json({
        _id: book._id,
        title: book.title,
        comments: book.comments
      })




      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      
      let bookIndex = books.findIndex(d => d._id === bookid)
      if (bookIndex === -1) return res.send('no book exists');
      books.splice(bookIndex,1)
      return res.send('delete successful')

    });

};
