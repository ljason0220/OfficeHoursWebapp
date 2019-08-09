var users = require('./routes/user');
var courses = require('./routes/course');
var meetings = require('./routes/meeting');
var auth = require('./routes/auth');
var routes = require('express').Router({mergeParams: true});

routes.get('/', function(req, res, next) {
    console.log("Application running...");
});

routes.use('/users', users);
routes.use('/courses', courses);
routes.use('/meetings', meetings);
routes.use('/auth', auth)

module.exports = routes;