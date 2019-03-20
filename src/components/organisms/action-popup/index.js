import React, { Component } from 'react';

import './style.css';

class ActionPopup extends Component {
    render() {
        return (
            <div className="action-popup" {...this.props }>
                { this.props.children }
            </div>
        )
    }
}

export default ActionPopup;