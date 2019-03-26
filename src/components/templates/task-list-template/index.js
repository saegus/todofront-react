import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './style.css';

import { Query, Mutation } from "react-apollo";
import { gql } from "apollo-boost";

import ActionPopup from '../../organisms/action-popup';
import ActionPopupContainer from '../../molecules/action-popup-container';
import ActionPopupElement from '../../atoms/action-popup-element';
import ActionPopupHeader from '../../atoms/action-popup-header';
import ActionPopupBody from '../../atoms/action-popup-body';

import Modal from '../../organisms/modal';
import ModalContent from '../../molecules/modal-content';

import { openPopup } from '../../../services/popup.service';
import { openModal, closeModal } from '../../../services/modal.service';

class TaskListTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = { description: '' };
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
                        tasks {
                            id
                            description
                            status
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

        const REMOVE_TASKLIST_MUTATION = gql`
            mutation RemoveTaskListMutation ($id: ID!) {
                deleteTaskList(id: $id) { id }
            }
        `;

        const { description, taskFocused } = this.state;

        return (
            <Query query={TASKS} variables={{ tasklist_id: this.props.match.params.id }}>
                {({ client, loading, error, data }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) {
                        console.log(error); 
                        return (<p>Error... {JSON.stringify(error) } </p>);
                    }
                    let tasklist = data.taskslists[0];
                    if (!tasklist || !tasklist.id) this.props.history.push(`/home`);
                    return (
                        <div className="todoapp__tasklisttemplate__container">
                            <div className="todoapp__tasklisttemplate__container__background">
                                <div className="todoapp__tasklisttemplate__container--background"></div>
                                <div className="todoapp__tasklisttemplate__container--gradient"></div>
                            </div>
                            <div className="todoapp__tasklisttemplate__container__layer">
                                <div className="todoapp__tasklisttemplate__container__header">
                                    <span className="tasklist-name">
                                        { tasklist.editing ? 
                                        <input
                                            onBlur={ () => {
                                                tasklist.editing = false;
                                                this.forceUpdate();  
                                            }}
                                            type="text" 
                                            value={ tasklist.label } 
                                            onChange={e => {
                                                tasklist.label = e.target.value;
                                                this.forceUpdate();
                                            }}
                                            type="text"
                                            placeholder="Ajoutez un nom à cette liste"
                                            />
                                        : 
                                        <span>
                                            {tasklist.label}&nbsp;&nbsp;
                                        </span>
                                        } 
                                        <ActionPopup id="edit-task-popup">
                                            <ActionPopupContainer>
                                                <ActionPopupHeader>
                                                    <span className="popup-tasklist-header">Options de liste</span>
                                                </ActionPopupHeader>
                                                <ActionPopupBody>
                                                    <div className="popup-tasklist-actions">
                                                        <ul>
                                                            <li role="button" onClick={ () => {
                                                                    tasklist.editing = true;
                                                                    this.forceUpdate();
                                                                }}>Modifier la liste</li>
                                                            <li role="button" onClick={ e => {
                                                                return openModal(e, 'modal-tasklist-deletion');
                                                            }}>Supprimer la liste</li>
                                                            <li>Changer la couleur</li>
                                                        </ul>
                                                    </div>
                                                </ActionPopupBody>
                                            </ActionPopupContainer>
                                            <ActionPopupElement>
                                                <button className="edit-task" onClick={e => { openPopup(e, "edit-task-popup") }}>
                                                    <i className="icon icon-more"></i>
                                                </button>
                                            </ActionPopupElement>
                                        </ActionPopup>
                                        </span>
                                </div>
                                <div className="todoapp__tasklisttemplate__container__flexboxFix">
                                    {!loading && tasklist &&
                                        <div key={tasklist.id} className="tasks">
                                            {
                                                tasklist.tasks.tasks.map(task => {
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
                                                            <span className="tasks-item-fav">
                                                                <span className={`icon ${task.favorited ? 'icon-star-filled' : 'icon-star'}`}></span>
                                                            </span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    }
                                    <div>
                                        <div className="tasks-item" id="add-task">
                                            <span className="tasks-item-status">
                                                <span className={`icon ${taskFocused ? 'icon-empty' : 'icon-add'}`}></span>
                                            </span>
                                            <Mutation
                                                mutation={TASK_MUTATION}
                                                variables={{ description, user: Number(this.props.user.id), tasklist: Number(this.props.match.params.id) }}
                                                onCompleted={({ addTask }) => {
                                                    this.emptyDescription();
                                                    const { id, description, status } = addTask;
                                                    tasklist.tasks.tasks.push({ id, description, status });
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
                                                            if (e.which === 13 || e.keyCode === 13) mutation()
                                                        }}
                                                        value={description}
                                                        onChange={e => this.setState({ description: e.target.value })}
                                                        type="text"
                                                        placeholder="Ajouter une tâche"
                                                    />
                                                )}
                                            </Mutation>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Modal id="modal-tasklist-deletion" onBodyClick={() => closeModal('modal-tasklist-deletion')}>
                                <Mutation
                                    mutation={REMOVE_TASKLIST_MUTATION}
                                    variables={{ id: this.props.match.params.id }}
                                    onCompleted={data => {
                                        this.props.history.push(`/home`);
                                    }}
                                >
                                    {
                                        mutation => (
                                        <ModalContent>
                                            <div className="modal-header">
                                                <span>Supprimer une liste</span>
                                            </div>
                                            <div className="modal-body">
                                                <p>
                                                    Voulez-vous vraiment supprimer cette liste ? <br/>
                                                    Toutes les tâches s'y trouvant seront également supprimées.
                                                </p>
                                            </div>
                                            <div className="modal-footer">
                                                <button onClick={() => closeModal('modal-tasklist-deletion') }>Annuler</button>
                                                <button onClick={() => { mutation({
                                                        update: (store, data) => {
                                                            return client.resetStore();
                                                        }}) }}>
                                                    Supprimer
                                                </button>
                                            </div>
                                        </ModalContent>
                                        )
                                    }
                                </Mutation>
                            </Modal>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default withRouter(TaskListTemplate);