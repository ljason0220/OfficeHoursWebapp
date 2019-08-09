var routes = require('express').Router({mergeParams: true});
var models = require("../db").models;

// Function that takes status code and generates error object to return
var errorObject = function(status, errorType) {
	var retObj = {};
	var tStr;
	if (errorType === 400) {
		tStr = "Client has not provided sufficient data";
	} else if (errorType == 401) {
		tStr = "Client not logged in";
	} else if (errorType == 403) {
		tStr = "Client does not have access to resource";
	} else if (errorType == 404) {
		tStr = "Client is requesting a resource that doesn't exist";
	} else if (errorType == 405) {
		tStr = "Client does not have permission";
	} else {
        tStr = "Success";
    }
	retObj.message = tStr;
	return retObj;
};

routes.route('/login').post(function(req, res, next) {
    models.user.findOne({'utorId': req.body.utorId, 'password': req.body.password}, function(err, result) {
        if (err) {
            res.status(400).json(errorObject(400));
        } else {
            req.session.user = req.body.user;
            req.session.isInstructor = result.isInstructor;
            res.json(result);
        }
    });
});

routes.route('/logout').post(function(req, res, next) {
    req.session.destroy(function(err) {
        if (err) {
            res.status(403).send(errorObject(403));
        } else {
            res.status(200).send(errorObject(200));
        }
    });
});

module.exports = routes;