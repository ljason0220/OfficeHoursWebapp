class Course{

/*  courseCode is a string
  sections is a list of string of course ref id
  instructors is a list of string of user ref id
  student is a list of string of user ref id
  availabilties is a list of string of availability ref id*/

  constructor(courseCode, instructors, students, availabilities){
    this.courseCode = courseCode;
    this.instructors = instructors;
    this.students = students;
    this.availabilities = availabilities
  }
}
export default Course;
