var flashUtils = require('./flashUtils');

exports.checkIfUserOwnsTodolist = function(req, res, next) {
    if (!isLoggedIn(req, res))
        return;

    var pool = require('../index').pool;

    pool.getConnection(function(err, connection) {
        if (flashUtils.isDatabaseError(req, res, "back", err))
            return;

        //TODO seperate file
        var query = 'SELECT user_id FROM todoLists WHERE id=?';

        connection.query(query, [parseInt(req.params.id)], function(err, rows) {
            if (rows.length <= 0)
                return;

            if (flashUtils.isDatabaseError(req, res, "back", err))
                return;

            if (flashUtils.errorMessageif(req, res, "back", (rows[0].user_id != req.user.id), "You do not own this todo list!"))
                return;

            next();
            return;
        });
    });
};

exports.isLoggedIn = function(req, res, next) {
    if (!(isLoggedIn(req, res)))
        return;

    return next();
};

function isLoggedIn(req, res) {
    if (req.isAuthenticated())
        return true;

    req.flash("error", "You must be logged in todo that.");
    res.redirect("/login");
    return false;
}
