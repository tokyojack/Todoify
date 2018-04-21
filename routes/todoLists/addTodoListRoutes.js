var router = require("express").Router();

var flashUtils = require('../../utils/flashUtils');
var middleMan = require("../../utils/middleMan");

var redirectLocation = "/home";


// URL: "/addtodolist"
module.exports = function(pool) {

    //"addTodoList.ejs" page
    router.get("/", middleMan.isLoggedIn, function(req, res) {
        res.render("todoLists/addTodoList.ejs");
    });

    // Inserts "todo" on "/addtodolist" form submit
    router.post("/", middleMan.isLoggedIn, function(req, res) {
        pool.getConnection(function(err, connection) {
            if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                return;

            var insertTodoList = require('./queries/insertTodoList.sql');

            connection.query(insertTodoList, [req.body.title, req.user.id], function(err, row) {
                connection.release();

                if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                    return;

                //Redirects to new, created todo list ("/todolist/<todoListId>")
                flashUtils.successMessage(req, res, '/todolist/' + row.insertId, 'Successfully created a new todo-list!');
            });
        });
    });

    return router;
};
