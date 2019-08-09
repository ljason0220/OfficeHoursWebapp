import React, { Component } from "react";
import {
  Panel,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Checkbox
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
import axios from 'axios';

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      utorid: "",
      instructor: false,
      name: "",
      confirmPassword: ""
    };
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  handleChange = event => { this.setState({ [event.target.id]:
  event.target.value }); }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });
  
    axios.post('/users/user', {
      utorid: this.state.utorid,
      name: this.state.name,
      email: this.state.email,
      isInstructor: this.state.instructor,
      password: this.state.password
    })
    .then((response) => {
      console.log(response);
      this.props.setUtorid(this.state.utorid);
      this.setState({ isLoading: true });
      this.props.userHasAuthenticated(true);
      this.props.history.push({
       pathname: "/calendar",
       state: { utorid: this.state.utorid }
       });
    })
    .catch((error) => {
      console.log(error);
      alert(error);
      this.setState({ isLoading: false });
      this.props.history.push({
         pathname: "/"
      });
    });
    
  }

  handleInputChange = (event) => {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      console.log(target,value,name);
      this.setState({
        [name]: value
      });
    }

  renderConfirmationForm() {
    return (
      <Form onSubmit={this.handleConfirmationSubmit}>
      </Form>
    );
  }

  renderForm() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup controlId="utorid" bsSize="large">
          <ControlLabel>utorid</ControlLabel>
          <FormControl
            autoFocus
            type="text"
            value={this.state.utorid}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup controlId="name" bsSize="large">
          <ControlLabel>Name</ControlLabel>
          <FormControl
            type="text"
            value={this.state.name}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            value={this.state.password}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            value={this.state.confirmPassword}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <FormGroup controlId="instructor" bsSize="large">
          <Checkbox 
          inline
          name='instructor'
          onChange={this.handleInputChange}
          checked={this.state.instructor}>
            Instructor
          </Checkbox>
        </FormGroup>

        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Signup"
          loadingText="Signing up…"
        />
      </Form>
    );
  }

  render() {
    return (
      <div className="Signup">
        {this.renderForm()}
{/*        {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}*/}
      </div>
    );
  }
}