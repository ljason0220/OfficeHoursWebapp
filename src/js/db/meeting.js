const mongoose = require('mongoose');

var meetingSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    interval: {type: Number, required: true},
    attendees: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    referring_block: {type: mongoose.Schema.Types.ObjectId, ref: 'Availability', required: true},
    note: String
});

meetingSchema.statics.generateMeeting = function(generateQuery) {
    const newMeeting = new this(generateQuery);
    return newMeeting.save();
};

meetingSchema.statics.updateAttendee = function(searchQuery, userId) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery, (err, meeting) => {
            if (err) {
                throw new Error(err.message);
            }

            if (meeting) {
                for (let i = 0; i < meeting.attendees.length; i++) {
                    if (userId.equals(meeting.attendees[i])) {
                        return resolve(false);
                    }
                }
                meeting.attendees.push(userId);
                meeting.save(
                    (err, meeting) => {
                        if (err) {
                            throw new Error('An error occurred.');
                        } else {
                            resolve(meeting);
                        }
                    }
                );
            } else {
                resolve(false);
            }
        });
    });
    return promise;
};

meetingSchema.statics.updateNote = function(searchQuery, note) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery, (err, meeting) => {
            if (err) throw new Error('An error occurred.');

            if (meeting) {
                meeting.note = note;
                meeting.save((err, meeting) => {
                    if (err) throw new Error('An error occurred.');

                    resolve(meeting);
                });
            } else {
                resolve(false);
            }
        });
    });
    return promise;
};

meetingSchema.statics.deleteMeetings = function(deleteQuery) {
    const promise = new Promise((resolve, reject) => {
        this.deleteMany(deleteQuery, (err) => {
            if (err) throw new Error('An error occurred');

            resolve(true);
        });
    });
    return promise;
};

meetingSchema.statics.getMeeting = function(searchQuery) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery, 
            (err, meeting) => {
                if (err) {
                    throw new Error('An error occurred.');
                }
                resolve(meeting);
            }
        );
    });
    return promise;
};

meetingSchema.statics.deleteAttendee = function(searchQuery, userId) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery,
            (err, meeting) => {
                if (err) {
                    throw new Error('An error occurred.');
                }
                
                if (meeting) {
                    for (let i = 0; i < meeting.attendees.length; i++) {
                        if (userId.equals(meeting.attendees[i])) {
                            meeting.attendees.splice(i, 1);
                            break;
                        }
                    }

                    if (meeting.attendees.length === 0) {
                        this.deleteOne(searchQuery, (err) => {
                            if (err) throw new Error('An error occurred');

                            resolve(meeting);
                        });
                    } else {
                        meeting.save(
                            (err, meeting) => {
                                if (err) {
                                    throw new Error('An error occurred.');
                                } else {
                                    resolve(meeting);
                                }
                            }
                        );
                    }
                } else {
                    resolve(false);
                }
            }
        );
    });
    return promise;
};

module.exports = mongoose.model('Meeting', meetingSchema);;