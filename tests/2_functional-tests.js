/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function (done) {
    chai.request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('1. Test POST /api/books with title', function (done) {
        const bookData = {
          title: 'The Great Gatsby',

        };
        chai.request(server)
          .post('/api/books')
          .send(bookData)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title');
            assert.equal(res.body.title, 'The Great Gatsby')
            done();
          })
      });

      test('2. Test POST /api/books with no title given', function (done) {
        const bookData = {
          title: '',
        };
        chai.request(server)
          .post('/api/books')
          .send(bookData)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');

            done();
          })

      });

    });


    suite('GET /api/books => array of books', function () {

      test('3. Test GET /api/books', function (done) {

        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          })
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('4. Test GET /api/books/[id] with id not in db', function (done) {

        chai.request(server)
          .get('/api/books/worngId')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists')
            done();
          })
      });

      test('5. Test GET /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .get('/api/books/1')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.equal(res.body.title, 'hello');
            assert.equal(res.body._id, '1');
            done();
          })

      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('6. Test POST /api/books/[id] with comment', function (done) {
        const bookId = '1'
        const bookData = {
          comment: 'new comment'
        };
        chai.request(server)
          .post(`/api/books/${bookId}`)
          .send(bookData)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.equal(res.body.title, 'hello');
            assert.equal(res.body._id, '1');
            assert.include(res.body.comments, 'new comment');
            done();
          })
      });

      test('7. Test POST /api/books/[id] without comment field', function (done) {
        const bookId = '1'
        const bookData = {
          comment: ''
        };
        chai.request(server)
          .post(`/api/books/${bookId}`)
          .send(bookData)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment');
            done();
          })

      });

      test('8. Test POST /api/books/[id] with comment, id not in db', function (done) {
        const bookId = 'worng'
        const bookData = {
          comment: 'Bla bla'
        };
        chai.request(server)
          .post(`/api/books/${bookId}`)
          .send(bookData)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          })
      });

      suite('DELETE /api/books/[id] => delete book object id', function () {

        test('9. Test DELETE /api/books/[id] with valid id in db', function (done) {
          const bookId = '2'

          chai.request(server)
            .delete(`/api/books/${bookId}`)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'delete successful');
              done();
            })





        });

        test('10. Test DELETE /api/books/[id] with  id not in db', function (done) {
          const bookId = 'worng'

          chai.request(server)
            .delete(`/api/books/${bookId}`)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'no book exists');
              done();
            })
        });
      });
    });

  });
})
