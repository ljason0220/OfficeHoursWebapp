const srv = require('express');
const session = require('express-session')
const http = require('http');
const helmet = require('helmet');
const body = require('body-parser');
const mongoose = require('mongoose');
const router = require('./router');

var PORT = process.env.PORT || 5000;
var app = srv();
app.use(body.urlencoded({ extended: false }));
app.use(helmet());
app.use(session({
    secret: "we don't love office hours",
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: true
    }
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(body.json());
app.use(srv.static(__dirname + '/../'));

// app.use(function(err, req, res, next) {
//     if (err) {
//         res.status(500).json({"message": "INVALID REQUEST"});
//     } else {
//         req.user = (req.session.user != null) ? req.session.user : null;
//         req.isInstructor = (req.session.isInstructor != null) ? req.session.isInstructor : null;
//         next();
//     }

// });
app.use("/", router);


var db = require("./db");
mongoose.connect("mongodb://user:test123@ds131890.mlab.com:31890/csc302test", {useNewUrlParser: true});
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
    console.log("Successful connection");
});

http.createServer(app).listen(PORT, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Listening on HTTP server running on port " + `${PORT}`);
    }
});
