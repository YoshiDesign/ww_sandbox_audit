import React, { useContext, useState } from 'react';
// import { MapDataContext } from '../../context/MapDataContext'
import DoMaptwo from "../../charts/do-maptwo";
import '../../styles/index.css';

import {Log} from '../../App'

const the_map = new DoMaptwo

/**
 * Options Wishlist
 * Disable Zoom on Click
 */
function updateMap (e) {
    e.preventDefault();
    
    // Return buttons to inactive styles
    Array.from(document.getElementsByClassName('button-i')).forEach((el) => {
        el.classList.remove('active');
    });

    // Activate the clicked btn
    e.target.classList.add('active');

    the_map.updateMap(e.target.id);

}

/**
 * Temporary placement for Options
 */


function MapTwo (props) {
    
    // const mapContext = useContext(MapDataContext)
    useState ( () => {

        // mapContext.setMap('COL')
        // Collect map components once async (promise) resolves
        the_map.makemap("col").then(res => {

            console.log("Success Data - COL Map")
            console.log("Updating COL Map...")

        }).catch( err => {
            console.log(`Error loading Map COL -- ${err}`)
        });

    }, [])

    return (
        <>
        <Log name="USA Map" />
            <div id="map-container">
            
                <div id="chloro-tooltip" className="chloro-tooltip">
                    <div className="chloro-tooltip-country" id="country"></div>
                    <div className="chloro-tooltip-value">
                        <div id="tooltip-name-title">
                            <span id="county_name_tip" className="nameTip"></span>
                            <span id="state_name_tip" className="nameTip"></span>
                        </div>
                        <p>  
                            <span id="chloro-value-title"></span>:&nbsp;<span id="chloro-value"></span>
                        </p>
                    </div>
                </div>

            </div>
            
        </>
    );
}


export default React.memo(MapTwo);