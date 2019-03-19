import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './style.css';

import { Query, Mutation } from "react-apollo";
import { gql } from "apollo-boost";

class TaskListTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = { description : '' };
        this.handleClick = this.handleClick.bind(this);
        this.emptyDescription = this.emptyDescription.bind(this);
    };
    handleClick(e, i) {
        this.props.onToggleSidebar({id : e.target.id });
    };

    emptyDescription() {
        return this.setState({ description: '' });
    };

    render() {
        const TASKS = gql`
            query getTasks($tasklist_id: ID!) {
                taskslists(id: $tasklist_id) {
                    id
                    label
                    folder {id}
                    tasks {
                        id
                        description
                        status
                        user {
                            id
                        }
                    }
                }
            }
        `;
        const TASK_MUTATION = gql`
            mutation AddTaskMutation ($description: String!, $tasklist: ID!, $user: ID!) {
                addTask(description:$description, tasklist: $tasklist, user: $user) {
                    id,
                    description,
                    status
                }
            }
        `;

        const { description, taskFocused } = this.state;

        return (
            <Query query={TASKS} variables={{ tasklist_id: this.props.match.params.id }}>
                {({ loading, error, data }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) {
                        console.log(error); 
                        return (<p>Error... {JSON.stringify(error) } </p>);
                    }
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
                                            <div className="tasks-item" id="add-task">
                                                <span className="tasks-item-status">
                                                    <span className={`icon ${ taskFocused ? 'icon-empty' : 'icon-add' }`}></span>
                                                </span>
                                                <Mutation
                                                    mutation={TASK_MUTATION}
                                                    variables={{ description, user: Number(this.props.user.id), tasklist: Number(this.props.match.params.id) }}
                                                    onCompleted={ ({ addTask }) => {
                                                            this.emptyDescription();
                                                            const { id, description, status } = addTask;
                                                            tasklist.tasks.push({ id, description, status });
                                                        }
                                                    }
                                                >
                                                    {mutation => (
                                                        <input
                                                            onClick={e => this.setState({ taskFocused: true })}
                                                            onBlur={e => this.setState({ taskFocused: false }, () => {
                                                                return this.state.description.length ? mutation() : null
                                                            })}
                                                            onKeyPress={e => {
                                                                if (e.which == 13 || e.keyCode == 13) mutation()
                                                            }}
                                                            value={ description }
                                                            onChange={e => this.setState({ description: e.target.value })}
                                                            type="text"
                                                            placeholder="Ajouter une tâche"
                                                        />
                                                    )}
                                                </Mutation>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default withRouter(TaskListTemplate);