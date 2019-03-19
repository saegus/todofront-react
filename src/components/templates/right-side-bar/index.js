import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.css';

class RightSideBar extends Component {
    constructor(props) {
        super(props)
    };

    render() {
        return (
            <div className={`todoapp__rightsidebar__container todoapp__rightsidebar__container--${this.props.status || 'close'}`}>
                <div className="todoapp__rightsidebar__content">
                    <div className="task-information task-general-information">coucou</div>
                </div>
            </div>
        );
    }
};

RightSideBar.propTypes = {
    status: PropTypes.string,
    task_id: PropTypes.string
};

export default RightSideBar;