//============================= Packages =============================

var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var flash = require('express-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var http = require('http').Server(app);
var io = require('socket.io')(http);

var colors = require('colors');

//============================= Pool =============================

var config = require('./config/config');
var mysql = require("mysql");
var pool = mysql.createPool(config.db);

exports.pool = pool;

require('require-sql');

//============================= Passport =============================

var passport = require('passport');
require('./config/passport')(passport, pool);

//============================= Letting express use them =============================

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));
app.use(flash());

app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(session({
    secret: 'interesting',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

var flashUtils = require('./utils/flashUtils');

app.use(function (req, res, next) {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");

    if (req.isAuthenticated()) {

        res.locals.user = req.user;

        pool.getConnection(function (err, connection) {
            if (flashUtils.isDatabaseError(req, res, '/', err))
                return;

            connection.query("SELECT id, title FROM todoLists WHERE user_id=?", [req.user.id], function (err, rows) {
                connection.release();

                if (flashUtils.isDatabaseError(req, res, '/', err))
                    return;

                res.locals.url = req.originalUrl;
                res.locals.todoLists = rows;
                next();
            });
        });

        return;
    }

    next();
});

//============================= Routes =============================

// Index

var indexRoutes = require("./routes/indexRoutes")();
app.use("/", indexRoutes);

//TodoLists

var homeRoutes = require("./routes/todoLists/homeRoutes")();
app.use("/home", homeRoutes);

var todoListRoutes = require("./routes/todoLists/todoListRoutes")(pool);
app.use("/todolist", todoListRoutes);

var addTodoListRoutes = require("./routes/todoLists/addTodoListRoutes")(pool);
app.use("/addtodolist", addTodoListRoutes);

// Authentication

var loginRoutes = require("./routes/authentication/loginRoutes")(passport);
app.use("/login", loginRoutes);

var signupRoutes = require("./routes/authentication/signupRoutes")(passport);
app.use("/signup", signupRoutes);

var logoutRoutes = require("./routes/authentication/logoutRoutes")();
app.use("/logout", logoutRoutes);

//Misc

var miscRoutes = require("./routes/misc/miscRoutes")();
app.use("*", miscRoutes);

//============================= Socket io =============================

io.on('connection', function (socket) {

    require('./socketEvents/onAdd')(pool, socket);
    require('./socketEvents/onDelete')(pool, socket);
    require('./socketEvents/onComplete')(pool, socket);

});

//============================= Starting Server =============================

// Make sure it's "http" instead of "app" for Socket.io
http.listen(8080, function () {
    console.log("Server running".rainbow);
});

//============================= Ending Server =============================

require('./utils/nodeEnding').nodeEndingCode(nodeEndInstance);

function nodeEndInstance() {
    console.log("The pool has been closed.".bgBlack.blue);
    pool.end();
}