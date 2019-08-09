// Tutorial that I visited in making this:
// https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai

var mongoose = require('mongoose');
var User = require('../src/js/db/user');

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/js/server.js');
var app = server.app;
var httpServer = server.httpServer;
var should = chai.should();

chai.use(chaiHttp);

describe('APIs for User', () => {
    describe('/POST signup', () => {
        // Empty database before each test.
        beforeEach((done) => {
            User.remove({}, (err) => {
                done();
            });
        });

        it('Should create a new user', (done) => {
            const user = new User({
                id: 0,
                name: 'Daewoo Kang',
                email: 'HelloWorld@example.ca',
                password: "This isn't hashed",
                isInstructor: true
            });

            chai.request(app).post('/user/signup').send(user).end((err, res) => {
                res.should.have.status(200);

                res.body.should.be.a('object');
                res.body.should.have.property('id').eql(user.id);
                res.body.should.have.property('name').eql(user.name);
                res.body.should.have.property('email').eql(user.email);
                res.body.should.have.property('isInstructor').eql(user.isInstructor);

                res.body.should.not.have.property('password');

                done();
            });
        });

        it('Should not create a new user without id', (done) => {
            var user = {
                // id: 0,
                name: 'Daewoo Kang',
                email: 'HelloWorld@example.ca',
                password: "This isn't hashed",
                isInstructor: true
            };
            chai.request(app).post('/user/signup').send(user).end((err, res) => {
                res.should.have.status(400);

                done();
            });
        });

        it('Should not create a new user without name', (done) => {
            var user = {
                id: 0,
                // name: 'Daewoo Kang',
                email: 'HelloWorld@example.ca',
                password: "This isn't hashed",
                isInstructor: true
            };
            chai.request(app).post('/user/signup').send(user).end((err, res) => {
                res.should.have.status(400);

                done();
            });
        });

        it('Should not create a new user without email', (done) => {
            var user = {
                id: 0,
                name: 'Daewoo Kang',
                // email: 'HelloWorld@example.ca',
                password: "This isn't hashed",
                isInstructor: true
            };
            chai.request(app).post('/user/signup').send(user).end((err, res) => {
                res.should.have.status(400);

                done();
            });
        });

        it('Should not create a new user without password', (done) => {
            var user = {
                id: 0,
                name: 'Daewoo Kang',
                email: 'HelloWorld@example.ca',
                // password: "This isn't hashed",
                isInstructor: true
            };
            chai.request(app).post('/user/signup').send(user).end((err, res) => {
                res.should.have.status(400);

                done();
            });
        });

        it('Should not create a new user without isInstructor', (done) => {
            var user = {
                id: 0,
                name: 'Daewoo Kang',
                email: 'HelloWorld@example.ca',
                password: "This isn't hashed",
                // isInstructor: true
            };
            chai.request(app).post('/user/signup').send(user).end((err, res) => {
                res.should.have.status(400);

                done();
            });
        });

        it('Should not create a duplicate user', (done) => {
            var user = {
                id: 0,
                name: 'Daewoo Kang',
                email: 'HelloWorld@example.ca',
                password: "This isn't hashed",
                isInstructor: true
            };
            chai.request(app).post('/user/signup').send(user).end((err, res) => {
                chai.request(app).post('/user/signup').send(user).end((err, res) => {
                    res.should.have.status(400);

                    done();
                });
            });
        });
    });

    describe('Post /user/{userId}/update', () => {
        const user = {
            id: 0,
            name: 'Daewoo Kang',
            email: 'HelloWorld@example.ca',
            password: "This isn't hashed",
            isInstructor: true
        };

        // Add a user to update in each test.
        beforeEach((done) => {
            var newUser = new User(user);
            User.remove({}, (err) => {
                newUser.save((err) => {
                    done();
                });
            });
        });

        it("Should update user's name and others unchanged", (done) => {
            var updateInfo = {
                name: 'Kang, Daewoo'
            };
            chai.request(app).post('/user/0/update').send(updateInfo).end((err, res) => {
                res.should.have.status(200);
                res.should.have.be.a('object');

                res.body.should.have.property('id').eql(user.id);
                res.body.should.have.property('name').eql(updateInfo.name);
                res.body.should.have.property('email').eql(user.email);
                res.body.should.have.property('isInstructor').eql(user.isInstructor);

                res.body.should.not.have.property('password');

                done();
            });
        });

        it("Should update user's email and others unchanged", (done) => {
            var updateInfo = {
                email: 'WorldHello@example.com'
            };
            chai.request(app).post('/user/0/update').send(updateInfo).end((err, res) => {
                res.should.have.status(200);
                res.should.have.be.a('object');

                res.body.should.have.property('id').eql(user.id);
                res.body.should.have.property('name').eql(user.name);
                res.body.should.have.property('email').eql(updateInfo.email);
                res.body.should.have.property('isInstructor').eql(user.isInstructor);

                res.body.should.not.have.property('password');

                done();
            });
        });

        it("Should update user's name and email and others unchanged", (done) => {
            var updateInfo = {
                name: 'Kang, Daewoo',
                email: 'WorldHello@example.com'
            };
            chai.request(app).post('/user/0/update').send(updateInfo).end((err, res) => {
                res.should.have.status(200);
                res.should.have.be.a('object');

                res.body.should.have.property('id').eql(user.id);
                res.body.should.have.property('name').eql(updateInfo.name);
                res.body.should.have.property('email').eql(updateInfo.email);
                res.body.should.have.property('isInstructor').eql(user.isInstructor);

                res.body.should.not.have.property('password');

                done();
            });
        });

        it("Should not update user's id", (done) => {
            var updateInfo = {
                id: 'Kang, Daewoo'
            };
            chai.request(app).post('/user/0/update').send(updateInfo).end((err, res) => {
                res.should.have.status(400);

                done();
            });
        });

        it("Should not update user's isInstructor", (done) => {
            var updateInfo = {
                isInstructor: false
            };
            chai.request(app).post('/user/0/update').send(updateInfo).end((err, res) => {
                res.should.have.status(400);

                done();
            });
        });

        it("Should not update user's password", (done) => {
            var updateInfo = {
                password: 'just for now'
            };
            chai.request(app).post('/user/0/update').send(updateInfo).end((err, res) => {
                res.should.have.status(400);

                done();
            });
        });
    });

    // Close connection.
    after((done) => {
        mongoose.connection.close();
        httpServer.close();
        done();
    });
});