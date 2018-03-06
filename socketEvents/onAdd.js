module.exports = function(pool, socket) {

    socket.on('add', function(todo) {
        var todoListId = parseInt(todo.id);
        var title = todo.title;

        pool.getConnection(function(err, connection) {

            if (err) {
                console.log(err);
                return;
            }

            connection.query("INSERT INTO todos(title, todo_list_id) VALUES(?,?)", [title, todoListId], function(err, rows) {
                connection.release();

                if (err) {
                    console.log(err);
                    return;
                }

                console.log("Successfully added: " + title);

            });

        });
    });

};