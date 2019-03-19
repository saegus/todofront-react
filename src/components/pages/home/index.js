import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

import './style.css';

import { setUser } from '../../../services/user.service';

import LeftSideBar from '../../templates/left-side-bar';
import ListDetails from '../../templates/list-details';


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFirstRender: true
        };
        this._setUser = this._setUser.bind(this);
    };
    
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