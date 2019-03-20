import React, { Component } from 'react';
import { Query, Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { NavLink, withRouter } from 'react-router-dom';
import './style.css';



class LeftSideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            label: '',
            me: {...props.user}
        }
        this.toggleSidebar = this.toggleSidebar.bind(this);
    }

    toggleSidebar = () => this.setState({ closed: !this.state.closed })

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
                            tasks {
                                totalCount
                            }
                        }
                    }
                    taskslists(folder: true) {
                        id
                        label
                        tasks {
                            totalCount
                        }
                    }
                }
            }
        `;

        const TASKLIST_MUTATION = gql`
            mutation AddTaskListMutation ($label: String!,$user: ID!) {
                addTaskList(label:$label, user: $user) {
                    id,
                    label,
                    tasks {
                        totalCount
                    }
                }
            }
        `;

        const { me, closed } = this.state;

        return (
            <Query query={QUERY_ME}>
                {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error...</p>;
                const user = data.me;
                const profilePictureStyle = {
                    backgroundImage: `url(${ me.profile_picture || require('../../../assets/user.png')})`
                };
                return (
                    <div className={`todoapp__leftsidebar__container ${closed ? 'todoapp__leftsidebar__container--closed' : null }`}>
                         {!loading && user &&
                            (
                             <React.Fragment>
                                <div className="todoapp__leftsidebar__container__user">
                                    <div className="todoapp__leftsidebar__container__user--actions">
                                        <button onClick={ this.toggleSidebar }>
                                            <span className="icon icon-menu"></span>
                                        </button>
                                        <button onClick={this.toggleSidebar}>
                                            <span className="icon icon-loupe"></span>
                                        </button>
                                    </div>

                                    <div className="todoapp__leftsidebar__container__user--info">
                                        <div className="profile-picture" style={ profilePictureStyle }></div>
                                        <span> {me.first_name} {me.last_name }</span>
                                    </div>
                                </div>
                                <div key={user.id} className="todoapp__leftsidebar__container__taskslists">
                                    {
                                        user.taskslists.map(tasklist => {
                                            return (
                                            <NavLink activeClassName="listItem--selected" to={`/home/${tasklist.id}`} className="listItem" key={tasklist.id}>
                                                <div id={tasklist.id} key={tasklist.id} className="listItem-inner" role="button">
                                                    <span className="listItem-icon">
                                                        <span className="icon icon-list"></span>
                                                    </span>
                                                    <span className="listItem-title">{ tasklist.label }</span>
                                                    <span className="listItem-count">{ tasklist.tasks.totalCount }</span>
                                                </div>
                                            </NavLink>
                                        )})
                                    }
                                </div>
                             </React.Fragment>   
                            )
                         }
                        <div className="listItem" id="task-list-adder">
                            <div className="listItem-inner" role="button" onClick={ () => {
                                if(closed) {
                                    document.getElementById('input-create-tasklist').focus();
                                    this.toggleSidebar()
                                }
                            }}>
                                <span className="listItem-icon">
                                    <span className="icon icon-add"></span>
                                </span>
                                <Mutation
                                    mutation={TASKLIST_MUTATION}
                                    variables={{ label: this.state.label, user: Number(this.props.user.id) }}
                                    onCompleted={({ addTaskList }) => {
                                            this.setState({ label: '' })
                                            const { id, label, tasks } = addTaskList;
                                            user.taskslists.push({ id, label, tasks });
                                            this.props.history.push({
                                                pathname: '/home',
                                                state: { id: id }
                                            });
                                        }
                                    }
                                >
                                    {mutation => (
                                        <input
                                            autoFocus={ true }
                                            onClick={e => this.setState({ taskListFocused: true })}
                                            onBlur={e => this.setState({ taskListFocused: false }, () => {
                                                return this.state.label.length ? mutation() : null
                                            })}
                                            onKeyPress={e => {
                                                if (e.which === 13 || e.keyCode === 13) mutation()
                                            }}
                                            value={ this.state.label }
                                            onChange={e => this.setState({ label: e.target.value })}
                                            type="text"
                                            id="input-create-tasklist"
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