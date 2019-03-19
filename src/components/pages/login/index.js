import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { gql } from "apollo-boost";
import './style.css';

import { AUTH_TOKEN } from '../../../constants'
import { setUser } from '../../../services/user.service';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: true, // switch between Login and SignUp
            email: '',
            password: '',
            first_name: '',
            last_name: ''
        };
        this._confirm = this._confirm.bind(this);
        this._saveUserData = this._saveUserData.bind(this);
    };

    _confirm = async data => {
        const { token, user } = this.state.login ? data.login : data.signup;
        await setUser(user);
        this._saveUserData(token);
        this.props.history.push(`/home`);
    };

    _saveUserData = token => {
        localStorage.setItem(AUTH_TOKEN, token)
    };

    render() {
        const { login, email, password, first_name, last_name } = this.state;
        const SIGNUP_MUTATION = gql`
            mutation SignupMutation($email: String!, $password: String!, $first_name: String!, $last_name: String!) {
                signup(email: $email, password: $password, first_name: $first_name, last_name: $last_name) {
                    token
                }
            }
        `;
        const LOGIN_MUTATION = gql`
            mutation LoginMutation($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                    token,
                    user {
                        id,
                        last_name,
                        first_name,
                        email
                    }
                }
            }
        `;

        return (
            <div>
                <h4 className="">{login ? 'Login' : 'Sign Up'}</h4>
                <div className="">
                    {!login && (
                        <React.Fragment>
                            <input
                                value={last_name}
                                onChange={e => this.setState({ last_name: e.target.value })}
                                type="text"
                                placeholder="Your last name"
                            />
                            <input
                                value={first_name}
                                onChange={e => this.setState({ first_name: e.target.value })}
                                type="text"
                                placeholder="Your last name"
                            />
                        </React.Fragment>
                    )}
                    <input
                        value={email}
                        onChange={e => this.setState({ email: e.target.value })}
                        type="text"
                        placeholder="Your email address"
                    />
                    <input
                        value={password}
                        onChange={e => this.setState({ password: e.target.value })}
                        type="password"
                        placeholder="Choose a safe password"
                    />
                </div>
                <div className="">
                    <Mutation
                        mutation={this.state.login ? LOGIN_MUTATION : SIGNUP_MUTATION}
                        variables={{ email, password, first_name, last_name }}
                        onCompleted={data => this._confirm(data)}
                    >
                        {mutation => (
                            <div className="" onClick={mutation}>
                                {this.state.login ? 'login' : 'create account'}
                            </div>
                        )}
                    </Mutation>
                    <div
                        className=""
                        onClick={() => this.setState({ login: !login })}
                    >
                        {login
                            ? 'need to create an account?'
                            : 'already have an account?'}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Login);