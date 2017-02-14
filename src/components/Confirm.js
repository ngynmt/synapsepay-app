import React, { Component } from 'react';

class Confirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pizza: {
        toppings: this.props.info.order.toppings,
        size: this.props.info.order.size,
        total: this.props.info.order.total
      },
      bank: 'bofa'
    };
    this.getToppings = this.getToppings.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBankChange = this.handleBankChange.bind(this);
  }

  getToppings() {
    let str = '';
    for (let key in this.state.pizza.toppings) {
      if (this.state.pizza.toppings[key] === true) {
        str += key + ' + '
      }
    }
    str = str.slice(0, str.length - 2);
    return str;
  }

  handleBankChange(e) {
    this.setState({ bank: e.target.value });
  }

  handleSubmit() {
    this.props.createTransaction({ bank: this.state.bank });
  }

  render() {
    let bankNodes = this.props.info.bankNodes.map(bank => {
      return (
        <option
          value={ bank.name }>{ bank.properName }</option>
        )})
    return (
      <div>
        <h2>Confirm Order</h2>
        <h3>1 {this.state.pizza.size} {this.getToppings()} pizza.</h3>
        <h4>Choose payment</h4>
        <select onChange={this.handleBankChange}>
        {bankNodes}
        </select>
        <h3>Total: ${this.state.pizza.total}</h3>
      <button
        onClick={ this.handleSubmit }>order</button>
      </div>
    )
  }
}

export default Confirm;