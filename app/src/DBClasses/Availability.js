class Availability{

/*    id is the availability id
    startTIme is type Date
    endTIme is type Date
    meeting_length is an integer ie. 10, 15, 20
    host is a professor id (user id)
    location is a string for a room name
    courseCode is a string
    booked is an array of boolean, with lower index booleans being earlier meetings (oth is first, 1th is second, ...)
    meeting is a list of meeting ids*/

  constructor(id, startTime, endTime, meeting_length, host, location, courseCode, booked, meetings){
    this.id = id;
    this.startTime = startTime;
    this.endTime = endTime;
    this.meeting_length = meeting_length;
    this.host = host;
    this.location = location;
    this.courseCode = courseCode;
    this.booked = booked;
    this.meetings = meetings;
  }
}
export default Availability;
