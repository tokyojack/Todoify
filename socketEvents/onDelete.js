module.exports = function (pool, socket) {

    socket.on('delete', function (todo) {
        var title = todo.title;

        pool.getConnection(function (err, connection) {
            if (flashUtils.isDatabaseError(req, res, "/", err))
                return;

            connection.query("DELETE FROM todos WHERE todo_list_id=? AND title=?", [parseInt(todo.id), title], function (err, rows) {
                connection.release();

                if (flashUtils.isDatabaseError(req, res, "/", err))
                    return;

                console.log("Successfully deleted: " + title);
            });

        });
    });

};