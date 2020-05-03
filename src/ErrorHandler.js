import React, { Component } from "react";
import PropTypes from 'prop-types'

export default class ErrorHandler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <h2>Currently unavailable. Please contact Admin</h2>;
        }
        return this.props.children;
    }
}

ErrorHandler.propTypes={
	children: PropTypes.oneOfType([
		PropTypes.node,
		PropTypes.array,
		PropTypes.object
	])
}

