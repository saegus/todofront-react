import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { Query } from "react-apollo";
import { gql } from "apollo-boost";

import './style.css';

class RightSideBar extends Component {

    render() {
        if (!this.props.task_id) return <div className={`todoapp__rightsidebar__container todoapp__rightsidebar__container--close`}></div>;
        const TASK = gql`
            query getTask($id: ID!) {
                tasks(id: $id) {
                    id
                    description
                    status
                }
            }
        `;
        return (
            <div className={`todoapp__rightsidebar__container todoapp__rightsidebar__container--${this.props.status || 'close'}`}>
                <Query query={TASK} variables={{ id: this.props.task_id }}>
                    {({ loading, error, data }) => {
                        if (loading) return <p>Loading...</p>;
                        if (error) {
                            console.log(error);
                            return (<p>Error... {JSON.stringify(error)} </p>);
                        }
                        let task = data.tasks[0];
                        return (
                            <div className="todoapp__rightsidebar__content">
                                <div className="task-information task-general-information">
                                    <div className="task-information--container">
                                        <span className="tasks-item-status">
                                            <span className={`icon ${task.status ? 'icon-success' : 'icon-empty'}`}></span>
                                        </span>
                                        <div> { task.description }</div>
                                        <span className="tasks-item-fav">
                                            <span className={`icon ${task.favorited ? 'icon-star-filled' : 'icon-star'}`}></span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    }}
                </Query>
            </div>
        );
    }
};

RightSideBar.propTypes = {
    status: PropTypes.string,
    task_id: PropTypes.string
};

export default withRouter(RightSideBar);