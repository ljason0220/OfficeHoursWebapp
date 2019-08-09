class User{

/*  utorid is a string
  name is a string
  email is a string
  isInstructor is a boolean value
  coruses is a list of string of course ref id
  meeting is a list of s tring of meetings ref id
  availability is a list of availability ref id*/

  constructor(utorid, name, email,isInstructor, courses, meetings, availability){
    this.utorid = utorid;
    this.name = name;
    this.email = email;
    this.isInstructor = isInstructor;
    this.courses = courses;
    this.meetings = meetings;
    this.availability = availability;
  }
}
export default User;
