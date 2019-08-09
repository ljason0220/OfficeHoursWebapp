const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    utorId: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    isInstructor: {type: Boolean, required: true},
    meetings: [{type: mongoose.Schema.Types.ObjectId, ref: 'Meeting'}],
    courses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}],
    preferences: [String],
    availability: [{type: mongoose.Schema.Types.ObjectId, ref: 'Availability'}]
});


userSchema.statics.createUser = function(userQuery) {
    const newUser = new this(userQuery);
    return newUser.save();
};

userSchema.statics.updateUsers = function(searchQuery, updateQuery) {
    const promise = new Promise((resolve, reject) => {
        this.updateMany(searchQuery, updateQuery,
            (err, users) => {
                if (err) throw new Error('An error occurrd');

                resolve(users);
            }
        );
    });
    return promise;
};

userSchema.statics.getUsers = function(searchQuery) {
    const promise = new Promise((resolve, reject) => {
        this.find(searchQuery, (err, users) => {
            if (err) throw new Error('An error occurred');
            
            resolve(users);
        });
    });
    return promise;
};

userSchema.statics.getAvailabilities = function(searchQuery) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery, 'availability').populate('availability')
        .exec((err, user) => {
            if (err) throw new Error('An error occurred');

            if (user) resolve(user.availability);
            else resolve(false);
        })
    });
    return promise;
};

userSchema.statics.getMeetings = function(searchQuery) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery, 'meetings').populate('meetings')
        .exec((err, user) => {
            if (err) throw new Error('An error occurred');

            if (user) {
                resolve(user.meetings);
            } else {
                resolve(false);
            }
        });
    });
    return promise;
};

userSchema.statics.deleteMeeting = function(searchQuery, meetingId) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery, (err, user) => {
            if (err) throw new Error('An error occurred');

            if (!user) {
                return resolve(false);
            }

            for (let i = 0; i < user.meetings.length; i++) {
                if (meetingId.equals(user.meetings[i])) {
                    user.meetings.splice(i, 1);
                    return user.save((err, user) => {
                        if (err) throw new Error('An error occurred');

                        resolve(user._id);
                    });
                }
            }
            resolve(false);
        });
    });
    return promise;
};

userSchema.statics.deleteAvailability = function(searchQuery, id) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery, (err, user) => {
            if (err) throw new Error('An error occurred');

            if (!user) {
                return resolve(false);
            }

            for (let i = 0; i < user.availability.length; i++) {
                if (id.equals(user.availability[i])) {
                    user.availability.splice(i, 1);
                    return user.save((user) => {
                        return resolve(true);
                    });
                }
            }
            resolve(false);
        });
    });
    return promise;
};

userSchema.statics.getCourses = function(searchQuery) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery, 'courses').populate('courses')
        .exec((err, user) => {
            if (err) throw new Error('An error occurred');

            if (user) resolve(user.courses);
            else resolve(false);
        });
    });
    return promise;
};

userSchema.statics.addCourse = function(searchQuery, coursesQuery) {
    const promise = new Promise((resolve, reject) => {
        this.updateMany(searchQuery, coursesQuery, 
            (err, users) => {
                if (err) throw new Error('An erorr occurred');

                resolve(users);
            }
        );
    });
    return promise;
};

userSchema.methods.addMeeting = function(id) {
    this.meetings.push(id);
    return this.save();
};

userSchema.methods.deleteMeeting = function(id) {
    for (let i = 0; i < this.meetings.length; i++) {
        if (id.equals(this.meetings[i])) {
            this.meetings.splice(i, 1);
            return this.save();
        }
    }
    return Promise.resolve(false);
};

userSchema.statics.addMeeting = function(searchQuery, id) {
    const promise = new Promise((resolve, reject) => {
        this.find(searchQuery, (err, users) => {
            if (err) throw new Error('An error occurred');

            if (users) {
                if (users.length === 2) {
                    users[0].meetings.push(id);
                    users[1].meetings.push(id);
                    return users[0].save((err, user) => {
                        if (err) throw new Error('An error occurred');

                        users[1].save((err, user) => {
                            if (err) throw new Error('An erorr occurred');

                            return resolve(true);
                        });
                    });
                }
            }
            resolve(false);
        });
    });
    return promise;
};

userSchema.statics.deleteMeetings = function(searchQuery) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery, (err, user) => {
            if (err) throw new Error('An error occurred');

            if (!user) return resolve(false);
            
            const temp = user.meetings;
            user.meetings = [];
            user.save((err, user) => {
                if (err) throw new Error('An error occured');

                resolve(temp);
            });
        });
    });
    return promise;
};

userSchema.statics.getFullUser = function(searchQuery) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery).populate('availability').populate(
            {
                path: 'courses',
                populate: {
                    path: 'instructors',
                    model: 'User',
                    select: 'utorId'
                }
            }).populate('meetings')
        .exec( 
            (err, user) => {
                if (err) {
                    throw new Error('An error occurred');
                }
                resolve(user);
            }
        );
    });
    return promise;
};

userSchema.statics.getUser = function(searchQuery) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery, 
            (err, user) => {
                if (err) {
                    throw new Error('An error occurred');
                }
                resolve(user);
            }
        );
    });
    return promise;
};

userSchema.statics.updateUser = function(searchQuery, updateQuery) {
    const promise = new Promise((resolve, reject) => {
        this.findOneAndUpdate(searchQuery, {$set: updateQuery}, {'new': true}, 
            (err, user) => {
                if (err) throw new Error('An error occurred');

                resolve(user);
            }
        );
    });
    return promise;
}

userSchema.statics.addAvailability = function(searchQuery, id) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery, (err, user) => {
            if (err) throw new Error('An error occurred');

            if (user) {
                user.availability.push(id);
                user.save((err, user) => {
                    if (err) throw new Error('An error occurred');

                    resolve(true);
                });
            } else {
                resolve(false);
            }
        });
    });
    return promise;
};

var user = mongoose.model('User', userSchema);

module.exports = user;