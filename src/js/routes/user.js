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

// API /users/user
routes.route('/user').post(function(req, res) {
	if (req.body.utorId === undefined || req.body.name === undefined || req.body.email === undefined ||
		req.body.isInstructor === undefined || req.body.password === undefined) {
		return res.status(400).json(errorObject(400));
	}

	const userQuery = {
		utorId: req.body.utorId,
		name: req.body.name,
		email: req.body.email,
		isInstructor: req.body.isInstructor,
		password: req.body.password
	};

	User.createUser(userQuery)
	.then((user) => {
		res.status(200).json({user: user});
	}).catch((err) => {console.log("ree"); res.status(400).json(errorObject(400))});
});

// API /users/:utorid
routes.route('/:utorId').all(function(req, res, next) {
	// var prelimStatus = permissionCheck(req, false);
	// if (prelimStatus != 200) {
	// 	return res.status(prelimStatus).json(errorObject(prelimStatus));
	// }
	next();
}).get(function(req, res) {
	User.getFullUser({utorId: req.params.utorId})
	.then((user) => {
		if (user) {
			res.status(200).json({user: user});
		} else {
			res.status(404).json(errorObject(404));
		}
	}).catch((err) => {res.status(400).json(errorObject(400));});

}).put(function(req, res) {
	if (req.body.name === undefined && req.body.email === undefined) {
		return res.status(400).json(errorObject(400));
	}

	let updateQuery = {};
	if (req.body.name !== undefined) {
		updateQuery.name = req.body.name;
	}
	if (req.body.email !== undefined) {
		updateQuery.email = req.body.email;
	}

	User.updateUser({utorId: req.params.utorId}, updateQuery)
	.then((user) => {
		if (user) {
			res.status(200).json({user: user});
		} else {
			res.status(404).json(errorObject(404));
		}
	}).catch((err) => {res.status(400).json(errorObject(400));});
});


// API /users/utorid/availabilities
routes.route('/:utorId/availabilities').get(function(req, res) {
	// var prelimStatus = permissionCheck(req, false);
	// if (prelimStatus !== 200) {
	// 	return res.status(prelimStatus).json(errorObject(prelimStatus));
	// }

	User.getAvailabilities({utorId: req.params.utorId})
	.then((availabilities) => {
		if (availabilities) res.status(200).json({availabilities: availabilities});
		else res.status(404).json(errorObject(404));
	})
	.catch((err) => {res.status(400).json(errorObject(400));});

}).post(function(req, res) {
	// var prelimStatus = permissionCheck(req, true);
	// if (prelimStatus !== 200) {
	// 	return res.status(prelimStatus).json(errorObject(prelimStatus));
	// }

	// if (req.params.utorId != req.session.user) {
	// 	return res.status(400).json(errorObject(400));
	// }

	if (req.body.startTime === undefined || req.body.endTime === undefined || req.body.meeting_length === undefined || req.body.host === undefined ||
	req.body.location === undefined || req.body.courseCode === undefined) {
		return res.status(400).json(errorObject(400));
	}

	let startHour = parseInt(req.body.startTime.substring(11, 13));
	let startMin = parseInt(req.body.startTime.substring(14, 16));
	let endHour = parseInt(req.body.endTime.substring(11, 13));
	let endMin = parseInt(req.body.endTime.substring(14, 16));
	let meeting_length = parseInt(req.body.meeting_length);
	let booked = [];
	for (let i = 0; i < ((endHour - startHour) * 60 + (endMin - startMin)) / meeting_length; i++) {
		booked.push(false);
	}

	const availabilityQuery = {
		startTime: req.body.startTime,
		endTime: req.body.endTime,
		meeting_length: meeting_length,
		host: req.body.host,
		location: req.body.location,
		courseCode: req.body.courseCode,
		booked: booked
	};

	const createAvailability = (courses) => {
		if (courses) {
			for (let i = 0; i < courses.length; i++) {
				if (courses[i].courseCode == req.body.courseCode) {
					return Availability.createAvailability(availabilityQuery);
				}
			}
			return Promise.resolve(false);
		} else {
			return Promise.resolve(false);
		}
	};

	let newId;
	let newAvailability;
	const updateUser = (availability) => {
		if (availability) {
			newAvailability = availability;
			newId = mongoose.Types.ObjectId(availability._id);
			return User.addAvailability({utorId: req.params.utorId}, newId);
		} else {
			return Promise.resolve(false);
		}
	};

	const updateCourse = (success) => {
		if (success) {
			return Course.addAvailability({courseCode: req.body.courseCode}, newId);
		} else {
			return Promise.resolve(false);
		}
	};

	const respond = (course) => {
		if (course) {
			res.status(200).json({availability: newAvailability});
		} else {
			res.status(404).json(errorObject(404));
		}
	};

	User.getCourses({utorId: req.params.utorId})
	.then(createAvailability)
	.then(updateUser)
	.then(updateCourse)
	.then(respond)
	.catch((err) => {res.status(400).json(errorObject(400));});

}).delete(function(req, res) {
	var prelimStatus = permissionCheck(req, true);
	if (prelimStatus !== 200) {
		return res.status(prelimStatus).json(errorObject(prelimStatus));
	}

	// Not happening.
});


