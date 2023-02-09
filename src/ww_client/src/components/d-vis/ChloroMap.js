import React, { Component } from 'react';
import DoChloroMap from '../../charts/do-chloro-map';
import DataHog from '../../helpers/DataHog';

import '../../styles/index.css';

class ChloroMap extends Component {

    constructor (props) {
        super(props);
        this.state = {
            //
        }
        this.hog = new DataHog();
        this.the_map = new DoChloroMap
        this.data_objects = {}
        this.curCountyFill = "";

    }

    componentDidMount () {
        // Collect map components once async (promise) resolves
        this.data_objects = this.the_map.drawMap("col").then(function(res) {
            return res;
        });

        // this.setupTheBomb();

    }

    updateMap(e) {
        e.preventDefault();
        
        Array.from(document.getElementsByClassName('button-i')).forEach((el) => {
            el.classList.remove('active');
        });
        e.target.classList.add('active');
        this.the_map.updateMap(e.target.id);
    }

    render() {
        return (
            <div id="main-wrapper" className="main-wrapper">
                <div id="tip-description" className="mod-major">
                    <div id="mod-major-titles">

                    </div>    

                    {/* Buttons */}
                    <div className="mod-btn" id="exit-mod"><p className="text exit-text">Exit</p></div>
                    <div className="mod-btn" id="analyze-mod"><p className="text exit-text">Analyze</p></div>
                    <div className="mod-btn" id="city-mod"><p className="text city-text">Cities</p></div>
                    <div className="mod-btn" id="save-mod"><p className="text save-text">Save</p></div>
                </div>
                <div id="button-box" className="button-box">
                    <div className="bg bg-1">

                        <div className="title-contents">

                            <h3 className="bg-title">Cost of Living</h3>

                        </div>

                        <div className="bg-contents">
                            <a id="col" className="button-i" onClick={this.updateMap.bind(this)}>Average</a>
                        </div>

                    </div>

                    <div className="bg bg-2">

                        <div className="title-contents">
                            <h3 className="bg-title">Average Rent Prices</h3>
                        </div>

                        <div className="bg-contents">
                        
                            <a id="rav_any" className="button-i" onClick={ this.updateMap.bind(this)}>All Rent</a>
                            <a id="rav_0" className="button-i" onClick={ this.updateMap.bind(this)}>Studio</a>
                            <a id="rav_1" className="button-i" onClick={ this.updateMap.bind(this)}>1 Bed</a>
                            <a id="rav_2" className="button-i" onClick={ this.updateMap.bind(this)}>2 Bed</a>
                            <a id="rav_3" className="button-i" onClick={ this.updateMap.bind(this)}>3 Bed</a>
                            <a id="rav_4" className="button-i" onClick={ this.updateMap.bind(this)}>4 Bed</a>

                        </div>

                    </div>

                </div>



                <div id="chloro-map-wrapper">

                    <div id="chloro-tooltip" className="chloro-tooltip">
                        <div className="chloro-tooltip-country" id="country"></div>
                        <div className="chloro-tooltip-value">
                            <div id="tooltip-name-title"><span id="county_name_tip" className="nameTip"></span><span id="state_name_tip" className="nameTip"></span></div>
                            <p>  
                                <span id="chloro-value-title"></span>:&nbsp;<span id="chloro-value"></span>
                            </p>
                        </div>
                    </div>

                </div>
                
                
                
           </div>
           
        );
    }
}

export default ChloroMap;