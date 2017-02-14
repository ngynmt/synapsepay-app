import React, { Component } from 'react';
import { Link } from 'react-router';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleTextChange(e) {
    let key = e.target.name;
    let newState = {};
    newState[key] = e.target.value;
    this.setState(newState);
  }

  handleSubmit(e) {
    this.props.onUserLogin({ email: this.state.email, password: this.state.password });
  }

  render() {
    return (
      <div>
      <h3>Please login to continue.</h3>
      <input
        type='text'
        name='email'
        placeholder='email'
        onChange={ this.handleTextChange }/>
      <input
        type='text'
        name='password'
        placeholder='password'
        onChange={ this.handleTextChange }/>
      <button
        onClick={ this.handleSubmit }>go</button>
      <h5>Don't have an account? <Link to="/signup">Create one now!</Link></h5>
      </div>
    )
  }
}

export default User;