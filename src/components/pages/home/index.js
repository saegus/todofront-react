import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import './style.css';

import LeftSideBar from '../../templates/left-side-bar';

import ListDetails from '../../templates/list-details';


class Home extends Component {
    constructor(props) {
        super(props);
    };



    render() {
        return (
            <div className="todoapp__container">
                <LeftSideBar />
                <Route pattern='/home' path='/home/:id' component={ ListDetails } />
            </div>
        )
    }
}

export default Home;