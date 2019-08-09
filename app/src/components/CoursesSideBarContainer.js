import React, { Component } from "react";
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
import moment from "moment";
/*
Takes in a Course object and User object as props.
*/
class CoursesSideBarContainer extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  importClassList = (e) =>{
    e.preventDefault();

    const file = document.getElementById("fileSubmit").files[0];
    let course = this.props.course;
    let reader = new FileReader();
    reader.onload = function(e) {
      let content = e.target.result;
      const utoridList = parseInput(content);
      course.students = utoridList;
      const url = "/courses/" + course.courseCode +"/students";
      $.ajax({
          type: "put",
          url: url,
          data: JSON.stringify({utorId:utoridList}),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
      });
    };
    reader.readAsText(file);
    let courseList = this.props.childProps.getCoursesList();
    for (var i = 0; i < courseList.length; i++) {
      if(courseList[i].courseCode === course.courseCode){
        courseList[i] = course;
      }
    }
    this.props.childProps.setCoursesList(courseList);
    this.myRef.current.closePopup();
  }

  render() {
    if(this.props.user.isInstructor){
      return (
        <React.Fragment>
        <AccordionItem>
          <AccordionItemTitle>
            <h4 className=" u-position-relative u-margin-bottom-s">
              {this.props.course.courseCode}
              <div className="accordion__arrow" role="presentation" />
            </h4>
          </AccordionItemTitle>
          <AccordionItemBody>
            <button> Create Office Hour</button>
            <Popup
            ref = {this.myRef}
            trigger={<button> Import Class List </button>}
            modal>
              <div>
              <FormGroup>
                <Col smOffset={0} sm={10}>
                  <input type="file" id ="fileSubmit"/>
                  <Button type="submit" onClick = {(e) => {
                    e.preventDefault();
                    this.importClassList(e);
                  }}>Import Class List</Button>
                </Col>
              </FormGroup>
            </div>
            </Popup>
            <button> Generate Link</button>
          </AccordionItemBody>
        </AccordionItem>
        </React.Fragment>
      );
    }else{
      return(
        <AccordionItem>
          <AccordionItemTitle>
            <h4 className=" u-position-relative u-margin-bottom-s">
              {this.props.course.courseCode}
              <div className="accordion__arrow" role="presentation" />
            </h4>
          </AccordionItemTitle>
          <AccordionItemBody>
          </AccordionItemBody>
        </AccordionItem>
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
export default CoursesSideBarContainer;
