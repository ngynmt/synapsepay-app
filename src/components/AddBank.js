import React, { Component } from 'react';

class AddBank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bank: 'bofa',
      username: '',
      password: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBankChange = this.handleBankChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleSubmit() {
    this.props.addBank({ bank: this.state.bank, username: this.state.username, password: this.state.password });
  }

  handleBankChange(e) {
    this.setState({ bank: e.target.value });
  }

  handleTextChange(e) {
    let key = e.target.name;
    let newState = {};
    newState[key] = e.target.value;
    this.setState(newState);
  }

  render() {
    return (
      <div>
        <h2>Add Bank</h2>
        <select onChange={this.handleBankChange}>
          <option
            value='bofa'>Bank of America</option>
          <option
            value='chase'>Chase</option>
        </select>
        <h3>Bank Login</h3>
          <input
            type='text'
            name='username'
            placeholder='username'
            onChange={ this.handleTextChange }/>
          <input
            type='text'
            name='password'
            placeholder='password'
            onChange={ this.handleTextChange }/>
          <button
            onClick={ this.handleSubmit }>go</button>
      </div>
    )
  }
}

export default AddBank;