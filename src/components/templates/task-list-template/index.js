import React, { Component } from 'react';
import './style.css';

import { Query } from "react-apollo";
import { gql } from "apollo-boost";

class TaskListTemplate extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    };
    handleClick(e, i) {
        this.props.onToggleSidebar({id : e.target.id });
    }

    render() {
        const TASKS = gql`
            query {
                taskslists(id: 1) {
                    id
                    label
                    folder {id}
                    tasks {
                    id
                    description
                    status
                    }
                }
            }
        `;
        return (
            <Query query={TASKS}>
                {({ loading, error, data }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error...</p>;
                    let tasklist = data.taskslists[0];
                    return (
                        <div className="todoapp__tasklisttemplate__container">
                            <div className="todoapp__tasklisttemplate__container__layer">
                                <div className="todoapp__tasklisttemplate__container__flexboxFix">
                                    
                                    {!loading && tasklist &&
                                        <div key={tasklist.id} className="tasks">
                                            {
                                                tasklist.tasks.map(task => {
                                                    return (
                                                        <div className="tasks-item" key={ task.id}>
                                                            <span className="tasks-item-status">
                                                                <span className={`icon ${task.status ? 'icon-success' : 'icon-empty'}`}></span>
                                                            </span>
                                                            <button 
                                                                id={task.id}
                                                                className={`tasks-item-description ${ task.status ? 'task-completed' : null}`} 
                                                                onClick={ this.handleClick }>
                                                                    { task.description}
                                                                </button>
                                                            <span className="tasks-item-fav"></span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    );
                }}
            </Query>


            // <div className="todoapp__tasklisttemplate__container">
            //     TaskListTemplate

            //     <button onClick={ this.props.onToggleSidebar }>toggle </button>
            // </div>
        );
    }
}

export default TaskListTemplate;