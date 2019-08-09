import React, { Component, Fragment } from "react";
import Routes from "./Routes";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import "./App.css";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      utorid:null
    };
  }

  async componentDidMount() {
    // try {
    //   await Auth.currentSession();
    //   this.userHasAuthenticated(true);
    // }
    // catch(e) {
    //   if (e !== 'No current user') {
    //     alert(e);
    //   }
    // }
    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }
  //function that sets the logged in User
  setUser = utorid =>{
    this.setState({utorid: utorid})
  }
  //function that gets the logged in User
  //Allows children components to access the logged in User
  getUser = () =>{
    return this.state.utorid;
  }

  handleLogout = async event => {
    this.userHasAuthenticated(false);
    this.props.history.push("/login");
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      setUtorid:this.setUser,
      getUtorid:this.getUser
    };

    return (
      !this.state.isAuthenticating &&
      <div className="App container" >
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              {/*<Link to="/">Calendar</Link>*/}
              Calendar
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {this.state.isAuthenticated
                ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
                : <Fragment>
                    <LinkContainer to="/signup">
                      <NavItem>Signup</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/login">
                      <NavItem>Login</NavItem>
                    </LinkContainer>
                  </Fragment>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);
