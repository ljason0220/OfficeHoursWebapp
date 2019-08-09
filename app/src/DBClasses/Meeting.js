class Meeting{

/*  id is string for meeting id
  attendees is a list of string of student ids (user ids)
  interval is a reference to which meeting spot of the availability block this meeting refers to
  referring_block is a string of availability id
  note is a string*/

  constructor(id, attendees, interval, referring_block, note){
    this.id = id;
    this.attendees = attendees;
    this.interval = interval;
    this.referring_block = referring_block;
    this.note = note;
  }
}
export default Meeting;
