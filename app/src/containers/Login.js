import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Login.css";
import User from "../DBClasses/User.js"
import Cookies from 'universal-cookie';
import $ from 'jquery';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      utorid: "",
      password: ""
    };
  }

  validateForm() {
    // return this.state.utorid.length > 0 && this.state.password.length > 0;
    return this.state.utorid.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    // this.setState({ isLoading: true });
    // this.props.userHasAuthenticated(true);

    const url = "/users/" + this.state.utorid;
    const component = this;
    $.ajax({
        type: "GET",
        url: url,
        data: null,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
          component.handleResponse();
        },
        error: function(){
          alert("Utorid and/or password is incorrect");
        }
    })

  }

  //Called when Ajax request is successful
  handleResponse = () =>{
    this.props.setUtorid(this.state.utorid);
    this.setState({ isLoading: true });
    this.props.userHasAuthenticated(true);
    this.props.history.push({
     pathname: "/calendar",
     state: { utorid: this.state.utorid }
     });
  }


  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="utorid" bsSize="large">
            <ControlLabel>UtorID</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.enteredUtorid}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.enteredPassword}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Login"
            loadingText="Logging in…"
          />
        </form>
      </div>
    );
  }
}
