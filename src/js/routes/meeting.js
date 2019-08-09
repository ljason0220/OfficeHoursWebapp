var routes = require('express').Router({mergeParams: true});
var models = require("../db").models;
var mongoose = require('mongoose');
const Meeting = models.meeting;
const User = models.user;
const Course = models.course;
const Availability = models.availability;

// Function that takes status code and generates error object to return
var errorObject = function(status) {
	var retObj = {};
	var tStr;
	if (status === 400) {
		tStr = "Client has not provided sufficient data";
	} else if (status == 401) {
		tStr = "Client not logged in";
	} else if (status == 403) {
		tStr = "Client does not have access to resource";
	} else if (status == 404) {
		tStr = "Client is requesting a resource that doesn't exist";
	} else if (status == 405) {
		tStr = "Client does not have permission";
	} else {
        tStr = "Success";
    }
	retObj.message = tStr;
	return retObj;
};

// Function that checks session information and compares it with what permissions are required (through variable priviledge)
// The variable priviledge asserts whether or not the given call requires instructor priviledges
var permissionCheck = function(req, priviledge) {
	if (req.session.user === undefined) {
		return 401;
	} else if (req.session.isInstructor != "true" && priviledge) {
		return 403;
	} else {
		return 200;
	}
};

// API /meetings/meeting
routes.route('/meeting').all(function(req, res, next) {
	// var prelimStatus = permissionCheck(req, false);
	// if (prelimStatus != 200) {
	// 	res.status(prelimStatus).json(errorObject(prelimStatus));
	// }
	next();
}).post(function(req, res) {
	if (req.body.interval === undefined || req.body.attendee === undefined || req.body.availability === undefined) {
		return res.status(400).json(errorObject(400));
	} 

	let generateQuery = {};
	generateQuery.referring_block = mongoose.Types.ObjectId(req.body.availability);
	generateQuery.interval = req.body.interval;
	if (req.body.note !== undefined) {
		generateQuery.note = req.body.note;
	}

	var attendee;
	let hostUtorId;
	var hostId;
	var courseCode;
	var newMeeting;

	const generalErr = (err) => {
		var err_res = errorObject(400);
		err_res.message = err_res.message + "\n" + err.message;
		res.status(400).json(err_res);
	};

	const respond = (success) => {
		if (success) {
			res.status(200).json({meeting: newMeeting});
		} else {
			res.status(400).json(errorObject(400));
		}
	};

	const verify = (user) => {
		if (user) {
			attendee = user;
			return Availability.bookMeeting({_id: mongoose.Types.ObjectId(req.body.availability)}, parseInt(req.body.interval));
		} else {
			return Promise.resolve(false);
		}
	};

	const create = (availability) => {
		if (availability) {
			hostUtorId = mongoose.Types.ObjectId(availability.host);
			courseCode = availability.courseCode;
			generateQuery.attendees = [mongoose.Types.ObjectId(mongoose.Types.ObjectId(attendee._id))];
			return Meeting.generateMeeting(generateQuery);
		} else {
			return Promise.resolve(false);
		}
	};

	const find = (meeting) => {
		if (meeting) {
			newMeeting = meeting;
			return User.findUser({utorId: hostUtorId});
		} else {
			return Promise.resolve(false);
		}
	};

	const updateUsers = (user) => {
		if (user) {
			hostId = mongoose.Types.ObjectId(user._id);
			return User.addMeeting({_id: {$in: [mongoose.Types.ObjectId(attendee._id), mongoose.Types.ObjectId(user._id)]}}, mongoose.Types.ObjectId(newMeeting._id));
		} else {
			return Promise.resolve(false);
		}
	};

	// const updateCourse = (success) => {
	// 	if (success) {
	// 		return Course.addMeeting({courseCode: courseCode}, mongoose.Types.ObjectId(newMeeting._id));
	// 	} else {
	// 		return Promise.resolve(false);
	// 	}
	// };

	const updateAvailability = (success) => {
		if (success) {
			return Availability.addMeeting({_id: mongoose.Types.ObjectId(req.body.availability)}, mongoose.Types.ObjectId(newMeeting._id));
		} else {
			return Promise.resolve(false);
		}
	}

	User.getUser({utorId: req.body.attendee})
	.then(verify)
	.then(create)
	.then(find)
	.then(updateUsers)
	// .then(updateCourse)
	.then(updateAvailability)
	.then(respond)
	.catch(generalErr);
});

