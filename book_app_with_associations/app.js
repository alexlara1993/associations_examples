/* 
  require the usual modules
*/
var express = require("express"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  app = express();

// Connect to sequelize models
var db = require("./models");

/*
  setup the application middleware

  bodyParser for parsing form data
    on POST-ed form submissions

  methodOverride for faking request
    types not supported by the
    browser
  
  ejs set as the default view 
    engine
*/

/*
  extended true parses the nested  
   form names, i.e. 
    book[title]: ..., book[author]: ...
    becomes
    book: {title: ..., author: ...}
*/
app.use(bodyParser.urlencoded({extended: true}));
/*
  override incoming requests like
    POST /books/1?_method=DELETE
    to match a app.delete("/books", ...)
*/
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// var bookCount = 2;
// var books = [
//               {
//                 id: 1,
//                 title: "The Great Gatsby",
//                 author: "F.S. Fitzgerald"
//               },
//               {
//                 id: 2,
//                 title: "The Giver",
//                 author: "Lois Lowry"
//               },
//             ];



app.get("/books", function (req, res) {
  db.book.findAll(
    {include: [db.author]}
    ).then(function(books) {
    console.log("Showing all books:",books);
    books.forEach(function (book) {
      console.log(new Array(51).join("*"));
      console.log(book.dataValues);
    })

    res.render("books/index", {bookList: books});
  });
  
});


app.get("/books/new", function (req, res) {
  res.render("books/new");
});

app.get("/books/:id", function (req, res) {

  // db.book.find({where: {id: req.params.id}, include: [ db.author] })
  //   .then(function(book) {
  //     console.log("The book is:", book.title);
  //     console.log("The author is: ", book.author.firstname);
  //     res.render("books/show", { book: book });

  //   });

  db.book.find(req.params.id)
    .then(function (foundBook) {
      console.log("Book found");
      foundBook.getAuthor().then(function (author) {
        console.log(author.dataValues);
        console.log(foundBook.dataValues);
        foundBook.dataValues.author = author.dataValues;
        res.send(foundBook.dataValues);
      });
    }); 

});


app.delete("/books/:id", function (req, res) {
  
  pg.connect(config, function(err, client, done){
    if (err) {
         console.error("OOOPS!!! SOMETHING WENT WRONG!", err);
    }
    client.query("DELETE FROM books WHERE id = $1 RETURNING *;", [req.params.id] , function (err, result) {
        done();

        if(result.rows.length) {
          console.log(result.rows[0]); 
         res.redirect("/books");         
        } else {
          res.send(404).send("Book not found!");
        }   
    });
  });
})
// Site Routes

// root path
app.get("/", function (req, res) {
  res.render("sites/index");
});

app.post("/books", function (req, res) {

    pg.connect(config, function(err, client, done){
        if (err) {
             console.error("OOOPS!!! SOMETHING WENT WRONG!", err);
        }
        client.query("INSERT INTO books (title, author) values ($1, $2) RETURNING *;", [req.body.book.title, req.body.book.author] , function (err, result) {
            done(); 
            console.log(result.rows[0]); 
            res.redirect("/books/" + result.rows[0].id);         
        });

    });

});



// don't forget to listen
// db.sequelize.sync().then(function() {
//   var server = app.listen(3000, function() {
//     console.log(new Array(51).join("*"));
//     console.log("\t LISTENING ON: \n\t\t localhost:3000");
//     console.log(new Array(51).join("*")); 
//   });
// });

// But instead of writing about the function above all the time
// why not just create a custom function that listens and 
// displays the same message for us all the time?

var app_starter = function(port) {
  return app.listen(port, function() {
    console.log(new Array(51).join("*"));
    console.log("\t LISTENING ON: \n\t\t localhost:"+port);
    console.log(new Array(51).join("*")); 
  });
};

db.sequelize.sync().then(function() {
  var server = app_starter(3000);
});


