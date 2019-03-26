import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

import './style.css';
import LeftSideBar from '../../templates/left-side-bar';
import ListDetails from '../../templates/list-details';
import { closeAllPopups } from '../../../services/popup.service';


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFirstRender: true
        };
        this._setUser = this._setUser.bind(this);
    };

    componentDidMount() {
        window.addEventListener('click', closeAllPopups)
    }
    componentWillUnmount() {
        window.removeEventListener('click', closeAllPopups);
    }
    
    _setUser = user => {
        if (this.state.isFirstRender) return this.setState({ ...user, isFirstRender: false })
    }

    render() {
        const ListDetailsComponent = args => {
            return <ListDetails user={{ id: this.state.id }} {...args} />
        };
        const QUERY_ME = gql`
            query {
                me {
                    id
                    first_name
                    last_name
                    profile_picture
                }
            }
        `;
        const { user } = this.state;
        return (
            <Query 
                query={QUERY_ME}
                onCompleted={data => this._setUser(data.me) }
                >
                {({ loading, error, data }) => { 
                    if (loading && !user) return <p>Loading...</p>;
                    if (error) return <p>Error...</p>;
                    const { me } = data;
                    return ( <div className="todoapp__container">
                            <LeftSideBar user={ me }/>
                            <Route pattern='/home' path='/home/:id' component={ ListDetailsComponent } />
                        </div>
                    );
                    }
                }
            </Query>
        )
    }
}

export default withRouter(Home);