// API /users/:utorid/availabilities/:availabilityId
routes.route('/:utorId/availabilities/:availabilityId').get(function(req, res) {
	// var prelimStatus = permissionCheck(req, false);
	// if (prelimStatus !== 200) {
	// 	res.status(prelimStatus).json(errorObject(prelimStatus));
	// }

	const verify = (availability) => {
		if (availability) {
			if (availability.host == req.params.utorId) {
				return res.status(200).json({availability: availability});
			}
			res.status(404).json(errorObject(404));
		} else {
			res.status(404).json(errorObjec(404));
		}
	};

	Availability.getAvailability({_id: mongoose.Types.ObjectId(req.params.availabilityId)})
	.then(verify)
	.catch((err) => {res.status(400).json(errorObject(400));});

}).put(function(req, res) {
	// var prelimStatus = permissionCheck(req, true);
	// if (prelimStatus !== 200) {
	// 	return res.status(prelimStatus).json(errorObject(prelimStatus));
	// }

	if (req.body.location === undefined && req.body.courseCode === undefined &&
		req.body.startTime === undefined && req.body.endTime === undefined) {
		return res.status(400).json(errorObject(400));
	}

	let updateQuery = {};
	if (req.body.location !== undefined) {
		updateQuery.location = req.body.location;
	}
	if (req.body.courseCode !== undefined) {
		updateQuery.courseCode = req.body.courseCode;
	}
	if (req.body.startTime !== undefined) {
		updateQuery.startTime = req.body.startTime;
	}
	if (req.body.endTime !== undefined) {
		updateQuery.endTime = req.body.endTime;
	}

	const update = (availability) => {
		if (availability) {
			if (availability.host == req.params.utorId) {
				return Availability.updateAvailability({_id: mongoose.Types.ObjectId(req.params.availabilityId)}, updateQuery)
			}
		}
		return Promise.resolve(false);
	};

	const respond = (availability) => {
		if (availability) {
			res.status(200).json({availability: availability});
		} else {
			res.status(404).json(errorObject(404));
		}
	}

	Availability.getAvailability({_id: mongoose.Types.ObjectId(req.params.availabilityId)})
	.then(update)
	.then(respond)
	.catch((err) => {res.status(400).json(errorObject(400));});

}).delete(function(req, res) {
	// var prelimStatus = permissionCheck(req, true);
	// if (prelimStatus !== 200) {
	// 	return res.status(prelimStatus).json(errorObject(prelimStatus));
	// }

	let oldId;
	let courseCode;
	let meetings = [];
	const verify = (availability) => {
		if (availability) {
			if (availability.host == req.params.utorId) {
				oldId = availability._id;
				courseCode = availability.courseCode;

				for (let i = 0; i < availability.meetings.length; i++) {
					meetings.push(mongoose.Types.ObjectId(availability.meetings[i]));
				}

				return Meeting.deleteMeetings({_id: {$in: availability.meetings}});
			}
		}
		return Promise.resolve(false);
	};

	const deletion = (success) => {
		if (success) {
			return Availability.deleteAvailability({_id: oldId});
		}
		return Promise.resolve(false);
	};

	const updateUser = (success) => {
		if (success) {
			return User.deleteAvailability({utorId: req.params.utorId}, oldId);
		}
		return Promise.resolve(false);
	};

	const updateCourse = (success) => {
		if (success) {
			return Course.deleteAvailability({courseCode: courseCode}, oldId);
		}
		return Promise.resolve(false);
	};

	const updateStudents = (success) => {
		if (success) {
			return User.updateUsers({},
				{$pullAll: {meetings: meetings}}
			);
		}
		return Promise.resolve(false);
	}

	const respond = (success) => {
		if (success) {
			res.status(200).json(errorObject(200));
		} else {
			res.status(404).json(errorObject(404));
		}
	};

	Availability.getAvailability({_id: mongoose.Types.ObjectId(req.params.availabilityId)})
	.then(verify)
	.then(deletion)
	.then(updateUser)
	.then(updateCourse)
	.then(updateStudents)
	.then(respond)
	.catch((err) => {res.status(400).json(errorObject(400));});
});

// API /users/:utorid/meetings
routes.route('/:utorId/meetings').all(function(req, res, next) {
	// var prelimStatus = permissionCheck(req, false);
	// if (prelimStatus != 200) {
	// 	res.status(prelimStatus).json(errorObject(prelimStatus));
	// }
	next();
}).get(function(req, res) {
	const respond = (meetings) => {
		res.status(200).json({meetings: meetings});
	};

	User.getMeetings({utorId: req.params.utorId})
	.then(respond)
	.catch((err) => {res.status(400).json(errorObject(400))})
});

