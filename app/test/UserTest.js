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
class Meeting{
  /*
   * this.id(num): id of this meeting
   * this.host(string): id of this meeting's User host in string form
   * this.courseCode(string): course code for this meeting
   * this.attendees([string]): list of stringify ids for the Users that atttend
   * this.location(string): location of this meeting
   * this.duration(num): duration of this meeting
   * this.note(string): note for the instructor
   */
  constructor(id,host,courseCode,attendees,location,duration,note){
    this.id = id;
    this.host = host;
    this.courseCode = courseCode;
    this.attendees = [... attendees];
    this.location = location;
    this.duration = duration;
    this.note = note;
  }
  /*
   * Add an new attendee to this meeting
   */
  addAttendee(attendee){
    this.attendees.push(attendee);

  }
  /*
   * Remove an attendee from this meeting
   */
  removeAttendee(attendeeID){
    this.attendees = this.attendees.filter(
      (attendee) => {
        return attendee !== attendeeID;
      }
    )
  }
  /*
   * Set this.location to location
   */
  changeLocation(location){
    this.location = location;
  }
  /*
   * Set this.duration to duration
   */
  changeDuration(duration){
    this.duration = duration;
  }
  /*
   * Set this.note to note
   */
  changeNote(note){
    this.note = note;
  }
}
class Availiability{
  /*
   * startTime(date) : starting time of this availiable period
   * duration(num): duration of availiable period
   * interval(num): meeting interval for this period
   * preferences(obj): preferences
   * preferences.repeats(boolean): whether this availiability period is repeated
   * preferences.repetition(num): how many time this period repeats
   */
  constructor(startTime, duration, interval, preferences){
    this.startTime = startTime;
    this.duration = duration;
    this.interval = interval;
    this.preferences = preferences;
  }
  /*
   * Changes this.startTime to startTime
   */
  changeStartTime(startTime){
    this.startTime = startTime;
  }
  /*
   * Changes this.duration to duration
   */
  changeDuration(duration){
    this.duration = duration
  }
  /*
   * Change this.preferences to newPreferences
   */
  changePreferences(newPreferences){
    this.preferences = newPreferences;
  }
  /*
   * Set this.availiability to availiability
   */
  changeInterval(interval){
    this.interval = interval;
  }
}
var assert = require('assert');
describe('User', function() {
  describe('#constructor', function() {
    it('should create a new User object with all the attributes', function() {
      const user = new User(1,"Bob","Bob@Bob.com",false,[],"",[]);
      assert.deepEqual(user.id, 1);
      assert.deepEqual(user.name, "Bob");
      assert.deepEqual(user.email, "Bob@Bob.com");
      assert.deepEqual(user.isInstructor, false);
      assert.deepEqual(user.preferences, "");
      assert.deepEqual(user.meetings, []);
      assert.deepEqual(user.availiability, []);
    });
  });
  describe('#addMeeting', function() {
    it('should add a new meeting', function() {
      const user = new User(1,"Bob","Bob@Bob.com",false,[],"",[]);
      let meeting = new Meeting(1,"1","CSC108",["2"],"BA1000",10,"hi");
      user.addMeeting(meeting);
      assert.deepEqual(user.meetings, [meeting]);
    });
  });
  describe('#deleteMeeting', function() {
    it('should add a new meeting', function() {
      const user = new User(1,"Bob","Bob@Bob.com",false,[],"",[]);
      let meeting = new Meeting(1,"1","CSC108",["2"],"BA1000",10,"hi");
      user.addMeeting(meeting);
      user.deleteMeeting(1)
      assert.deepEqual(user.meetings, []);
    });
  });
  describe('changePreferences', function() {
    it('should change preferences', function() {
      const user = new User(1,"Bob","Bob@Bob.com",false,[],"",[]);
      user.changePreferences("123")
      assert.deepEqual(user.preferences, "123");
    });
  });
  describe('changeAvailiability', function() {
    it('should change availiability', function() {
      const user = new User(1,"Bob","Bob@Bob.com",false,[],"",[]);
      let date = new Date();
      let obj = {repeats:true,
                 repetition: 2};
      const availiable = new Availiability(date,10,10,obj);
      user.changeAvailiability(availiable);
      assert.deepEqual(user.availiability, availiable);
    });
  });
});
