
import React from 'react';

import { Button, Modal, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class Repo extends React.Component {
  constructor(props) {
    super(props);

    // states
    this.state = {
      login: props.login,
      name: props.name,
      username: props.login,
      reponame: props.name,
      showModal: false,
      formValid: true
    };
  }

  open() {
    this.setState({ showModal: true });
  }

  close() {
    this.setState({ showModal: false });
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value }, this.validateForm);
  }

  getValidationState(value) {
    if (value.length === 0) {
      return 'error';
    }
    return null;
  }

  validateForm() {
    this.setState({formValid: this.state.username.length && this.state.reponame.length});
  }

  changeRepo() {
    const that = this;
    this.props.changeRepo(this.state.username, this.state.reponame).then(function(respond){
      if(!respond.data.repositoryOwner.repository) {
        window.msg.error('Repository is empty');
      } else {
        that.setState({
          login: that.state.username,
          name: that.state.reponame
        });
      }

      that.close();
    }, function(error){
      window.msg.error(error.message);
    });
  }

  render() {
    return (
      <div>
        <h2 id="repo-title">
          <a href={"https://github.com/" + this.state.login + "/" + this.state.name} target="_blank">{this.state.login}/{this.state.name}</a>
        </h2>
        <span><a href="#" onClick={event => this.open()}>Change</a></span>
        <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Change repository</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <FormGroup controlId="username" validationState={this.getValidationState(this.state.username)}>
                <ControlLabel>Username</ControlLabel>
                <FormControl type="text" value={this.state.username} onChange={this.handleChange.bind(this)} placeholder="Enter username"/>
                <FormControl.Feedback />
              </FormGroup>
              <FormGroup controlId="reponame" validationState={this.getValidationState(this.state.reponame)}>
                <ControlLabel>Repo name</ControlLabel>
                <FormControl type="text" value={this.state.reponame} onChange={this.handleChange.bind(this)} placeholder="Enter repo name"/>
                <FormControl.Feedback />
              </FormGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close.bind(this)}>Close</Button>
            <Button bsStyle="primary" disabled={!this.state.formValid} onClick={this.changeRepo.bind(this)}>Change</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Repo;