// API /users/:utorid/meetings/:meetingId
routes.route('/:utorId/meetings/:meetingId').all(function(req, res, next) {
	// var prelimStatus = permissionCheck(req, false);
	// if (prelimStatus === 200) {
	// 	res.status(prelimStatus).json(errorObject(prelimStatus));
	// }
	next();
}).get(function(req, res) {
	const find = (user) => {
		if (user) {
			for (let i = 0; i < user.meetings.length; i++) {
				if (mongoose.Types.ObjectId(req.params.meetingId).equals(user.meetings[i])) {
					return Meeting.getMeeting({_id: mongoose.Types.ObjectId(req.params.meetingId)});
				}
			}
		}

		return Promise.resolve(false);
	};

	const respond = (meeting) => {
		if (meeting) {
			res.status(200).json({meeting: meeting});
		} else {
			res.status(404).json(errorObject(404));
		}
	};

	User.getUser({utorId: req.params.utorId})
	.then(find)
	.then(respond)
	.catch((err) => {res.status(400).json(errorObject(400))});
}).put(function(req, res) {
	if (req.body.note === undefined) {
		return res.status(400).json(errorObject(400));
	}

	const find = (user) => {
		if (user) {
			for (let i = 0; i < user.meetings.length; i++) {
				if (mongoose.Types.ObjectId(req.params.meetingId).equals(user.meetings[i])) {
					return Meeting.updateNote({_id: mongoose.Types.ObjectId(user.meetings[i])}, req.body.note);
				}
			}
			return Promise.resolve(false);
		} else {
			return Promise.resolve(false);
		}
	};

	const response = (meeting) => {
		if (meeting) {
			res.status(200).json({meeting: meeting});
		} else {
			res.status(404).json(errorObject(404));
		}
	};

	User.getUser({utorId: req.params.utorId})
	.then(find)
	.then(response)
	.catch((err) => {res.status(400).json(errorObject(400))});
}).delete(function(req, res) {
	const deletion = (userId) => {
		if (userId) {
			return Meeting.deleteAttendee({_id: mongoose.Types.ObjectId(req.params.meetingId)}, mongoose.Types.ObjectId(userId));
		} else {
			return Promise.resolve(false);
		}
	};

	let interval;
	let meetingId;
	const verifyUser = (success) => {
		if (success === true) {
			return Promise.resolve(true);
		} else if (success) {
			return User.deleteMeeting({utorId: success.host}, mongoose.Types.ObjectId(req.params.meetingId));
		} else {
			return Promise.resolve(false);
		}
	};

	const verifyAvailability = (meeting) => {
		if (meeting.attendees.length === 0) {
			let availabilityId = mongoose.Types.ObjectId(meeting.referring_block);
			meetingId = mongoose.Types.ObjectId(meeting._id);
			return Availability.deleteMeeting({_id: availabilityId}, mongoose.Types.ObjectId(meeting._id), meeting.interval);
		} else if (meeting) {
			return Promise.resolve(true);
		} else {
			return Promise.resolve(false);
		}
	}

	const respond = (success) => {
		if (success) {
			res.status(200).json(errorObject(200));
		} else {
			res.status(404).json(errorObject(404));
		}
	};

	User.deleteMeeting({utorId: req.params.utorId}, mongoose.Types.ObjectId(req.params.meetingId))
	.then(deletion)
	.then(verifyAvailability)
	.then(verifyUser)
	.then(respond)
	.catch((err) => {res.status(400).json(errorObject(400))});
});

// API /users/:utorid/courses
routes.route('/:utorId/courses').all(function(req, res, next) {
	// var prelimStatus = permissionCheck(req, false);
	// if (prelimStatus != 200) {
	// 	res.status(prelimStatus).json(errorObject(prelimStatus));
	// }
	next();
}).get(function(req, res) {
	const respond = (courses) => {
		res.status(200).json({courses: courses});
	};

	User.getCourses({utorId: req.params.utorId})
	.then(respond)
	.catch((err) => {res.status(400).json(errorObject(400))});
});

// API /users/:utorid/courses/:courseCode
routes.route('/:utorId/courses/:courseCode').all(function(req, res, next) {
	// var prelimStatus = permissionCheck(req, false);
	// if (prelimStatus != 200) {
	// 	res.status(prelimStatus).json(errorObject(prelimStatus));
	// }
	next();
}).get(function(req, res) {
	const respond = (courses) => {
		if (courses) {
			for (let i = 0; i < courses.length; i++) {
				if (courses[i].courseCode === req.params.courseCode) {
					return res.status(200).json({course: courses[i]});
				}
			}
			res.status(404).json(errorObject(404));
		} else {
			res.status(404).json(errorObject(404));
		}
	};

	User.getCourses({utorId: req.params.utorId})
	.then(respond)
	.catch((err) => {res.status(400).json(errorObject(400))});
});

module.exports = routes;
