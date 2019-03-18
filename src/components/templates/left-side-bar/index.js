import React, { Component } from 'react';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { NavLink, withRouter } from 'react-router-dom';
import './style.css';



class LeftSideBar extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const LIST_TASKS = gql`
            query {
                users(id: 1) {
                    id
                    folders {
                        id
                        label
                        taskslists {
                            id
                            label
                        }
                    }
                    taskslists(folder: true) {
                        id,
                        label
                    }
                }
            }
        `;

        return (
            <Query query={LIST_TASKS}>
                {({ loading, error, data }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error...</p>;
                    let user = data.users[0];
                    return (
                        <div className="todoapp__leftsidebar__container">
                            {!loading && user &&
                                <div key={user.id} className="">
                                    {
                                        user.taskslists.map(tasklist => {
                                            return (
                                            <NavLink activeClassName="listItem--selected" to={`/home/${tasklist.id}`} className="listItem" key={tasklist.id}>
                                                <div id={tasklist.id} key={tasklist.id} className="listItem-inner" role="button">
                                                    <span className="listItem-icon">
                                                        <span className="icon icon-list"></span>
                                                    </span>
                                                    <span className="listItem-title">{ tasklist.label }</span>
                                                    <span className="listItem-count">1</span>
                                                </div>
                                            </NavLink>
                                        )})
                                    }
                                </div>
                            }
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default withRouter(LeftSideBar);