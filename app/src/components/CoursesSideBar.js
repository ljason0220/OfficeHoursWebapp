import React, { Component } from "react";
import CoursesSideBarContainer from "./CoursesSideBarContainer"
import Meeting from "../DBClasses/Meeting.js"
import User from "../DBClasses/User.js"
import Course from "../DBClasses/Course.js"
import Popup from 'reactjs-popup'
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/minimal-example.css';
import { Button,
         Form,
         FormGroup,
         ControlLabel,
         FormControl,
         Col,
         Checkbox
         } from 'react-bootstrap'
/*
This SideBar component takes in a list of Courses object and an User object as
props. The component will create a new SideBarContainer for each Course and
pass the appropriate props.
*/
class CoursesSideBar extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  createCourse = (e) =>{
    e.preventDefault();
    const courseCode = document.getElementById("courseCodeSubmit").value;
    let newCourse = new Course(courseCode,[this.props.childProps.getUser().utorid],[],[]);
    const course = {courseCode:courseCode,
                    instructors:[this.props.childProps.getUser().utorid]};
    console.log(JSON.stringify(newCourse));
    const file = document.getElementById("fileSubmit").files[0];

    let reader = new FileReader();
    reader.onload = function(e) {
      let content = e.target.result;
      const utoridList = parseInput(content);
      newCourse.students = utoridList;
      console.log(utoridList);
    };
    reader.readAsText(file);
    const url = "/courses/course";
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(newCourse),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
          const url2 = "/courses/" + newCourse.courseCode +"/students"
          $.ajax({
              type: "put",
              url: url2,
              data: JSON.stringify({utorId: newCourse.students}),
              contentType: "application/json; charset=utf-8",
              dataType: "json",
          })
        }
    });

    let courseList = this.props.childProps.getCoursesList();
    courseList.push(course)
    this.props.childProps.setCoursesList(courseList);
    this.myRef.current.closePopup();
  }

  render() {
    let rows = [];
    for (var i = 0; i < this.props.childProps.getCoursesList().length; i++) {
      rows.push(
        <CoursesSideBarContainer key={i} childProps = {this.props.childProps} course={this.props.childProps.getCoursesList()[i]} user={this.props.childProps.getUser()} />
      );
    }
    if(this.props.childProps.getUser() !== null && this.props.childProps.getUser().isInstructor){
      return (
          <React.Fragment>
          <Popup
          ref = {this.myRef}
          trigger={<button> Create Course </button>}
          modal>
            <div>
            <Form horizontal>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>
                Course Code
              </Col>
              <Col sm={10}>
                <FormControl type="courseCode" placeholder="Course Code" id="courseCodeSubmit" />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={0} sm={10}>
                <input type="file" id ="fileSubmit"/>
                <Button type="submit" onClick = {(e) => {
                  e.preventDefault();
                  this.createCourse(e);
                }}>Create Course</Button>
              </Col>
            </FormGroup>
            </Form>
          </div>
          </Popup>

          <Accordion>
            {rows}
          </Accordion>
          </React.Fragment>
      );
    }else{
      return (
          <React.Fragment>
          <h4> Courses </h4>
          <Accordion>
            {rows}
          </Accordion>
          </React.Fragment>
      );
    }
  }
}

function parseInput(content){
  let utoridList = [];
  const splitContent = content.split("\n");
  for (var i = 0; i < splitContent.length; i++) {
    const utorid = splitContent[i].split(",")[0];
    if(utorid.length > 0){
      utoridList.push(utorid);
    }
  }
  return utoridList;
}
export default CoursesSideBar
