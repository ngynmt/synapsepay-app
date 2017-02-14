import React, { Component } from 'react';

class OrderForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'small',
      toppings: {
        pepperoni: false,
        sausage: false,
        olives: false,
        bellpeppers: false
      },
      total: 5
    }
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleToppings = this.handleToppings.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSizeChange(e) {
    this.setState({ size: e.target.value }, () => this.calculateTotal());

  }
  handleToppings(e) {
    let toppings = this.state.toppings;
    toppings[e.target.value] = !toppings[e.target.value];
    this.setState({ toppings: toppings }, () => this.calculateTotal());
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.onOrderSubmit({ size: this.state.size,
      toppings: this.state.toppings,
      total: this.state.total
    });
    // save form values
    // go to next
  }
  calculateTotal() {
    let total = 0;
    for (let key in this.state.toppings) {
      if (this.state.toppings[key] === true) {
        total++;
      }
    }
    if (this.state.size === 'small') {
      total += 5;
    } else if (this.state.size === 'medium') {
      total += 8;
    } else if (this.state.size === 'large') {
      total += 10;
    }
    this.setState({ total: total });
    
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>pick a size:</h3>
        <label>
          <input
            type='radio'
            name='size'
            value='small'
            checked={this.state.size === 'small'}
            className='form-elements'
            onChange={this.handleSizeChange}/>small ($5)</label>
        <label>
          <input
            type='radio'
            name='size'
            value='medium'
            checked={this.state.size === 'medium'}
            className='form-elements'
            onChange={this.handleSizeChange}/>medium ($8)</label>
        <label>
          <input
            type='radio'
            name='size'
            value='large'
            checked={this.state.size === 'large'}
            className='form-elements'
            onChange={this.handleSizeChange}/>large ($10)</label>
        <h3>choose your toppings ($1 each):</h3>
        <label>
          <input
            value='pepperoni'
            type='checkbox'
            checked={this.state.toppings['pepperoni'] === true}
            className='form-elements'
            onChange={this.handleToppings}/>pepperoni</label>
        <label>
          <input
            value='sausage'
            type='checkbox'
            checked={this.state.toppings['sausage'] === true}
            className='form-elements'
            onChange={this.handleToppings}/>sausage</label>
        <label>
          <input
            value='olives'
            type='checkbox'
            checked={this.state.toppings['olives'] === true}
            className='form-elements'
            onChange={this.handleToppings}/>olives</label>
        <label>
          <input
            value='bellpeppers'
            type='checkbox'
            checked={this.state.toppings['bellpeppers'] === true}
            className='form-elements'
            onChange={this.handleToppings}/>bell peppers</label>
          <h3>Total: ${this.state.total}</h3>
          <input
            className='button'
            type='submit'
            value='submit'/>
      </form>
    )
  }
}

export default OrderForm;