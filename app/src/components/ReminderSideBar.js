import React, { Component } from "react";
import ReminderSideBarContainer from "./ReminderSideBarContainer"
import Meeting from "../DBClasses/Meeting.js"
import User from "../DBClasses/User.js"
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/minimal-example.css';
/*
The SideBar component takes in a list of Meeting object and an User object as
props. The component will create a new SideBarContainer for each Meeting and
pass the appropriate props.
*/
export default class ReminderSideBar extends Component {
  render() {
    let rows = [];
    let today = new Date();
    for (var i = 0; i < this.props.childProps.getMeetingsList().length; i++) {
      rows.push(
        <ReminderSideBarContainer key={i} meeting={this.props.childProps.getMeetingsList()[i]} userProps={this.props.childProps.getUser()} />
      );
    }
    return (
        <React.Fragment>
        <h4>{today.toDateString()}</h4>
        <Accordion>
          {rows}
        </Accordion>
        </React.Fragment>
    );
  }
}
