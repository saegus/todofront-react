import React, { Component } from 'react';

import './style.css';

class ModalContent extends Component {
    render() {
        return (
            <div id={ this.props.id} className="modal-content" onClick={e => e.stopPropagation()}>
                {this.props.children}
            </div>
        )
    }
}

export default ModalContent;