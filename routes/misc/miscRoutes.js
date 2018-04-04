var router = require("express").Router();

// URL: "*" (Anything that wasn't redirected before this)
module.exports = function() {

    router.get("*", function(req, res) {
        res.redirect('/');
    });

    router.post("*", function(req, res) {
        res.redirect('/');
    });

    return router;
};
