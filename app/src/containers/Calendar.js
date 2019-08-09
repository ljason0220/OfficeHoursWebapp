import React, { Component } from "react";
import "./Calendar.css";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Meeting from "../DBClasses/Meeting.js"
import User from "../DBClasses/User.js"
import Course from "../DBClasses/Course"
import ReminderSideBar from "../components/ReminderSideBar.js"
import CoursesSideBar from "../components/CoursesSideBar"
import Availability from "../DBClasses/Availability.js";
import Cookies from 'universal-cookie';
import Modal from 'react-modal';
import Drawer from 'react-motion-drawer';
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import EventModal from '../components/EventModal'
import $ from 'jquery';
import axios from 'axios';

const localizer = BigCalendar.momentLocalizer(moment);

const test = new Availability('1', new Date(moment('2018-1-2 14:00')), new Date(moment('2018-12-2 15:00')), 15, "bob1", "ba100", "CSC100", "0000", []);

export default class Calendar extends Component {
    constructor(props) {
    super(props);

    console.log(this.props);

    this.state = {
      isLoading: true,
      events: [],
      isMonthView: false,
      showModal: false,
      leftSideBarOpen:false,
      rightSideBarOpen:false,
      utorid: this.props.getUtorid(),
      modalProps : {
      },
      //User object for this utorid
      user: null,
      //list of all courses for this user
      coursesList:[],
      //list of meetings for this user
      meetingsList:[],
      //list of availabilities for all of this user's courses
      coursesAvailabilityList:[],
      //List of this user's availabilities
      userAvailabilities:[],
      //mapping of courseCode to a list of student names
      studentMapping:[]
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

    /*Setters and getter functions for state variables
   *Meant to be passed as props to the child components
   */
  getUtorid = () =>{
     return this.state.utorid;
  }
  setUser = user =>{
    this.setState({user: user})
  }
  getUser = () =>{
    return this.state.user;
  }
  setCoursesList = (coursesList) =>{
    this.setState({coursesList: coursesList});
    this.render();
  }
  getCoursesList = () =>{
    return this.state.coursesList;
  }
  setMeetingsList = (meetingsList) =>{
    this.setState({meetingsList: meetingsList})
  }
  getMeetingsList = () =>{
    return this.state.meetingsList;
  }
  setCoursesAvailabilityList = (coursesAvailabilityList) =>{
    this.setState({coursesAvailabilityList: coursesAvailabilityList})
  }
  getCoursesAvailabilityList = () =>{
    return this.state.coursesAvailabilityList
  }
  setUserAvailabilites = (userAvailabilities) =>{
    this.setState({userAvailabilities: userAvailabilities})
  }
  getUserAvailabilities = () =>{
    return this.state.userAvailabilities;
  }
  setStudentMapping = (studentMapping) =>{
    this.setState({studentMapping: studentMapping})
  }
  getStudentMapping = () =>{
    return this.state.studentMapping;
  }
  addEvents= (event) =>{
    this.setState({events: [...this.state.events, event]})
  }
  getEvents = () =>{
    return this.state.events;
  }

  handleOpenModal = () =>{
    this.setState({ showModal: true });
  }

  handleCloseModal = () =>{
    this.setState({ showModal: false });
  }


  handleShowLeftSideBar = (e) =>{
    e.preventDefault();
    const ele = document.getElementById('NavBarLeftOpen');
    ele.classList.add("invis");

    const ele2 = document.getElementById('ReminderSideBar');
    ele2.classList.remove("invis");

    const ele3 = document.getElementById('NavBarLeft');
    ele3.classList.remove("NavBarLeft1");
    ele3.classList.add("NavBarLeft2");

    const ele4 = document.getElementById('Calendar');
    if(this.state.rightSideBarOpen){
      ele4.classList.remove("Calendar3");
    }else{
      ele4.classList.remove("Calendar2");
    }
    this.setState({leftSideBarOpen:true});
  }

  handleCloseLeftSideBar = (e) =>{
    const ele = document.getElementById('NavBarLeftOpen');
    ele.classList.remove("invis");

    const ele2 = document.getElementById('ReminderSideBar');
    ele2.classList.add("invis");

    const ele3 = document.getElementById('NavBarLeft');
    ele3.classList.remove("NavBarLeft2");
    ele3.classList.add("NavBarLeft1");

    const ele4 = document.getElementById('Calendar');
    if(this.state.rightSideBarOpen){
      ele4.classList.remove("Calendar3");
      ele4.classList.add("Calendar2");
    }else{
      ele4.classList.remove("Calendar2");
      ele4.classList.add("Calendar1");
    }
    this.setState({leftSideBarOpen:false});
  }


  handleShowRightSideBar = (e) =>{
    e.preventDefault();
    const ele = document.getElementById('NavBarRightOpen');
    ele.classList.add("invis");

    const ele2 = document.getElementById('CoursesSideBar');
    ele2.classList.remove("invis");

    const ele3 = document.getElementById('NavBarRight');
    ele3.classList.remove("NavBarRight1");
    ele3.classList.add("NavBarRight2");

    const ele4 = document.getElementById('Calendar');
    if(this.state.leftSideBarOpen){
      ele4.classList.remove("Calendar3");
    }else{
      ele4.classList.remove("Calendar2");
    }
    this.setState({rightSideBarOpen:true});
  }

  handleCloseRightSideBar = (e) =>{
    const ele = document.getElementById('NavBarRightOpen');
    ele.classList.remove("invis");

    const ele2 = document.getElementById('CoursesSideBar');
    ele2.classList.add("invis");

    const ele3 = document.getElementById('NavBarRight');
    ele3.classList.remove("NavBarRight2");
    ele3.classList.add("NavBarRight1");

    const ele4 = document.getElementById('Calendar');
    if(this.state.leftSideBarOpen){
      ele4.classList.remove("Calendar3");
      ele4.classList.add("Calendar2");
    }else{
      ele4.classList.remove("Calendar2");
      ele4.classList.add("Calendar1");
    }
    this.setState({rightSideBarOpen:false});
  }

  requestUserInfo = () =>{
    const url = "/users/" + this.state.utorid;
    console.log(url);
    const component = this;
    $.ajax({
        type: "GET",
        url: url,
        data: null,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
          const user = new User(data.user.utorId, data.user.name, data.user.email,
            data.user.isInstructor, data.user.courses, data.user.meetings, data.user.availability);
            component.setUser(user);
            component.setCoursesList(user.courses);
            component.setMeetingsList(user.meetings);
            component.setUserAvailabilites(user.availability);
            component.setState({isLoading:false});
            component.requestUserAllMeetings();
            component.requestUserAvailabilities();
        },
        error: function(){
        }
    })
  }

  // GET user availability objects. store in state, then create calendar events
  requestUserAvailabilities = () => {
    let query = '/users/' + this.state.utorid + '/availabilities';
    console.log(this.state.user)
    axios.get(query)
    .then((response) => {
      console.log(response.data);
      if (this.state.user.isInstructor){
        this.setState({userAvailabilities : response.data});
        console.log(response.data);
        this.createEvents(this.state.userAvailabilities);
      } else {
        this.setState({coursesAvailabilityList : response.data});
        this.createEvents(this.state.coursesAvailabilityList);
      }

    })
    .catch((error) => {
      console.log(error);
    });
  }

  //  Get all meetings for a user (student)
  requestUserAllMeetings = () => {
    let query = '/users/' + this.state.utorid + '/meetings';
      axios.get(query)
      .then((response) => {
        console.log(response);
        this.setState({meetingsList : response.data});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  requestAllCourseAvailability = () =>{
    for (var i = 0; i < this.state.coursesList.length; i++) {
      console.log(this.state.coursesList[i]);
      const url = "/courses/" + this.state.coursesList[i] + "/availabilties"
      $.ajax({
          type: "GET",
          url: url,
          data: null,
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (data) {
            const availability = new Availability(data._id, data.startTime,
                                                  data.endTime, data.meeting_length, data.host,
                                                  data.location, data.courseCode, data.booked, data.meetings);
              console.log(availability);
          },
          error: function(){
          }
      })
    }
  }

  // temp = () => {
  //   this.setCoursesList([new Course("CSC100", this.state.user,[],[])]);
  //   // course to student mapping
  //   this.setState({students: null});
  //   // List has all of events on calendar
  //   this.setState({events: [
  //     {
  //       title: 'Some Event',
  //       start: new Date(moment('2018-12-2 14:00')),
  //       end: new Date(moment('2018-12-2 15:00')),
  //       availabilityID: 0,
  //       isOwned: true,

  //       // need more things in here, to pass on to the modal
  //     }
  //     ]});
  // }

  // All initial async calls made here, set up state
  componentDidMount() {
    this.requestUserInfo();
    // may need to make promises here
    // this.requestUserAllMeetings();
    // this.requestUserAvailabilities();
  }

  //
  eventStyleGetter(event, start, end) {
    var style = {
      backgroundColor: event.colour
    };
    return {
      style: style
    };
  }

  // Interact with events
  onSelectEvent(event) {
    if (this.state.user.isInstructor){
      console.log("CAl:" + this.state)
      this.setState({modalProps:   {type: "editAvailability", title: "Edit Office Hour", start: event.start, end: event.end, utorid: this.state.user.utorid, availability: event.availability, courses: this.state.coursesList}});
    } else {
      if (event.isOwned){
        this.setState({modalProps: {type: "editMeeting", title: "Edit Meeting", start: event.start, end: event.end, utorid: this.state.user.utorid, availability: event.availability}});
      } else {
        this.setState({modalProps: {type: "createMeeting", title: "Create New Meeting", start: event.start, end: event.end, utorid: this.state.user.utorid, availability: event.availability}});
      }

    }
    this.handleOpenModal();
  }

  // Slot selection handler
  handleSlotSelect = ({ start, end }) => {
    if (this.state.user.isInstructor){
      if (start !== end){
        this.setState({modalProps: {type: "createAvailability", title: "Create New Office Hour", start: moment(start), end: moment(end), courses: this.state.coursesList, utorid: this.state.user.utorid}});
        this.handleOpenModal();
      }
    }
  };

  // Calendar view change handler
  handleViewChange(view){
    if (view !== 'month'){
      this.setState({isMonthView: false});
    }
  }

  // Create events on calendar from state availabiity variables
  createEvents = (list) => {
    var events = [];
    console.log(list.availabilities)
    for (let i=0; i < list.availabilities.length; i++){
            let availability = list.availabilities[i];
            console.log(availability)
            events.push({start: new Date(availability.startTime), end: new Date(availability.endTime), title: availability.host + "'s Office Hour, at " + availability.location, availability: availability});
    }


    for (let i=0; i < this.state.meetingsList; i++){
      let ref_block = this.state.meetingsList[i].referring_block
      for (let j = 0; j< events.length; j++){
        let event = events[j]
        if (event.availability.id == ref_block){
          event['isOwned'] = true;
        }
      }
    }
    console.log(events)
    this.setState({events : events});
  };

  //checkRequiredStateValues(){};
  render() {
    //TODO: hide the Chevron buttons until hover. Then make them change the
    //CSS of all the components to make room for the side bars.
    //MAYBE have two sets of classes where one set is 5|90|5 and other is 20|80|20

    //Props to be passed to children components
    const childProps = {
      setUser:this.setUser,
      getUser : this.getUser,
      setCoursesList :this.setCoursesList,
      getCoursesList :this.getCoursesList,
      setMeetingsList : this.setMeetingsList,
      getMeetingsList : this.getMeetingsList,
      setCoursesAvailabilityList : this.setCoursesAvailabilityList,
      getCoursesAvailabilityList : this.getCoursesAvailabilityList,
      setUserAvailabilites : this.setUserAvailabilites,
      getUserAvailabilities : this.getUserAvailabilities,
      setStudentMapping : this.setStudentMapping,
      getStudentMapping : this.getStudentMapping
    }
    return ( !this.state.isLoading &&
      <div className="main">
        <div className="NavBarLeft1" id="NavBarLeft">
          <div id ="NavBarLeftOpen">
            <IconButton>
              <ChevronRightIcon onClick={this.handleShowLeftSideBar}/>
            </IconButton>
          </div>
          <div className="invis" id="ReminderSideBar">
              <div id ="CloseLeftSideBarButton">
                <IconButton>
                  <ChevronLeftIcon onClick={this.handleCloseLeftSideBar}/>
                  </IconButton>
              </div>
              <ReminderSideBar childProps={childProps}/>
          </div>
        </div>
        <div className="Calendar1" id="Calendar">
        <EventModal childProps={childProps} modalProps={this.state.modalProps} onRequestClose={this.handleCloseModal} show={this.state.showModal} closeModal={this.handleCloseModal}/>
          <BigCalendar
            // selectable={!this.state.isMonthView}
            selectable={'ignoreEvents'}
            showMultiDayTimes={false}
            localizer={localizer}
            views={['month', 'week', 'day']}
            defaultDate={new Date()}
            defaultView="week"
            events={this.state.events}
            style={{
              height: "100vh"
            }}
            onSelectEvent={event => this.onSelectEvent(event)}
            onSelectSlot={this.handleSlotSelect}
            onView={view => this.handleViewChange(view)}
            min={new Date(2017, 10, 0, 8, 0, 0)}
            max={new Date(2017, 10, 0, 19, 59, 0)}
            step={10}
            timeslots={6}
            eventPropGetter={this.eventStyleGetter}
          />
        </div>
        <div className="NavBarRight1" id="NavBarRight">
          <div id = "NavBarRightOpen">
            <IconButton>
              <ChevronLeftIcon onClick = {this.handleShowRightSideBar}/>
            </IconButton>
          </div>
          <div id="CoursesSideBar" className="invis">
              <div id="CloseRightSideBarButton">
                <IconButton>
                  <ChevronRightIcon onClick ={this.handleCloseRightSideBar}/>
                </IconButton>
              </div>
              <CoursesSideBar childProps={childProps}/>
          </div>
        </div>
      </div>
    );
  }
}
