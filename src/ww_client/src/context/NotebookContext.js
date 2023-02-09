import React, { useReducer, useEffect, useState } from 'react'
import { Log } from '../App'
import { apiFetchCountyInformation, updateColors, apiFetchAndUpdateStatistics, initMapObjects } from './utils'
import { notebookReducer } from './reducers/notebookReducer'

export const NotebookContext = React.createContext()

/**
 * The initial state given to our Map Reducuer
 */
const initState =  { 

}

export function MapDataProvider (props) {

    const [notebookState, notebookDispatch] = useReducer(notebookReducer, initState)

    return (
        <>
            {/* mapState and mapDispatch come from  */}
            {/* const [mapState, mapDispatch] = useReducer(reducer, initState) */}
            {/* Located in MainsChart.js */}
            <NotebookContext.Provider value={{notebookState: notebookState, notebookDispatch: notebookDispatch}}>

                <Log name="NotebookContext" />

            { mapState.loading ? 
                <>
                    <div className="c-wrapper Lw">
                        <div className="bwa L L1"></div>
                        <div className="bwa L L2"></div>
                        <div className="bwa L L3"></div>
                        <div className="bwa L L4"></div>
                        <div className="bwa L L5"></div>
                    </div>
                    <div className="c-wrapper">
                        <p className="Ltxt">Launching the map...</p>
                    </div>
                    <div className="c-wrapper Lw2">
                        <div className="bwa L L1"></div>
                        <div className="bwa L L2"></div>
                        <div className="bwa L L3"></div>
                        <div className="bwa L L4"></div>
                        <div className="bwa L L5"></div>
                    </div>
                </>
            :
                <>
                    {/* <Log name="MapData Provider" /> */}
                    {props.children}
                </>
                }
            </NotebookContext.Provider>
        </>
    )
}
