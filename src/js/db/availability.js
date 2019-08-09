const mongoose = require('mongoose');

var availabilitySchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    startTime: {type: Date, required: true},
    endTime: {type: Date, required: true},
    meeting_length: {type: Number, required: true},
    preferences: {
        repeats: Boolean,
        repetition: Number
    },
    host: {type: String, required: true},
    location: {type: String, required: true},
    courseCode: {type: String, required: true},
    booked: [Boolean],
    meetings: [{type: mongoose.Schema.Types.ObjectId, ref: 'Meeting'}]
});

availabilitySchema.statics.deleteMeeting = function(searchQuery, id, interval) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery, (err, availability) => {
            if (err) throw new Error('An error occurred');

            if (!availability) {
                return resolve(false);
            }

            for (let i = 0; i < availability.meetings.length; i++) {
                if (id.equals(availability.meetings[i])) {
                    availability.meetings.splice(i, 1);
                    availability.booked[interval] = false;
                    availability.markModified('booked');
                    return availability.save((err, availability) => {
                        if (err) throw new Error('An error occurred');

                        resolve(availability);
                    });
                }
            }
            resolve(false);
        });
    });
    return promise;
};

availabilitySchema.statics.deleteAvailability = function(searchQuery) {
    const promise = new Promise((resolve, reject) => {
        this.deleteOne(searchQuery, (err) => {
            if (err) throw new Error('An error occurred');

            resolve(true);
        });
    });
    return promise;
};

availabilitySchema.statics.updateAvailability = function(searchQuery, updateQuery) {
    const promise = new Promise((resolve, reject) => {
        this.findOneAndUpdate(searchQuery, {$set: updateQuery}, {'new': true},
            (err, availability) => {
                if (err) throw new Error('An error occurred');

                resolve(availability);
            }
        );
    });
    return promise;
};

availabilitySchema.statics.addMeeting = function(searchQuery, id) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery, (err, availability) => {
            if (err) throw new Error('An error occurred.');

            if (availability) {
                availability.meetings.push(id);
                availability.save((err, availability) => {
                    if (err) throw new Error('An erorr occurred');

                    resolve(true);
                });
            } else {
                resolve(false);
            }
        });
    });
    return promise;
}

availabilitySchema.statics.getAvailability = function(searchQuery) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery).populate('meetings')
        .exec((err, availability) => {
            if (err) {
                throw new Error('An error occurred');
            }
            resolve(availability);
        });
    });
    return promise;
};

availabilitySchema.statics.bookMeeting = function(searchQuery, interval) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery, (err, availability) => {
            if (err) throw new Error('An error occurred');

            if (availability) {
                if (0 <= interval && interval < availability.booked.length && !availability.booked[interval]) {
                    availability.booked[interval] = true;
                    availability.markModified('booked');
                    return availability.save((err, availability) => {
                        if (err) throw new Error('An error occurred');

                        resolve(availability);
                    });
                }
            } 
            resolve(false);
        });
    });
    return promise;
};

availabilitySchema.statics.createAvailability = function(availabilityQuery) {
    const newAvailability = new this(availabilityQuery);
    return newAvailability.save();
};

var availability = mongoose.model('Availability', availabilitySchema);
module.exports = availability;