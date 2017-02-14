import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import OrderForm from './components/OrderForm';
import User from './components/User';
import SignUp from './components/SignUp';
import Confirm from './components/Confirm';
import AddBank from './components/AddBank';
import KYC from './components/KYC';
import ThankYou from './components/ThankYou';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

ReactDOM.render(
      <Router history={hashHistory}>
        <Route path='/' component={App}>
          <IndexRoute component={OrderForm}/>
          <Route path='user' component={User}/>
          <Route path='signup' component={SignUp}/>
          <Route path='bank' component={AddBank}/>
          <Route path='kyc' component={KYC}/>
          <Route path='confirm' component={Confirm}/>
          <Route path='thanks' component={ThankYou}/>
        </Route>
      </Router>,
  document.getElementById('root')
);
