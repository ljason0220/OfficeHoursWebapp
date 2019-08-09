var routes = require('express').Router({mergeParams: true});
var mongoose = require('mongoose');
var models = require("../db").models;
const User = models.user;
const Course = models.course;
const Availability = models.availability;

var convertStringToArray = function(str) {
	let result = []
	let start = -1;
	let seenStart = false;
	for (let i = 0; i < str.length; i++) {
		if ((str[i] == "'" || str[i] == '"') && seenStart) {
			if (i - start > 0) {
				result.push(str.substring(start, i));
				seenStart = false;
			}
		} else if (str[i] == "'" || str[i] == '"') {
			seenStart = true;
			start = i + 1;
		}
	}
	return result;
}

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
	if (req.session.user === undefined) { // user not logged in
		return 401;
	} else if (req.session.isInstructor != "true" && priviledge) { // user needs instructor priviledges but doesn't have it
		return 403;
	} else {
		return 200;
	}
};

// API /courses/course
routes.post('/course', function(req, res, next) {
	// var prelimStatus = permissionCheck(req, true);
	// if (prelimStatus != 200) {
	// 	res.status(prelimStatus).json(errorObject(prelimStatus));
	// }
	next();
}, function(req, res) {
	console.log(req.body);
	if (req.body.courseCode === undefined) {
		return res.status(400).json(errorObject(400));
	} else if (req.body.instructors === undefined) {
		return res.status(400).json(errorObject(400));
	} else if (req.body.students === undefined) {
		return res.status(400).json(errorObject(400));
	}

	let instructorsUtorId = convertStringToArray(req.body.instructors);
	let studentsUtorId = convertStringToArray(req.body.students);

	let studentsArray = [];
	const getStudents = (students) => {
		if (students.length !== studentsUtorId.length) {
			return Promise.resolve(false);
		}

		for (let i = 0; i < students.length; i++) {
			if (students[i].isInstructor) {
				return Promise.resolve(false);
			}
			studentsArray.push(mongoose.Types.ObjectId(students[i]._id));
		}
		return User.getUsers({utorId: {$in: instructorsUtorId}});
	}

	const create = (instructors) => {
		if (instructors.length !== instructorsUtorId.length) {
			return Promise.resolve(false);
		}

		let courseQuery = {};
		courseQuery.courseCode = req.body.courseCode;
		courseQuery.students = studentsArray;
		courseQuery.instructors = [];
		for (let i = 0; i < instructors.length; i++) {
			if (instructors[i].isInstructor == false) {
				return Promise.resolve(false);
			}
			courseQuery.instructors.push(mongoose.Types.ObjectId(instructors[i]._id));
		}

		return Course.createCourse(courseQuery);
	};

	let newCourse;
	const updateUser = (course) => {
		if (course) {
			newCourse = course;
			return User.addCourse({utorId: {$in: instructorsUtorId}}, {$push: {courses: mongoose.Types.ObjectId(course._id)}})
		} else {
			return Promise.resolve(false);
		}
	};

	User.getUsers({utorId: {$in: studentsUtorId}})
	.then(getStudents)
	.then(create)
	.then(updateUser)
	.then((users) => {
		if (users) {
			res.status(200).json({course: newCourse});
		} else {
			res.status(404).json(errorObject(404));
		}
	}).catch((err) => {res.status(400).json(errorObject(400))});
});

// API /courses/:courseCode/students
routes.route('/:courseCode/students').all(function(req, res, next) {
	// var prelimStatus = permissionCheck(req, false);
	// if (prelimStatus === 200) {
	// 	res.status(prelimStatus).json(errorObject(prelimStatus));
	// }
	next();
}).get(function(req, res) {
	Course.getStudents({courseCode: req.params.courseCode})
	.then((students) => {
		res.status(200).json({students: students});
	})
	.catch((err) => {
		res.status(400).json(errorObject(400));
	});
}).put(function(req, res) {
	console.log(req.body)
	const add = (user) => {
		if (user) {
			if (user.isInstructor) {
				return Promise.resolve(false);
			} else {
				return Course.addStudent({courseCode: req.params.courseCode}, mongoose.Types.ObjectId(user._id));
			}
		} else {
			return Promise.resolve(false);
		}
	};

	const respond = (students) => {
		if (students) {
			res.status(200).json({students: students});
		} else {
			res.status(404).json(errorObject(404));
		}
	};

	User.getUser({utorId: req.body.utorId})
	.then(add)
	.then(respond)
	.catch((err) => {
		res.status(400).json(errorObject(400));
	});
}).delete(function(req, res) {
	const deletion = (user) => {
		if (user) {
			return Course.deleteStudent({courseCode: req.params.courseCode}, mongoose.Types.ObjectId(user._id));
		} else {
			return Promise.resolve(false);
		}
	};

	const respond = (students) => {
		if (students) {
			res.status(200).json({students: students});
		} else {
			res.status(404).json(errorObject(404));
		}
	};

	User.getUser({utorId: req.body.utorId})
	.then(deletion)
	.then(respond)
	.catch((err) => {
		res.status(400).json(errorObject(400));
	});
});

// API /courses/:courseCode/instructors
routes.route('/:courseCode/instructors').all(function(req, res, next) {
	// var prelimStatus = permissionCheck(req, false);
	// if (prelimStatus === 200) {
	// 	res.status(prelimStatus).json(errorObject(prelimStatus));
	// }
	next();
}).get(function(req, res) {
	Course.getInstructors({courseCode: req.params.courseCode})
	.then((instructors) => {
		if (instructors) {
			res.status(200).json({instructors: instructors});
		} else {
			res.status(404).json(errorObject(404));
		}
	})
	.catch((err) => {
		res.status(400).json(errorObject(400));
	});
});

// API /courses/:courseCode/availabilities
routes.route('/:courseCode/availabilities').all(function(req, res, next) {
	// var prelimStatus = permissionCheck(req, false);
	// if (prelimStatus === 200) {
	// 	res.status(prelimStatus).json(errorObject(prelimStatus));
	// }
	next();
}).get(function(req, res, next) {
	Course.getAvailabilities({courseCode: req.params.courseCode})
	.then((availabilities) => {
		if (availabilities) {
			res.status(200).json({availabilities: availabilities});
		} else {
			res.status(404).json(errorObject(404));
		}
	})
	.catch((err) => {
		res.status(400).json(errorObject(400));
	});
});

// API /courses/:courseCode/availabilities/:availabilityId
routes.route('/:courseCode/availabilities/:availabilityId').all(function(req, res, next) {
	// var prelimStatus = permissionCheck(req, false);
	// if (prelimStatus === 200) {
	// 	res.status(prelimStatus).json(errorObject(prelimStatus));
	// }
	next();
}).get(function(req, res) {
	const verify = (availability) => {
		if (availability) {
			if (availability.courseCode == req.params.courseCode) {
				let toSend = errorObject(200);
				toSend.availability = availability;
				return res.status(200).json(toSend);
			}
		}
		res.status(404).json(errorObject(404));
	};

	Availability.getAvailability({_id: mongoose.Types.ObjectId(req.params.availabilityId)})
	.then(verify)
	.catch((err) => {
		res.status(400).json(errorObject(400));
	});
});

module.exports = routes;
