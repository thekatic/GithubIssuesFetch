import React, { Component } from "react";
import { PageHeader, Grid, Row, Col, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import AlertContainer from 'react-alert';

// Auth
import { login } from './githubLogin';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();

    login(this.state.email, this.state.password).then(token => {
      this.props.callback(token)
    }, function(error){
      window.msg.error(error.message);
    })
  }

  render() {
    return (
      <div>
        <AlertContainer ref={a => window.msg = a} />
        <PageHeader className="text-center">GitHub login</PageHeader>
        <Grid>
          <Row>
            <Col className="Login">
              <form onSubmit={this.handleSubmit}>
                <FormGroup controlId="email" bsSize="large">
                  <ControlLabel>Email</ControlLabel>
                  <FormControl
                    autoFocus
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
                <Button
                  block
                  bsSize="large"
                  bsStyle="primary"
                  disabled={!this.validateForm()}
                  type="submit"
                >
                  Login
                </Button>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
