import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class ErrorBound extends Component {

    static getDerivedStateFromError (error) {

        console.log(error)


    }

    render() {
        return (
            <div>
                
            </div>
        );
    }
}

export default ErrorBound
