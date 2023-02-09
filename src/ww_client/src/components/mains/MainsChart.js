import React from 'react';
import Cartographer from '../Maps/Cartographer'
import Legend from './map_tools/Legend'
import NautFooter from './navigator/mobile/NautFooter'
import PaneContainer from './navigator/mobile/nautilus/PaneContainer'
// import NotebookOccupations from './notebook/NotebookOccupations'
// import NotebookLocations from './notebook/NotebookLocations'
// import { useWindowSize } from '../../helpers/functional/windowHook'

import LineCursor from './tools/LineCursor'
import _404 from '../error_boundaries/_404'
import { MapDataProvider } from '../../context/MapDataContext'
import { Log } from '../../App'

import {
    Route, 
    Switch,
  } from "react-router-dom";

function MainsChart () {

    return (

        <div className="container" id="contain-ref">

            <Log name="<MainsChart>"/>

            <MapDataProvider init="COL" >
                <Switch>

                    <Route path="/map/">

                        {/* Map mouse hover tooltips */}
                        <LineCursor />
                        
                        {/* Renders maps */}
                        <Cartographer />
                        
                        <>
                            {/* Mobile Menu */}
                            {window.innerWidth <= 768 ?
                                <>
                                    <PaneContainer />
                                    {/* Buttons */}
                                    <NautFooter />
                                </>
                            :null} 
                        </> 
                        <Legend />

                    </Route>

                    <Route>
                        <_404 />
                    </Route>

                </Switch>
            </MapDataProvider>
        </div>
    );
}
export default React.memo(MainsChart);