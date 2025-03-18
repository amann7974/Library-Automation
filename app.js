const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const loginUserAdmin = require('./controllers/loginUser/admin');
const loginUserFaculty = require("./controllers/loginUser/faculty");
const isAdmin = require('./middlewares/admin/checkIsAdmin');
const isLoggedIn = require('./middlewares/isLoggedIn');
const isFaculty = require('./middlewares/faculty/isFaculty');
const addBook = require('./controllers/books/add');
const fetchBooks = require('./controllers/books/fetch');
const deleteBook = require('./controllers/books/delete');
const updateBook = require('./controllers/books/update');
const fetchSingleBook = require('./controllers/books/singleBook');
const fetchUsers = require('./controllers/users/fetch');
const getSingleUser = require('./controllers/users/singleUser');
const deleteUser = require('./controllers/users/delete');
const updateUser = require('./controllers/users/update');
const CreateUsers = require('./controllers/users/create');
const loggedInUser = require('./controllers/loginUser/loggedInUser');
const stats = require('./controllers/stats/admin');
const facultyStats = require('./controllers/stats/faculty');



app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.render("home");
});


app.get("/pages/login/admin", (req, res) => {
  res.render("admin/adminLogin");
});

app.post("/api/login/admin", (req, res) => {
    loginUserAdmin(req, res);
});

app.get("/pages/admin/dashboard", (req, res) => {
    res.render("admin/adminDashboard")
});

app.get("/pages/admin/dashboard/books", (req, res) => {
    res.render("admin/books")
});

app.get("/pages/admin/dashboard/users", (req, res) => {
    res.render("admin/users")
});

app.post("/pages/admin/dashboard/verify", isAdmin, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Admin verified successfully"
    });
});


app.get("/pages/login/faculty", (req, res) => {
  res.render("faculty/facultyLogin");
});

app.post("/api/login/faculty", (req, res) => {
  loginUserFaculty(req, res);
});

app.get("/pages/faculty/dashboard", (req, res) => {
  res.render("faculty/facultyDashboard");
});

app.get("/pages/faculty/dashboard/account", (req, res) => {
  res.render("faculty/account");
});

app.get("/pages/faculty/dashboard/searchBooks", (req, res) => {
  res.render("faculty/searchBooks");
});

app.get("/pages/faculty/dashboard/issuedBooks", (req, res) => {
  res.render("faculty/issuedBooks");
});

app.post("/pages/faculty/dashboard/verify", isFaculty, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin verified successfully",
  });
});

// app.get("/api/faculty/dashboard-stats", isFaculty, facultyStats, (req, res) => {});


// Api---------------------------------------


app.post("/api/admin/user/register", isAdmin,  (req, res) => {
  CreateUsers(req, res);
});

app.get("/api/admin/allusers", isAdmin, fetchUsers, (req, res) => {
  res.status(200).json({
    success: true,
    users: req.users,
    message: "All users fetched successfully",
  });
});

app.get("/api/admin/singleUser/:id", isAdmin, getSingleUser, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
    message: "User fetched successfully",
  });
});

app.get("/api/admin/deleteUser/:id", isAdmin, deleteUser, (req, res) => {});

app.post("/api/admin/updateUser/:id", isAdmin, updateUser, (req, res) => {});

app.post("/api/isLoggedIn", isLoggedIn, (req, res) => {
  
    res.status(200).json({
        success: true,
        role: req.decoded.role,
        message: "User is logged in"
    });

});

app.post("/api/loggedInUser", loggedInUser, (req, res) => {

  res.status(200).json({
    success: true,
    user: req.user,
    message: "User is logged in",
  });
});

app.get("/api/logout", (req, res) => {
    res.clearCookie("accesstoken");
    res.redirect("/");
});

// -----------------Books---------------------

app.get("/api/admin/allBooks", isAdmin, fetchBooks, (req, res) => {
  res.status(200).json({
    success: true,
    books: req.books,
    message: "All books fetched successfully",
  });
});

app.get("/api/admin/singleBook/:id", isAdmin, fetchSingleBook, (req, res) => {
  res.status(200).json({
    success: true,
    book: req.book,
    message: "Book fetched successfully",
  });
});

app.post("/api/admin/addBooks", isAdmin, addBook, (req, res) => {
    res.status(201).json({
      success: true,
      message: "Book added successfully",
      bookId: req.insertId,
    });

});

app.post("/api/admin/deleteBook/:id", isAdmin, deleteBook, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Book deleted successfully"
    });
})

app.post("/api/admin/updateBook/:id", isAdmin, updateBook, (req, res) => {})

app.get("/api/admin/stats", isAdmin, stats, (req, res) => {

});



app.get("/api/faculty/dashboard-stats", isFaculty, facultyStats, (req, res) => {
  res.status(200).json({
    success: true,
    stats: req.stats,
    message: "Faculty stats fetched successfully",
  });
});

app.get("/api/faculty/searchBooks",
  isFaculty,
  fetchBooks,
  (req, res) => {
    res.status(200).json({
      success: true,
      books: req.books,
      message: "Books fetched successfully",
    });
  }
);

app.post("/api/faculty/updateBook/:id",
  isFaculty,
  updateBook,
  (req, res) => {}
);

app.post(
  "/api/faculty/account/update/:id",
  isFaculty,
  updateUser,
  (req, res) => {}
);

app.use((req, res) => {
  res.status(404).render('notFound');
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});