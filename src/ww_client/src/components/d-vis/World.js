import React, { Component } from 'react';
import DoWorld from '../../charts/do-world';

import '../../styles/06-world.css';

class SpinningPie extends Component {

    constructor (props) {
        super(props);
        this.state = {
            //
        }
        
    }

    componentDidMount() {
        new DoWorld().drawMap();
    }

    render() {
        return (
           <div className="world-wrapper" id="world-wrapper">

                <div id="world-tooltip" className="world-tooltip">
                    <div className="world-tooltip-country" id="country"></div>
                    <div className="world-tooltip-value">
                        <span id="world-value"></span> population change
                    </div>
                </div>

           </div>
        );
    }

}

export default SpinningPie;