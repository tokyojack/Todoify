module.exports = function (pool, socket) {

    socket.on("complete", function (todo) {
        var todoListId = parseInt(todo.id);
        var title = todo.title;
        var isComplete = todo.isComplete;

        pool.getConnection(function (err, connection) {
            if (flashUtils.isDatabaseError(req, res, "/", err))
                return;

            var updateTodoIsDone = require("./queries/updateTodoIsDone.sql");

            connection.query(
                updateTodoIsDone, [isComplete === true ? 1 : 0, title, todoListId], // Returns a 0/1 as MySQL doesn't accept booleans
                function (err, rows) {                                              // (0 = false & 1 = true)
                    connection.release();

                    if (flashUtils.isDatabaseError(req, res, "/", err))
                        return;

                    console.log("Successfully update: " + title + " to: " + isComplete);
                }
            );
        });
    });

};