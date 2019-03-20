import React, { Component } from 'react';

import './style.css';

class ActionPopupContainer extends Component {
    render() {
        return (
            <div id={ this.props.id }className={`action-popup-container ${ this.props.open ? 'action-popup-container--open' : 'action-popup-container--closed'}`}>
                {this.props.children}
            </div>
        )
    }
}

export default ActionPopupContainer;