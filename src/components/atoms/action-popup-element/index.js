import React, { Component } from 'react';

import './style.css';

class ActionPopupElement extends Component {
    render() {
        return (
            <div className="action-popup-element">
                {this.props.children}
            </div>
        )
    }
}

export default ActionPopupElement;