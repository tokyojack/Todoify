module.exports = function(pool, socket) {

    socket.on('complete', function(todo) {
        var todoListId = parseInt(todo.id);
        var title = todo.title;
        var isComplete = todo.isComplete;

        pool.getConnection(function(err, connection) {

            if (err) {
                console.log(err);
                return;
            }

            connection.query("UPDATE todos SET is_done=? WHERE title=? AND todo_list_id", [(isComplete === true ? 1 : 0), title, todoListId], function(err, rows) {
                connection.release();

                if (err) {
                    console.log(err);
                    return;
                }

                console.log("Successfully update: " + title + " to: " + isComplete);
            });

        });
    });
    
};