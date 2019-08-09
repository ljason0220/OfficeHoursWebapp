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

var assert = require('assert');
describe('Meeting', function() {
  describe('#constructor', function() {
    it('should create a new Meeting object with all the attributes', function() {
      const meeting = new Meeting(1,"1","CSC108",["2"],"BA1000",10,"hi");
      assert.deepEqual(meeting.id, 1);
      assert.deepEqual(meeting.host, "1");
      assert.deepEqual(meeting.courseCode, "CSC108");
      assert.deepEqual(meeting.attendees, ["2"]);
      assert.deepEqual(meeting.location, "BA1000");
      assert.deepEqual(meeting.duration, 10);
      assert.deepEqual(meeting.note, "hi");
    });
  });
  describe('#addAttendee', function() {
    it('should add attendee to attendee list', function() {
      let meeting = new Meeting(1,"1","CSC108",["2"],"BA1000",10,"hi");
      meeting.addAttendee("3");
      assert.deepEqual(meeting.attendees, ["2","3"]);
    });
  });
  describe('#removeAttendee', function() {
    it('should remove attendee from attendee list', function() {
      let meeting = new Meeting(1,"1","CSC108",["2"],"BA1000",10,"hi");
      meeting.addAttendee("3");
      meeting.removeAttendee("3");
      assert.deepEqual(meeting.attendees, ["2"]);
    });
  });
  describe('#changeLocation', function() {
    it('should change the location', function() {
      let meeting = new Meeting(1,"1","CSC108",["2"],"BA1000",10,"hi");
      meeting.changeLocation("BA1001")
      assert.deepEqual(meeting.location, "BA1001");
    });
  });
  describe('#changeDuration', function() {
    it('should change the duration', function() {
      let meeting = new Meeting(1,"1","CSC108",["2"],"BA1000",10,"hi");
      meeting.changeDuration(15)
      assert.deepEqual(meeting.duration, 15);
    });
  });
  describe('#changeNote', function() {
    it('should change the note', function() {
      let meeting = new Meeting(1,"1","CSC108",["2"],"BA1000",10,"hi");
      meeting.changeNote("Hi Hi")
      assert.deepEqual(meeting.note, "Hi Hi");
    });
  });
});
