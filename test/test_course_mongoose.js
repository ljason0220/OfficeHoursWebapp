// Tutorials that I visited in making this: 
// https://medium.com/nongaap/beginners-guide-to-writing-mongodb-mongoose-unit-tests-using-mocha-chai-ab5bdf3d3b1d
// https://codeutopia.net/blog/2016/06/10/mongoose-models-and-unit-tests-the-definitive-guide/

var assert = require('assert');
var expect = require('chai').expect;
var Course = require('../src/js/db/course');

describe('Test mongoose schema for Course', () => {
    describe('Save to course', () => {
        it('Should not save a course without courseCode', (done) => {
            var newCourse = new Course({
                // courseCode: 'CSC302',
                instructors: ['Daewoo']
            });
            newCourse.validate((err) => {
                expect(err.errors.courseCode).to.exist;
                done();
            });
        });

        // it('Should not save a course without instructors', (done) => {
        //     var newCourse = new Course({
        //         courseCode: 'CSC302',
        //         // instructors: ['Daewoo']
        //     });
        //     newCourse.validate((err) => {
        //         expect(err.errors.instructors).to.exist;
        //         done();
        //     });
        // });

        it('Should save a course with all required parameters', (done) => {
            var newCourse = new Course({
                courseCode: 'CSC302',
                instructors: ['Daewoo']
            });
            newCourse.validate((err) => {
                expect(err).to.be.a('null', 'An error was thrown');
                done();
            });
        });
    });
});