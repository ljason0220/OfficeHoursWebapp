class CourseSection{

/*    course is a ref id of course
    section is a string ie. L101
    instrucor is string of instructor name ie. Bob
    student is a list of user ref id
    lecture is a list of location, startTime, endTime*/

  constructor(course, section, instructor, students, lectures){
    this.course = course;
    this.section = section;
    this.instructor = instructor;
    this.students = students;
    this.lectures = lectures;
  }
}
export default CourseSection;
