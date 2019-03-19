import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import ListTasks from './components/ListTasks';

import Home from './components/pages/home';
import Login from './components/pages/login';

import './App.css';

class App extends Component {

  render() {
    return (
      <div>
        <Route exact path='/' component={ListTasks} />
        <Route path='/home' component={Home} />
        <Route exact path='/login' component={Login} />
      </div>
    );
  }
}

export default withRouter(App);