import React, { Component } from "react";
import Meeting from "../DBClasses/Meeting.js";
import User from "../DBClasses/User.js";
import $ from 'jquery';
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';
import moment from "moment";
/*
Takes in a Meeting object and User object as props.
Will generate a div that shows the meeting time, location, attendees.
Will show Instructor name for User that aren't instructors
*/
export default class ReminderSideBarContainer extends Component {
  render() {
    let attendees = "";
    for (let i = 0; i < this.props.meeting.attendees.length; i++) {
     attendees = attendees + this.props.meeting.attendees[i].name + " ";
    }
    let endTime = moment(this.props.meeting.startTime).add(this.props.meeting.duration,"m").toDate();
    if(this.props.userProps.getUser().isInstructor){
      return (
        <AccordionItem>
          <AccordionItemTitle>
            <h4 className=" u-position-relative u-margin-bottom-s">
              {this.props.meeting.courseCode}
              <div className="accordion__arrow" role="presentation" />
            </h4>
          </AccordionItemTitle>
            <div className="block">
            {this.props.meeting.startTime.toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'})
            + " - " + endTime.toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'})}
            </div>
          <AccordionItemBody>
            <p className="SideBarContainerText">{this.props.meeting.location}</p>
            <p>Attendees: {attendees}</p>
            <p>{this.props.meeting.note}</p>
            <button onClick={(e)=>{
              cancelMeeting(e,this.props.meeting,this.props.userProps.getUser());
            }}>Cancel Meeting</button>
          </AccordionItemBody>
        </AccordionItem>
      );
    }else{
      return(
        <AccordionItem>
          <AccordionItemTitle>
            <h4 className=" u-position-relative u-margin-bottom-s">
              {this.props.meeting.courseCode}
              <div className="accordion__arrow" role="presentation" />
            </h4>
          </AccordionItemTitle>
            <div className="block">
            {this.props.meeting.startTime.toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'})
            + " - " + endTime.toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'})}
            </div>
          <AccordionItemBody>
            <p className="SideBarContainerText">{this.props.meeting.location}</p>
            <p>Instructor: {this.props.meeting.host.name}</p>
            <p>Attendees: {attendees}</p>
            <p>{this.props.meeting.note}</p>
            <button onClick={(e)=>{
              cancelMeeting(e,this.props.meeting,this.props.userProps.getUser());
            }}>Cancel Meeting</button>
          </AccordionItemBody>
        </AccordionItem>
      );
    }
  }
}
function cancelMeeting(e,meeting,user){
  console.log(user);
  if (user.isInstructor) {
    e.target.parentElement.parentElement.remove(e.target.parentElement);
    // TODO: Send HTTP request remove this meeting
    const url = "/meetings/" + meeting.id;
    $.ajax({
        type: "DELETE",
        url: url,
        data: [],
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    })
  }else{
    meeting.removeAttendee(this.props.user.id);
    e.target.parentElement.parentElement.remove(e.target.parentElement);
    // TODO: send HTTP request to remove this user from this meeting
    // Assume 1 instructor to 1 student for now
    const url = "/meetings/" + meeting.id;
    $.ajax({
        type: "DELETE",
        url: url,
        data: [],
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    })
  }
}
