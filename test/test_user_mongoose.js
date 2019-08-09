// Tutorials that I visited in making this: 
// https://medium.com/nongaap/beginners-guide-to-writing-mongodb-mongoose-unit-tests-using-mocha-chai-ab5bdf3d3b1d
// https://codeutopia.net/blog/2016/06/10/mongoose-models-and-unit-tests-the-definitive-guide/

var assert = require('assert');
var expect = require('chai').expect;
var User = require('../src/js/db/user');

describe('Test mongoose schema for User', () => {
	describe('Save to user', () => {	
		it('Should not save a new user without isInstructor', (done) => {
			var newUser = new User({
				id: 0,
				name: 'Daewoo Kang',
				email: 'DaewooKang@UofT.ca',
				password: 'Surprisingly this is hashed'
				// isInstructor: true
			});
			newUser.validate((err) => {
				expect(err.errors.isInstructor).to.exist;
				done();
			});
		});
	
		it('Should not save a new user without password', (done) => {
			var newUser = new User({
				id: 0,
				name: 'Daewoo Kang',
				email: 'Daewookang@UofT.ca',
				// password: 'Surprisingly this is hashed',
				isInstructor: true
			});
			newUser.validate((err) => {
				expect(err.errors.password).to.exist;
				done();
			});
		});
	
		it('Should not save a new user without email', (done) => {
			var newUser = new User({
				id: 0,
				name: 'Daewoo kang',
				// email: 'Daewookang@UofT.ca',
				password: 'Surprisingly this is hashed',
				isInstructor: true
			});
			newUser.validate((err) => {
				expect(err.errors.email).to.exist;
				done();
			});
		});
	
		it('Should not save a new user without name', (done) => {
			var newUser = new User({
				// name: 'Daewoo kang',
				email: 'Daewookang@UofT.ca',
				password: 'Surprisingly this is hashed',
				isInstructor: true
			});
			newUser.validate((err) => {
				expect(err.errors.name).to.exist;
				done();
			});
		});

		it('Should save a new user with all required parameters', (done) => {
			var newUser = new User({
				name: 'Daewoo kang',
				email: 'Daewookang@UofT.ca',
				password: 'Surprisingly this is hashed',
				isInstructor: true
			});
			newUser.validate((err) =>{
				expect(err).to.be.a('null', 'An error was thrown');
				done();
			});
		});
	});
});