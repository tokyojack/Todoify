var router = require("express").Router();

var flashUtils = require('../../utils/flashUtils');
var middleMan = require("../../utils/middleMan");

var redirectLocation = "/home";

// URL: "/todolist"
module.exports = function(pool) {

    //Selects "todos" with the logged-in persons "id"
    router.get("/:id", middleMan.checkIfUserOwnsTodolist, function(req, res) {

        var id = parseInt(req.params.id);

        pool.getConnection(function(err, connection) {
            if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                return;

            var selectTodos = require('./queries/selectTodos.sql');

            connection.query(selectTodos, [id], function(err, rows) {
                connection.release();

                if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                    return;

                res.render("todoLists/todoList.ejs", {
                    id: id,
                    todos: rows
                });
            });
        });
    });

    return router;
};
