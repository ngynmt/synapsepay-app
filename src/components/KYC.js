import React, { Component } from 'react';

class KYC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gender: 'M',
      day: 0,
      month: 0,
      year: 0,
      alias: '',
      address_street: '',
      address_city: '',
      address_state: '',
      address_zip: '',
      address_country: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleGenderChange(e) {
    this.setState({ gender: e.target.value });
  }

  handleTextChange(e) {
    let key = e.target.name;
    let newState = {};
    newState[key] = e.target.value;
    this.setState(newState);
  }

  handleSubmit() {
    this.props.onKYCSubmit({
      gender: this.state.gender,
      day: this.state.day,
      month: this.state.month,
      year: this.state.year,
      alias: this.state.alias,
      address_street: this.state.address_street,
      address_city: this.state.address_city,
      address_state: this.state.address_state,
      address_zip: this.state.address_zip,
      address_country: this.state.address_country
    })
  }

  render() {
    return (
      <div className='KYC-container'>
        <h2>Add Documents</h2>
        <h4>(All fields required)</h4>
        <div className='KYC'>
        <label>Gender: </label>
          <select onChange={this.handleGenderChange}>
            <option
              value='M'>Male</option>
            <option
              value='F'>Female</option>
            <option
              value='O'>Other</option>
          </select>
          <br/>
          <label>Birthday: </label>
          <input
            type='text'
            name='day'
            placeholder='day'
            onChange={ this.handleTextChange }/>
          <input
            type='text'
            name='month'
            placeholder='month'
            onChange={ this.handleTextChange }/>
          <input
            type='text'
            name='year'
            placeholder='year'
            onChange={ this.handleTextChange }/>
          <br/>
          <label>Alias: </label>
          <input
            type='text'
            name='alias'
            placeholder='alias'
            onChange={ this.handleTextChange }/>
          <br/>
          <label>Address: </label>
          <input
            type='text'
            name='address_street'
            placeholder='street'
            onChange={ this.handleTextChange }/>
          <input
            type='text'
            name='address_city'
            placeholder='city'
            onChange={ this.handleTextChange }/>
          <input
            type='text'
            name='address_subdivision'
            placeholder='state'
            onChange={ this.handleTextChange }/>
          <br/>
          <input
            type='text'
            name='address_postal_code'
            placeholder='zip code'
            onChange={ this.handleTextChange }/>
          <input
            type='text'
            name='address_country_code'
            placeholder='country'
            onChange={ this.handleTextChange }/>
          </div>
          <button
            onClick={ this.handleSubmit }>go</button>
      </div>
    )
  }
}

export default KYC;