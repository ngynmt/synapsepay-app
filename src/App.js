import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      order: {
        size: 'small',
        toppings: {
          pepperoni: false,
          sausage: false,
          olives: false,
          bellpeppers: false
        },
        total: 5
      },
      user: {
        signedIn: false,
        oauth: '',
        refreshToken: '',
        email: ''
      },
      bankNodes: [
        { name: 'chase', properName: 'Chase' },
        { name: 'bofa', properName: 'Bank of America'}
      ],
      userObj: {}
    }
    this.addBank = this.addBank.bind(this);
    this.handleOrderSubmit = this.handleOrderSubmit.bind(this);
    this.handleUserLogin = this.handleUserLogin.bind(this);
    this.handleUserSignUp = this.handleUserSignUp.bind(this);
    this.createTransaction = this.createTransaction.bind(this);
    this.handleSubmitKYC = this.handleSubmitKYC.bind(this);

  }

  handleOrderSubmit(order) {
    this.setState({ order: order }, () => !this.state.user.signedIn ? this.props.router.push('/user') : this.props.router.push('/confirm') );
  }

  handleUserLogin(user) {
    let that = this;
    let loginPayload = {
      'post-type': 'login',
      'email': user.email,
      'password': user.password
    }
    axios.post('http://localhost:3001/api/users', loginPayload)
      .then(function(res) {
        if (res.data.message === 'Success') {
          that.setState({ id: res.data.id }, () => that.props.router.push('/confirm'));
        } else {
          alert(res.data.message);
        }
      })
  }

  handleUserSignUp(user) {
    let that = this;
    let userPayload = {
      'post-type': 'signup',
      'email': user.email,
      'phone': user.phone,
      'name': user.name,
      'password': user.password
    }
    axios.post('http://localhost:3001/api/users', userPayload)
    .then(function(res) {
      if (res.data.message === 'Success') {
        console.log(res);
        that.setState({
          user: {
            signedIn: true,
            oauth: res.data.oauth,
            refreshToken: res.data.refreshToken,
            id: res.data.id
          }
        }, () => that.props.router.push('/KYC'));
      } else {
        alert(res.data.message);
      }
    })
    .catch(function(err) {
      console.log(err, 'err');
    });
  }

  addBank(bank) {
    let that = this;
    let bankPayload = {
      'username': bank.username,
      'password': bank.password,
      'bank': bank.bank,
      'id': this.state.user.id
    };
    axios.post('http://localhost:3001/api/banks', bankPayload)
      .then(function(res) {
        if (res.status === 200) {
          console.log(res);
          console.log('Here I am adding the bank nodes, but since the login credentials are fake they are not added.')
          that.props.router.push('/confirm');
        }
      })
      .catch(function(err) {
        console.log(err);
      })
  }



  createTransaction(order) {
    let that = this;
    let transactionPayload = {
      id: this.state.id,
      total: this.state.total,
      bank: order.bank
    }

    axios.post('http://localhost:3001/api/transactions', transactionPayload)
      .then(function(res) {
        console.log(res);
        that.setState({
          order: {
            size: 'small',
            toppings: {
              pepperoni: false,
              sausage: false,
              olives: false,
              bellpeppers: false
            },
            total: 5
          },
          user: {
            signedIn: false,
            oauth: '',
            refreshToken: '',
            email: ''
          },
          bankNodes: [
            { name: 'chase', properName: 'Chase' },
            { name: 'bofa', properName: 'Bank of America'}
          ],
          userObj: {}
        }, () => that.props.router.push('/thanks'));
      })
      .catch(function(err) {
        console.log(err);
        console.log('The order is unable to be completed if no actual bank nodes were added.')
        that.props.router.push('/thanks');
      })


  }

  populateBankNodes() {
    // hypothetical function that is not being called because no nodes are added
    let that = this;
    axios.post('http://localhost:3001/api/getbanks', { id: this.state.user.id })
      .then(function(res) {
        if (res.status === 200) {
          that.setState({ banks: res.data.banks });
        }
      })
      .catch(function(err) {
        console.log(err);
      })
  }

  handleSubmitKYC(info) {
    let that = this;
    let kycPayload = {
        "id": this.state.user.id,
        "email": 'test@test.com',
        "phone_number": '901-942-8167',
        "ip": '123.123.123',
        "name": 'Charlie Brown',
        "alias": info.alias,
        "entity_type": info.gender,
        "entity_scope": 'Not Known',
        "day": info.day,
        "month": info.month,
        "year": info.year,
        "address_street": info.address_street,
        "address_city": info.address_city,
        "address_subdivision": info.address_subdivision,
        "address_postal_code": info.address_postal_code,
        "address_country_code": info.address_country_code
    }

    axios.post('http://localhost:3001/api/kyc', kycPayload)
      .then(function(res) {
        if (res.status === 200) {
          console.log(res)
          that.props.router.push('/bank');
        } else {
          console.log('erroring')
        }
      })
      .catch(function(err) {
        console.log(err);
      })
  }

  render() {
    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        onOrderSubmit: this.handleOrderSubmit,
        onUserLogin: this.handleUserLogin,
        onUserSignUp: this.handleUserSignUp,
        addBank: this.addBank,
        createTransaction: this.createTransaction,
        onKYCSubmit: this.handleSubmitKYC,
        info: this.state
      }));
    return (
      <div>
        <h1>order a pizza</h1>
        <div className='content'>
          <div className='pizza-gif'><img width='400' alt='dancing pizza' height='300' src='https://media.giphy.com/media/l3q2Dh5BA4zRFSwak/source.gif'/></div>
          <div className='forms'>{childrenWithProps}</div>
        </div>
      </div>
    )
  }
}

export default App;