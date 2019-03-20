import React, { Component } from 'react';

import './style.css';

class ActionPopupHeader extends Component {
    render() {
        return (
            <div className="action-popup-header">
                {this.props.children}
            </div>
        )
    }
}

export default ActionPopupHeader;