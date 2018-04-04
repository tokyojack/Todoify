module.exports = function (pool, socket) {

    socket.on("add", function (todo) {
        var title = todo.title;

        pool.getConnection(function (err, connection) {
            if (flashUtils.isDatabaseError(req, res, "/", err))
                return;

            var addTodo = require("./queries/addTodo.sql");

            connection.query(addTodo, [title, parseInt(todo.id)], function (
                err,
                rows
            ) {
                connection.release();

                if (flashUtils.isDatabaseError(req, res, "/", err))
                    return;

                console.log("Successfully added: " + title);
            });
        });
    });

};