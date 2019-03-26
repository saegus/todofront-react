import React, { Component } from 'react';

import './style.css';

class Modal extends Component {
    constructor(props) {
        super(props);
        console.log(this.props)
    }
    render() {
        return (
            <div className="Modal" id={this.props.id} onClick={this.props.onBodyClick }>
                { this.props.children }
            </div>
        )
    }
}

export default Modal;