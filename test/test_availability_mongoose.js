// Tutorials that I visited in making this: 
// https://medium.com/nongaap/beginners-guide-to-writing-mongodb-mongoose-unit-tests-using-mocha-chai-ab5bdf3d3b1d
// https://codeutopia.net/blog/2016/06/10/mongoose-models-and-unit-tests-the-definitive-guide/

var assert = require('assert');
var expect = require('chai').expect;
var Availability = require('../src/js/db/availability');

describe('Test mongoose schema for Availability', () => {
    describe('Save to availability', () => {
        // Test save a new availability with no parameters.
        it('Should not save a new meeting without courseCode', (done) => {
            var newAvailability = new Availability({});
            newAvailability.validate((err) => {
                expect(err).to.be.a('null', 'An error was thrown');;
                done();
            });
        });
    });
});