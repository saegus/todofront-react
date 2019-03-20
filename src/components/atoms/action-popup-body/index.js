import React, { Component } from 'react';

import './style.css';

class ActionPopupBody extends Component {

    render() {
        return (
            <div className="action-popup-body">
                {this.props.children}
            </div>
        )
    }
}

export default ActionPopupBody;