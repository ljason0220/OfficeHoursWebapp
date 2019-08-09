// Tutorials that I visited in making this: 
// https://medium.com/nongaap/beginners-guide-to-writing-mongodb-mongoose-unit-tests-using-mocha-chai-ab5bdf3d3b1d
// https://codeutopia.net/blog/2016/06/10/mongoose-models-and-unit-tests-the-definitive-guide/

var assert = require('assert');
var expect = require('chai').expect;
var Meeting = require('../src/js/db/meeting');

describe('Test mongoose schema for Meeting', () => {
    describe('Save to meeting', () => {
        it('Should not save a new meeting without courseCode', (done) => {
            var newMeeting = new Meeting({
                // courseCode: 'CSC302',
                location: 'Parliament',
                startTime: new Date()
            });
            newMeeting.validate((err) => {
                expect(err.errors.courseCode).to.exist;
                done();
            });
        });

        it('Should not save a new meeting without location', (done) => {
            var newMeeting = new Meeting({
                courseCode: 'CSC302',
                // location: 'Parliament',
                startTime: new Date()
            });
            newMeeting.validate((err) => {
                expect(err.errors.location).to.exist;
                done();
            });
        });

        it('Should not save a new meeting without startTime', (done) => {
            var newMeeting = new Meeting({
                courseCode: 'CSC302',
                location: 'Parliament',
                // startTime: new Date()
            });
            newMeeting.validate((err) => {
                expect(err.errors.startTime).to.exist;
                done();
            });
        });

        it('Should save a new meeting with all required parameters', (done) => {
            var newMeeting = new Meeting({
                courseCode: 'CSC302',
                location: 'Parliament',
                startTime: new Date()
            });
            newMeeting.validate((err) => {
                expect(err).to.be.a('null', 'An error was thrown');
                done();
            });
        });
    });
});