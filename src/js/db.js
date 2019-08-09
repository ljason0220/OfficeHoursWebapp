var meeting = require("./db/meeting");
var course = require("./db/course");
var user = require("./db/user");
var availability = require("./db/availability");

var dBURI = 'mongodb://daewoo:daewoo1@ds115154.mlab.com:15154/csc302project';

module.exports = {
    uri: dBURI,
    models: {
        meeting: meeting,
        course: course,
        user: user,
        availability: availability
    }
};