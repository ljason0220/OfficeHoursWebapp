import React, { Component } from "react";
import moment from "moment";
import {Modal, ListGroup, ListGroupItem, Button, Form, FormGroup, ControlLabel, FormControl, DropdownButton, MenuItem, Panel } from 'react-bootstrap';
import axios from 'axios';

export default class EventModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    intervals: [10,15,20,25,30,45,60],
    durationOptions : [],
    selectedDuration: 10, // default selected value
    courseOptions : [],
    selectedCourse : '',
    selectedLocation : '',
    note: '',
    meetingsList: [],
    selectedMeeting: null,
    interval: null
    };
  }

  componentDidMount(){
  }

  onLoad(){

  	let durationOptions = [];

  	if (this.props.modalProps.type == 'createAvailability'){
	  	for (let i =0; i< this.state.intervals.length; i++){
	  		if (moment.duration(this.props.modalProps.end.diff(this.props.modalProps.start)).asMinutes() % this.state.intervals[i] == 0){
	  			durationOptions.push(this.state.intervals[i]);
	  		}
	  	}
	  	this.setState({durationOptions:durationOptions,
	  	 			selectedCourse: this.props.modalProps.courses[0],
	  	 			courseOptions:this.props.modalProps.courses
	  	});
      console.log(this.props.modalProps.courses);

  	} else {

		// hist.generateMeetingList();
		this.createListGroup();
		this.setState({availability: this.props.modalProps.availability});


  		if (this.props.modalProps.type == 'editAvailability'){
  			  	this.setState({durationOptions:durationOptions,
	  	 			selectedCourse: this.props.modalProps.courses[0],
	  	 			courseOptions:this.props.modalProps.courses,
	  	 			start: this.props.modalProps.start,
	  				end: this.props.modalProps.end,
	  	 			utorid: this.props.modalProps.utorid,
	  	 			location: this.props.modalProps.location
	  	});

	  	} else if (this.props.modalProps.type == 'createMeeting'){
	  		this.setState({availabilityid:this.props.modalProps.availabilityid,
	  					attendees: [this.props.modalProps.utorid],
	  					note: this.state.note,
	  					interval: this.state.interval,
	  					start: this.props.modalProps.start,
	  					end: this.props.modalProps.end,
	  					host: this.props.modalProps.host,
	  					location: this.props.modalProps.location
		  	});

	  	} else if (this.props.modalProps.type == 'editMeeting'){
	  		this.setState({availabilityid:this.props.modalProps.availabilityid,
	  					attendees: [this.props.modalProps.utorid],
	  					note: this.props.modalProps.note,
	  					interval: null,
	  					start: this.props.modalProps.start,
	  					end: this.props.modalProps.end,
	  					host: this.props.modalProps.host,
	  					location: this.props.modalProps.location
		  	});

  	}

  	}


  }

  handleSelectDuration(eventKey, event) {
    this.setState({ selectedDuration: this.state.durationOptions[eventKey] });
  }

  handleSelectCourse(eventKey, event) {
    console.log(eventKey);
    console.log(event);
    this.setState({ selectedCourse: this.state.courseOptions[eventKey] });
  }

  handleChangeLocation(event) {
    this.setState({ selectedLocation: event.target.value });
  }

  handleChangeNote(event){
  	 this.setState({ note: event.target.value });
  }

  handleClickedMeeting(event){
  	console.log(event);
  	this.setState({ interval: event.interval });
  	this.setState({ selectedMeeting: event.interval });
  }

  handleChangeCourse(event){
  	console.log("event");
  	console.log(event);
  	 this.setState({ selectedCourse: event.target.value });
  }

  // generateMeetingList = () => {

  // }

  handleSubmit(){
  	// all api calls, calls to calendar.js here
  	if (this.props.modalProps.type == 'createAvailability'){
  		const query = '/users/' + this.props.modalProps.utorid + '/availabilities';
  		axios.post(query, {
	      startTime: this.props.modalProps.start.format().substring(0,16),
	      endTime: this.props.modalProps.end.format().substring(0,16),
	      meeting_length: this.state.selectedDuration,
	      host: this.props.modalProps.utorid,
	      location: this.state.selectedLocation,
	      courseCode: "CS"
	    })
	    .then((response) => {
	      console.log(response);
	      this.props.closeModal();
	      // still need to call rerender in calendar.js
	    })

  	} else if (this.props.modalProps.type == 'editAvailability'){
  		const query = '/users/' + this.props.modalProps.utorid + '/availabilities/' + this.props.modalProps.availability.id;
  		axios.put(query, {
	      startTime: this.props.modalProps.start.format().substring(0,16),
	      endTime: this.props.modalProps.end.format().substring(0,16),
	      location: this.state.selectedLocation,
	      courseCode: this.state.selectedCourse
	    })
	    .then((response) => {
	      console.log(response);
	      this.props.closeModal();
	      // still need to call rerender in calendar.js
	    })


  	} else if (this.props.modalProps.type == 'createMeeting'){
  		const query = '/meetings/meeting';
  		axios.post(query, {
	      availability: this.props.modalProps.availability.id,
	      note: this.state.note,
	      interval: this.state.interval,
	      attendee: this.props.modalProps.utorid
	    })
	    .then((response) => {
	      console.log(response);
	      this.props.closeModal();
	      // still need to call rerender in calendar.js
	    })


  	} else if (this.props.modalProps.type == 'editMeeting'){
  		const query = '/users/' + this.state.utorid + '/meetings/' + this.state.selectedMeeting;
  		axios.put(query, {
	      note: this.state.note
	    })
	    .then((response) => {
	      console.log(response);
	      this.props.closeModal();
	      // still need to call rerender in calendar.js
	    })

  	}
  }

  createListGroup = () => {

	const len = this.props.modalProps.availability.booked.length;
  	const meetings = this.props.modalProps.availability.meetings;
  	let meetingsList = [];
  	let start;
  	let id = this.props.modalProps.availability.id;
  	let attendees;
  	var count = 0;
  	let isBooked;
  	let isOwned=false;
  	let meetingid;
  	for (let i = 0; i < len; i++){
  		start = moment(this.props.modalProps.start).format('h:mm').add(i * this.props.modalProps.availability.meeting_length, 'minutes');
 		if (this.props.modalProps.availability.booked[i]){
 			if (this.props.modalProps.availability.meetings[count].attendees.includes(this.props.modalProps.utorid)){
 				isOwned = true;
 			}
  			attendees = this.props.modalProps.availability.meetings[count].attendees;
  			isBooked = true;
  			meetingid = this.props.modalProps.availability.meetings[count].id;
  			meetingsList.push({start: start, availabilityid: id, interval: i, attendees:attendees, isBooked: isBooked, isOwned: isOwned, meetingid:meetingid});
  		} else {
  			attendees='';
  			isBooked = false;
  			meetingsList.push({start: start, availabilityid: id, interval: i, attendees:attendees, isBooked: isBooked, isOwned: isOwned});
  		}

  		count = count+1;
  	}
  	this.setState(meetingsList: meetingsList);

  }

  handleSubmitDelete = () => {
  	if (this.props.modalProps.type == 'editAvailability'){

  		const query = '/users/' + this.props.modalProps.utorid + '/availabilities/' + this.props.modalProps.availability.id;
  		axios.delete(query)
	    .then((response) => {
	      console.log(response);
	      this.props.closeModal();
	      // still need to call rerender in calendar.js
	    })

  	}
  	else if (this.props.modalProps.type == 'editMeeting'){
  		const query = '/users/' + this.state.utorid + '/meetings/' + this.state.selectedMeeting;
  		axios.delete(query)
	    .then((response) => {
	      console.log(response);
	      this.props.closeModal();
	      // still need to call rerender in calendar.js
	    })

  	}
  }

  checkOwned(booked, owned){
  	if(owned){
  		return 'success';
  	}
  	else if (booked){
  		return 'danger';
  	}
  	else {
  		return 'undefined';
  	}
  }

  renderListGroup = () => {
  	return (
  		<ListGroup>
	  	{this.state.meetingsList.map((data, i) => (
				  <ListGroupItem bsStyle={this.checkOwned(data.isBooked, data.isOwned)} onClick={(data) => data.isBooked && this.handleClickedMeeting(data)} key={i}>
					{data.startTime},{data.attendees}
				  </ListGroupItem>
				))}
	  </ListGroup>

  		)
  }

  render() {
  	if (this.props.modalProps.type == 'createAvailability'){
  		return (
	        <Modal id="modalCOH" onEntered={this.onLoad.bind(this)} show={this.props.show} onHide={this.props.closeModal}>
		        <Modal.Header>
		        	<Modal.Title>{this.props.modalProps.title} from: {moment(this.props.modalProps.start).format('dddd, MMMM Do, h:mm a')} to {moment(this.props.modalProps.end).format('dddd, MMMM Do, h:mm a')}</Modal.Title>
		        </Modal.Header>
		        <Modal.Body>
			        <Panel bsStyle="primary">
			        	<Panel.Heading>Enter Values</Panel.Heading>
			        	<Panel.Body>
				        	<Form>
							  <FormGroup controlId="formLocation">
							    <ControlLabel>Location</ControlLabel>{' '}
							    <FormControl type="text" placeholder="" onChange={this.handleChangeLocation.bind(this)}/>
							  </FormGroup>{' '}
							  <FormGroup controlId="formCourse">
							  	<ControlLabel>Course</ControlLabel>{' '}
							    <FormControl type="text" placeholder="" onChange={this.handleChangeCourse.bind(this)}/>
							  </FormGroup>{' '}
							  <FormGroup controlId="formDuration">
							  	<ControlLabel>Length of Meetings (minutes)</ControlLabel>{' '}
							  	<DropdownButton
									title={this.state.selectedDuration}
									id="document-type"
									onSelect={this.handleSelectDuration.bind(this)}
								  >
									{this.state.durationOptions.map((opt, i) => (
									  <MenuItem key={i} eventKey={i}>
										{opt}
									  </MenuItem>
									))}
								</DropdownButton>
							  </FormGroup>{' '}
							</Form>
						</Panel.Body>
					</Panel>
		        </Modal.Body>
		        <Modal.Footer>
		        	<Button onClick={this.handleSubmit.bind(this)} bsStyle="primary">Create</Button>
		        	<Button onClick={this.props.closeModal}>Cancel</Button>
		        </Modal.Footer>
	        </Modal>
      );
  	}
  	if (this.props.modalProps.type == 'editAvailability'){
  		return (
	        <Modal id="modalEOH" onEntered={this.onLoad.bind(this)} show={this.props.show} onHide={this.props.closeModal}>
		        <Modal.Header>
		        	<Modal.Title>{this.props.modalProps.title} from: {moment(this.props.modalProps.start).format('dddd, MMMM Do, h:mm a')} to {moment(this.props.modalProps.end).format('dddd, MMMM Do, h:mm a')}</Modal.Title>
		        </Modal.Header>
		        <Modal.Body>
		        	<Panel bsStyle="primary">
						<Panel.Heading>Meetings</Panel.Heading>
						  <Panel.Body style={{'maxHeight': '30vh', 'overflowY': 'auto'}}>
							{this.renderListGroup()}
						</Panel.Body>
					</Panel>
			        <Panel>
			        	<Panel.Body>
				        	<Form>
							  <FormGroup controlId="formLocation">
							    <ControlLabel>Location</ControlLabel>{' '}
							    <FormControl type="text" placeholder={this.props.modalProps.location} onChange={this.handleChangeLocation.bind(this)}/>
							  </FormGroup>{' '}
							  <FormGroup controlId="formCourse">
							  	<ControlLabel>Course</ControlLabel>{' '}
							    <FormControl type="text" placeholder="" onChange={this.handleChangeCourse.bind(this)}/>
							  </FormGroup>{' '}
							</Form>
						</Panel.Body>
					</Panel>
		        </Modal.Body>
		        <Modal.Footer>
		        	<Button onClick={this.handleSubmit.bind(this)} bsStyle="primary">Apply</Button>
		        	<Button onClick={this.handleSubmitDelete.bind(this)} bsStyle="primary">Delete</Button>
		        	<Button onClick={this.props.closeModal}>Cancel</Button>
		        </Modal.Footer>
	        </Modal>
      );
  	}
  	else if (this.props.modalProps.type == 'createMeeting'){
  		return (
	        <Modal id="modalCM" onEntered={this.onLoad.bind(this)} show={this.props.show} onHide={this.props.closeModal}>
		        <Modal.Header closeButton>
		        	<Modal.Title>{this.props.modalProps.title}</Modal.Title>
		        </Modal.Header>
		        <Modal.Body>
		        	<Panel bsStyle="primary">
						<Panel.Heading>Select Meeting Slot</Panel.Heading>
						  <Panel.Body style={{'maxHeight': '30vh', 'overflowY': 'auto'}}>
						  	{this.renderListGroup()}
						</Panel.Body>
					</Panel>
		        	<Panel>
			        	<Panel.Body>
				        	<Form>
							  <FormGroup controlId="formNote">
							    <ControlLabel>Note</ControlLabel>{' '}
							    <FormControl type="text" placeholder="" onChange={this.handleChangeNote.bind(this)}/>
							  </FormGroup>{' '}
							</Form>
						</Panel.Body>
					</Panel>
		        </Modal.Body>
		        <Modal.Footer>
		        	<Button onClick={this.handleSubmit.bind(this)} bsStyle="primary">Create</Button>
		        	<Button onClick={this.props.closeModal}>Cancel</Button>
		        </Modal.Footer>
	        </Modal>
      );
  	}
  	else if (this.props.modalProps.type == 'editMeeting'){
  		return (
	        <Modal id="modelEM" onEntered={this.onLoad.bind(this)} show={this.props.show} onHide={this.props.closeModal}>
		        <Modal.Header closeButton>
		        	<Modal.Title>{this.props.modalProps.title}</Modal.Title>
		        </Modal.Header>
		        <Modal.Body>
		        	<Panel bsStyle="primary">
						<Panel.Heading>Click Meeting to Delete</Panel.Heading>
							<Panel.Body>
						  		{this.renderListGroup()}
							</Panel.Body>
					</Panel>
		        	<Panel>
			        	<Panel.Body>
				        	<Form>
							  <FormGroup controlId="formNote">
							    <ControlLabel>Note</ControlLabel>{' '}
							    <FormControl type="text" placeholder={this.props.modalProps.note} onChange={this.handleChangeNote.bind(this)}/>
							  </FormGroup>{' '}
							</Form>
						</Panel.Body>
					</Panel>
		        </Modal.Body>
		        <Modal.Footer>
		        	<Button onClick={this.handleSubmit.bind(this)} bsStyle="primary">Edit</Button>
		        	<Button onClick={this.handleSubmitDelete.bind(this)} bsStyle="primary">Delete</Button>
		        	<Button onClick={this.props.closeModal}>Cancel</Button>
		        </Modal.Footer>
	        </Modal>
      );
  	}
  	else {
  		return null;
  	}
  }
}