// API /meetings/:meetingId
routes.route('/:meetingId').all(function(req, res, next) {
	// var prelimStatus = permissionCheck(req, false);
	// if (prelimStatus != 200) {
	// 	res.status(prelimStatus).json(errorObject(prelimStatus));
	// }
	next();
}).get(function(req, res) {
	const respond = (meeting) => {
		if (meeting) {
			res.status(200).json({meeting: meeting});
		} else {
			res.status(404).json(errorObject(404));
		}
	};

	const generalErr = (err) => {
		var err_res = errorObject(400);
		err_res.message = err_res.message + "\n" + err.message;
		res.status(400).json(err_res);
	};

	Meeting.getMeeting({_id: mongoose.Types.ObjectId(req.params.meetingId)})
	.then(respond)
	.catch(generalErr);
});

// API /meetings/:meetingId/attendee
routes.route('/:meetingId/attendee').all(function(req, res, next) {
	// var prelimStatus = permissionCheck(req, false);
	// if (prelimStatus != 200) {
	// 	res.status(prelimStatus).json(errorObject(prelimStatus));
	// }
	next();
}).put(function(req, res) {
	if (req.body.attendee === undefined) {
		return res.status(400).json(errorObject(400));
	}

	let student;
	let meet;
	const updateMeeting = (user) => {
		if (user && !user.isInstructor) {
			student = user;
			return Meeting.updateAttendee({_id: mongoose.Types.ObjectId(req.params.meetingId)}, mongoose.Types.ObjectId(user._id));
		} else {
			return Promise.resolve(false);
		}
	};

	const updateUser = (meeting) => {
		if (meeting) {
			meet = meeting;
			return student.addMeeting(mongoose.Types.ObjectId(meeting._id));
		} else {
			return Promise.resolve(false);
		}
	};

	const respond = (user) => {
		if (user) {
			return res.status(200).json({meeting: meet});
		} else {
			return res.status(404).json(errorObject(404));
		}
	};

	const generalErr = (err) => {
		var err_res = errorObject(400);
		err_res.message = err_res.message + "\n" + err.message;
		res.status(400).json(err_res);
	};

	User.getUser({utorId: req.body.attendee})
	.then(updateMeeting)
	.then(updateUser)
	.then(respond)
	.catch(generalErr);
}).delete(function(req, res) {
	if (req.body.attendee === undefined) {
		return res.status(400).json(errorObject(400));
	}

	const searchQuery = {_id: mongoose.Types.ObjectId(req.params.meetingId)};

	const generalErr = (err) => {
		var err_res = errorObject(400);
		err_res.message = err_res.message + "\n" + err.message;
		res.status(400).json(err_res);
	};

	let student;
	const deleteUser = (user) => {
		if (user) {
			student = user;
			return Meeting.deleteAttendee(searchQuery, mongoose.Types.ObjectId(user._id));
		} else {
			return Promise.resolve(false);
		}
	};

	const updateUser = (meeting) => {
		if (meeting) {
			return student.deleteMeeting(mongoose.Types.ObjectId(meeting._id));
		} else {
			return Promise.resolve(false);
		}
	};

	User.getUser({utorId: req.body.attendee})
	.then(deleteUser)
	.then(updateUser)
	.then(
		(success) => {
			if (success) {
				res.status(200).json(errorObject(200));
			} else {
				res.status(404).json(errorObject(404));
			}
		}
	)
	.catch(generalErr);
});

module.exports = routes;
