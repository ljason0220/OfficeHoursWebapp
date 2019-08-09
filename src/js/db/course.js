const mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    courseCode: {type: String, unique: true, required: true},
    instructors: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    students: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    availabilities: [{type: mongoose.Schema.Types.ObjectId, ref: 'Availability'}],
});

courseSchema.statics.createCourse = function(courseQuery) {
    const newCourse = new this(courseQuery);
    return newCourse.save();
};

courseSchema.statics.getStudents = function(searchQuery) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery, 'students').populate('students')
        .exec((err, course) => {
            if (err) throw new Error('An error occurred.');

            if (!course) resolve([]);
            else resolve(course.students);
        });
    });
    return promise;
};

courseSchema.statics.addStudent = function(searchQuery, userId) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery, (err, course) => {
            if (err) throw new Error('An error occurred');
            if (!course) return resolve(false);

            for (let i = 0; i < course.students; i++) {
                if (userId.equals(course.students[i])) {
                    return resolve(false);
                }
            }

            course.students.push(userId);
            course.save((err) => {

                if (err) throw new Error('An error occurred');

                resolve(course.students);
            });
        });
    });
    return promise;
};

courseSchema.statics.deleteAvailability = function(searchQuery, id) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery, (err, course) => {
            if (err) throw new Error('An error occurred');

            if (!course) return resolve(false);
            
            for (let i = 0; i < course.availabilities.length; i++) {
                if (id.equals(course.availabilities[i])) {
                    course.availabilities.splice(i, 1);
                    return course.save((course) => {
                        resolve(true);
                    });
                }
            }
        
            resolve(false);
        });
    });
    return promise;
};

courseSchema.statics.deleteStudent = function(searchQuery, userId) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery, (err, course) => {
            if (err) throw new Error('An error occurred');

            if (!course) return resolve(false);
            
            for (let i = 0; i < course.students.length; i++) {
                if (userId.equals(course.students[i])) {
                    course.students.splice(i, 1);
                    return course.save((err, course) => {
                        if (err) throw new Error('An error occurred');
        
                        resolve(course.students);
                    });
                }
            }
        
            resolve(false);
        });
    });
    return promise;
};

courseSchema.statics.getAvailabilities = function(searchQuery) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery, 'availabilities').populate('availabilities')
        .exec((err, course) => {
            if (err) throw new Error('An error occurred.');

            if (!course) resolve(false);
            else resolve(course.availabilities);
        });
    });
    return promise;
};

// courseSchema.statics.addMeeting = function(searchQuery, id) {
//     const promise = new Promise((resolve, reject) => {
//         this.findOne(searchQuery, (err, course) => {
//             if (err) throw new Error('An error occurred');

//             if (course) {
//                 course.meetings.push(id);
//                 return course.save((err, course) => {
//                     if (err) throw new Error('An error occured');

//                     resolve(true);
//                 });
//             } else resolve(false);
//         });
//     });
//     return promise;
// };

courseSchema.statics.getInstructors = function(searchQuery) {
    const promise = new Promise ((resolve, reject) => {
        this.findOne(searchQuery, 'instructors').populate('instructors')
        .exec((err, course) => {
            if (err) throw new Error('An error occurred.');

            if (!course) resolve(false);
            else resolve(course.instructors);
        });
    });
    return promise;
};

courseSchema.statics.addAvailability = function(searchQuery, id) {
    const promise = new Promise((resolve, reject) => {
        this.findOne(searchQuery, (err, course) => {
            if (err) throw new Error('An error occurred');

            if (course) {
                course.availabilities.push(id);
                return course.save((err, course) => {
                    if (err) throw new Error('An error occurred');

                    resolve(course);
                });
            } else {
                resolve(false);
            }
        });
    });
    return promise;
};

var course = mongoose.model('Course', courseSchema);

module.exports = course;
