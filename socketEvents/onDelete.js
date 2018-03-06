module.exports = function(pool, socket) {

    socket.on('delete', function(todo) {
        var todoListId = parseInt(todo.id);
        var title = todo.title;

        pool.getConnection(function(err, connection) {

            if (err) {
                console.log(err);
                return;
            }

            connection.query("DELETE FROM todos WHERE todo_list_id=? AND title=?", [todoListId, title], function(err, rows) {
                connection.release();

                if (err) {
                    console.log(err);
                    return;
                }

                console.log("Successfully deleted: " + title);
            });

        });
    });

};
