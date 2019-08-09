class Course{
  /*
   * courseCode(string) : courseCode for this course
   * insructors([Users]): list of instructor's userid
   * students([Users]): list of student's userid
   */
  constructor(courseCode, instructors, students){
    this.courseCode = courseCode;
    this.instructors = instructors;
    this.students = students;
  }
  /*
   * Changes this.startTime to startTime
   */
  changeCourseCode(courseCode){
    this.courseCode = courseCode;
  }
  /*
   * Add instructor to list
   */
  addInstructor(newInstructor){
    this.instructors.push(newInstructor);
  }
  /*
   * Remove Instructors from list
   */
  removeInstructor(id){
    this.instructors = this.instructors.filter(
      (instr) => {
        return instr.id !== id;
      }
    )
  }
  /*
   * Add student to list
   */
  addStudent(newStudent){
    this.students.push(newStudent);
  }
  /*
   * Remove Student from list
   */
  removeStudent(id){
    this.students = this.students.filter(
      (student) => {
        return student.id !== id;
      }
    )
  }
}
class User{
  /*
   * All users will have an ID,name,email,preferences and meetings list
   * Student users will have isInstructor set to false and will not have
     an availiability list.
   * isInstructor will have isInstructor set to true and will have an
     availiability list.
   * id(num) : id of this user
   * name(string): name of this user
   * email(string): email of this user
   * isInstructor(boolean): whether this user is an instructor
   * meetings([Meeting]): list of Meetings for this user
   * preferences(string): preferences for this user
   * availiability([Availiability]): for this user
   */
  constructor(id, name, email, isInstructor,
    meetings, preferences, availiability){

    this.id = id;
    this.name = name;
    this.email = email;
    this.isInstructor = isInstructor;
    this.meetings = meetings;
    this.preferences = preferences;
    this.availiability = availiability;
  }
  /*
   * Add meeting with id to this user's meeting list
   */
  addMeeting(meeting){
    this.meetings.push(meeting);
  }
  /*
   * Delete meeting with id from this user's meeting list
   */
  deleteMeeting(id){
    this.meetings = this.meetings.filter(
      (meeting) => {
        return meeting.id !== id;
      }
    )
  }
  /*
   * Set this.preferences to newPreferences
   */
  changePreferences(newPreferences){
    this.preferences = newPreferences;
  }
  /*
   * Set this.availiability to availiability
   */
  changeAvailiability(availiability){
    this.availiability = availiability;
  }
}
var assert = require('assert');
describe('Course', function() {
  describe('#constructor', function() {
    it('should create a new Course object with all the attributes', function() {
      const user = new User(1,"Bob","Bob@Bob.com",false,[],"",[]);
      const user2 = new User(2,"Bob2","Bob2@Bob.com",false,[],"",[]);
      const course = new Course("CSC108", [user], [user2]);
      assert.deepEqual(course.courseCode, "CSC108");
      assert.deepEqual(course.instructors, [user]);
      assert.deepEqual(course.students, [user2]);
    });
  });
  describe('#changeCourseCode', function() {
    it('should change courseCode', function() {
      const user = new User(1,"Bob","Bob@Bob.com",false,[],"",[]);
      const user2 = new User(2,"Bob2","Bob2@Bob.com",false,[],"",[]);
      const course = new Course("CSC108", [user], [user2]);
      course.changeCourseCode("CSC148");
      assert.deepEqual(course.courseCode, "CSC148");
    });
  });
  describe('#addInstructor', function() {
    it('should add a new instuctor', function() {
      const user = new User(1,"Bob","Bob@Bob.com",false,[],"",[]);
      const user2 = new User(2,"Bob2","Bob2@Bob.com",false,[],"",[]);
      const user3 = new User(3,"Bob3","Bob3@Bob.com",false,[],"",[]);
      const course = new Course("CSC108", [user], [user2]);
      course.addInstructor(user3);
      assert.deepEqual(course.instructors, [user,user3]);
    });
  });
  describe('#removeInstructor', function() {
    it('should remove instuctor', function() {
      const user = new User(1,"Bob","Bob@Bob.com",false,[],"",[]);
      const user2 = new User(2,"Bob2","Bob2@Bob.com",false,[],"",[]);
      const user3 = new User(3,"Bob3","Bob3@Bob.com",false,[],"",[]);
      const course = new Course("CSC108", [user], [user2]);
      course.addInstructor(user3);
      course.removeInstructor(3);
      assert.deepEqual(course.instructors, [user]);
    });
  });
  describe('addStudent', function() {
    it('should add student', function() {
      const user = new User(1,"Bob","Bob@Bob.com",false,[],"",[]);
      const user2 = new User(2,"Bob2","Bob2@Bob.com",false,[],"",[]);
      const user3 = new User(3,"Bob3","Bob3@Bob.com",false,[],"",[]);
      const course = new Course("CSC108", [user], [user2]);
      course.addStudent(user3);
      assert.deepEqual(course.students, [user2, user3]);
    });
  });
  describe('#removeStudent', function() {
    it('should remove student', function() {
      const user = new User(1,"Bob","Bob@Bob.com",false,[],"",[]);
      const user2 = new User(2,"Bob2","Bob2@Bob.com",false,[],"",[]);
      const user3 = new User(3,"Bob3","Bob3@Bob.com",false,[],"",[]);
      const course = new Course("CSC108", [user], [user2]);
      course.addStudent(user3);
      course.removeStudent(3);
      assert.deepEqual(course.students, [user2]);
    });
  });
});
