import React, { Component } from 'react';

import './style.css';

import TaskListTemplate from '../../templates/task-list-template';
import RightSideBar from '../../templates/right-side-bar';

class ListDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebar_status: 'close'
        };
        this.toggleSideBar = this.toggleSideBar.bind(this);
    };

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
    }

    toggleSideBar(p) {
        this.setState({ status: 'open', task_id: p.id });
    }

    render() {
        return (
            <React.Fragment>
                <TaskListTemplate onToggleSidebar={this.toggleSideBar} user={{ id: this.props.user.id }} />
                <RightSideBar status={this.state.status} task_id={this.state.task_id} user={{ id: this.props.id }}/>
            </React.Fragment>
        );
    }
};


export default ListDetails;