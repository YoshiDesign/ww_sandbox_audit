 /**
  * RadarChart   
  * Originally written by Nadieh Breme
  * Released under MIT License
  * Copyright (c) 2013 Mark Otto.
  * Copyright (c) 2017 Andrew Fong.
  * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
  * associated documentation files (the "Software"), to deal in the Software without restriction, including without 
  * limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, 
  * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  * 
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE 
  * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR 
  * IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  */

import React from 'react';

import { Log } from '../../App'

/**
 * A Radar plot that also contains an interactive list of cities
 * which alter its displayed data
 */
const Radar = React.memo( () => {

    return (

        <div className="radarField">
            <Log name="RADAR" />
            <div id="radar_1" className="radarChart"></div>
            <div className="radarForm">

                <section className="c-list-h">
                    <h3 className="inl-h">Cities &amp; Towns <span id="cc"></span></h3>{/*<button className="fr inl-h aux-btn">Save City</button> */}
                </section>

                <div id="city-radar-list" className="s-list">

                </div>

            </div>
        </div>
    )
})

export default Radar