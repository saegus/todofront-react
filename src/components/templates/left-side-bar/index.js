import React, { Component } from 'react';
import { Query, Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { NavLink, withRouter } from 'react-router-dom';
import './style.css';



class LeftSideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            label: ''
        }
    }

    render() {
        const QUERY_ME = gql`
            query {
                me {
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

        const TASKLIST_MUTATION = gql`
            mutation AddTaskListMutation ($label: String!,$user: ID!) {
                addTaskList(label:$label, user: $user) {
                    id,
                    label
                }
            }
        `;

        return (
            <Query query={QUERY_ME}>
                {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error...</p>;
                const user = data.me;
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
                        <div className="listItem">
                            <div className="listItem-inner" role="button">
                                <span className="listItem-icon">
                                    <span className="icon icon-add"></span>
                                </span>
                                <Mutation
                                    mutation={TASKLIST_MUTATION}
                                    variables={{ label: this.state.label, user: Number(this.props.user.id) }}
                                    onCompleted={({ addTaskList }) => {
                                        this.setState({ label: '' })
                                        const { id, label } = addTaskList;
                                        user.taskslists.push({ id, label });
                                        console.log(user.taskslists)
                                        }
                                    }
                                >
                                    {mutation => (
                                        <input
                                            onClick={e => this.setState({ taskListFocused: true })}
                                            onBlur={e => this.setState({ taskListFocused: false }, () => {
                                                return this.state.label.length ? mutation() : null
                                            })}
                                            onKeyPress={e => {
                                                if (e.which == 13 || e.keyCode == 13) mutation()
                                            }}
                                            value={ this.state.label }
                                            onChange={e => this.setState({ label: e.target.value })}
                                            type="text"
                                            placeholder="Nouvelle liste"
                                        />
                                    )}
                                </Mutation>
                            </div>
                        </div>
                     </div>
                    )
                }}
            </Query>
                    
        );
    }
}

export default withRouter(LeftSideBar);