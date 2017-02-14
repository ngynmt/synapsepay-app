import React, { Component } from 'react';
import { Link } from 'react-router';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      phone: '',
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
    this.props.onUserSignUp({ name: this.state.name, phone: this.state.phone, email: this.state.email, password: this.state.password });
  }

  render() {
    return (
      <div>
      <h2>Create account</h2>
      <input
        type='text'
        name='name'
        placeholder='full name'
        onChange={ this.handleTextChange }/>
      <input
        type='text'
        name='phone'
        placeholder='phone number'
        onChange={ this.handleTextChange }/>
      <br/>
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
      <br/>

      <button
        onClick={ this.handleSubmit }>go</button>
      <h5>Already have an account? <Link to="/user">Log in here.</Link></h5>
      </div>
    )
  }
}

export default SignUp;

