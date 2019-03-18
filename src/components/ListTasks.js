import React from 'react';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import '../App.css';

const LIST_TASKS = gql`
    query {
        users {
            id
            last_name
            first_name
            taskslists {
                id
                label,
                tasks {
                    description
                    status
                }
            }
        }
    }
`

export default () => (
    <Query query={LIST_TASKS}>
        {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error...</p>;

            return (
                <div className="col-sm-12">
                    {!loading &&
                        data.users.map(user => (
                            <div className="col-sm-4" key={user.id}>
                                <div className='pa3 bg-black-05 ma3'>
                                    <ul>
                                        <li>{ JSON.stringify(user)} </li>
                                        {/* { 
                                            Object.keys(user).map((key,i) => {
                                                return (<li key={i}> { key.split('_').join(' ').toUpperCase() } : { user[key]}</li>)   
                                            })
                                        } */}
                                    </ul>
                                </div>
                            </div>
                        ))}
                </div>
            );
        }}
    </Query>
);