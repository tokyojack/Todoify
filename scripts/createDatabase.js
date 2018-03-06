var mysql = require('mysql');

var config = require('../config/config');
var connection = mysql.createConnection(config.db);

connection.query('CREATE TABLE `todoLists` ( \
 `id` int(11) NOT NULL AUTO_INCREMENT, \
 `title` varchar(50) NOT NULL, \
 `user_id` int(11) NOT NULL, \
 `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \
 PRIMARY KEY (`id`), \
 KEY `user_id` (`user_id`) \
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=latin1');

connection.query("CREATE TABLE `todos` ( \
 `id` int(11) NOT NULL AUTO_INCREMENT, \
 `title` varchar(255) NOT NULL, \
 `is_done` bit(1) NOT NULL DEFAULT b'0', \
 `todo_list_id` int(11) NOT NULL, \
 PRIMARY KEY (`id`), \
 KEY `todo_list_id` (`todo_list_id`) \
) ENGINE=MyISAM AUTO_INCREMENT=56 DEFAULT CHARSET=latin1");

connection.query('CREATE TABLE `users` ( \
 `id` int(11) NOT NULL AUTO_INCREMENT, \
 `username` varchar(50) NOT NULL, \
 `password` char(60) NOT NULL, \
 `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \
 PRIMARY KEY (`id`), \
 UNIQUE KEY `username` (`username`) \
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1');

console.log('Success: Database Created!');

connection.end();
