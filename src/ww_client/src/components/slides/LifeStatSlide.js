import React, {useContext, useState, useEffect} from 'react'
import { MapDataContext } from '../../context/MapDataContext'
import {throttle} from '../utils/utils'
import { doButtons, sendStatRequest } from '../../helpers/stats/statHelper'

function LifeStatSlide() {

    const [btn_states, setButtonStates] = useState({
        "col": 0,
        "mhc": 0,
        "rav": 0,
        "r0": 0,
        "r1": 0,
        "r2": 0,
        "r3": 0,
        "r4": 0
    })

    const MDC = useContext(MapDataContext)

    return (
        <div>
            <a id={MDC.mapState.ids.col} className={MDC.mapState.stats.stat_1 == MDC.mapState.ids.col ? "bActive button-i ob-1" : "button-i ob-1"}
                onClick={
                    function(e){
                        if (doButtons(e.target.id, btn_states, MDC.mapDispatch)){
                            throttle(
                                sendStatRequest,
                                500,
                                {MDC: MDC, actionType: "DATA", actionSet:"COL", query_id: e.target.id, query_type: e.target.id}
                            )
                        }
                    }
                }
            >Overall Cost of Living
                <span className="sw-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 294.873 340.584">
                        <path  data-name="Exclusion 1" d="M0,339.287H0V0L293.374,169.063,0,339.286ZM31.193,60.061V279.226L228.037,168.667Z" transform="translate(0.5 0.865)" fill="white" stroke="#009cff" strokeWidth="6"/>
                    </svg>
                </span></a>
            <a id={MDC.mapState.ids.mhc} className={MDC.mapState.stats.stat_1 == MDC.mapState.ids.mhc ? "bActive button-i ob-1" : "button-i ob-1"}
                onClick={
                    function(e){
                        if (doButtons(e.target.id, btn_states, MDC.mapDispatch)){
                            throttle(
                                sendStatRequest,
                                500,
                                {MDC: MDC, actionType: "DATA", actionSet:"COL", query_id: e.target.id, query_type: e.target.id}
                            )
                        }
                    }
                }
            >Median Home Cost 
                <span className="sw-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 294.873 340.584">
                        <path  data-name="Exclusion 1" d="M0,339.287H0V0L293.374,169.063,0,339.286ZM31.193,60.061V279.226L228.037,168.667Z" transform="translate(0.5 0.865)" fill="white" stroke="#009cff" strokeWidth="6"/>
                    </svg>
                </span></a>
            <a id={MDC.mapState.ids.rav} className={MDC.mapState.stats.stat_1 == MDC.mapState.ids.rav ? "bActive button-i ob-1" : "button-i ob-1"}
                onClick={
                    function(e){
                        if (doButtons(e.target.id, btn_states, MDC.mapDispatch)){
                            throttle(
                                sendStatRequest,
                                500,
                                {MDC: MDC, actionType: "DATA", actionSet:"COL", query_id: e.target.id, query_type: e.target.id}
                            )
                        }
                    }
                }
            >Average Rent Cost
                <span className="sw-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 294.873 340.584">
                        <path  data-name="Exclusion 1" d="M0,339.287H0V0L293.374,169.063,0,339.286ZM31.193,60.061V279.226L228.037,168.667Z" transform="translate(0.5 0.865)" fill="white" stroke="#009cff" strokeWidth="6"/>
                    </svg>
                </span></a>
            <a id={MDC.mapState.ids.r0} className={MDC.mapState.stats.stat_1 == MDC.mapState.ids.r0 ? "bActive button-i ob-1" : "button-i ob-1"}
                onClick={
                    function(e){
                        if (doButtons(e.target.id, btn_states, MDC.mapDispatch)){
                            throttle(
                                sendStatRequest,
                                500,
                                {MDC: MDC, actionType: "DATA", actionSet:"COL", query_id: e.target.id, query_type: e.target.id}
                            )
                        }
                    }
                }
            >Average Studio Apartment Rent Cost
                <span className="sw-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 294.873 340.584">
                        <path  data-name="Exclusion 1" d="M0,339.287H0V0L293.374,169.063,0,339.286ZM31.193,60.061V279.226L228.037,168.667Z" transform="translate(0.5 0.865)" fill="white" stroke="#009cff" strokeWidth="6"/>
                    </svg>
                </span></a>
            <a id={MDC.mapState.ids.r1} className={MDC.mapState.stats.stat_1 == MDC.mapState.ids.r1 ? "bActive button-i ob-1" : "button-i ob-1"}
                onClick={
                    function(e){
                        if (doButtons(e.target.id, btn_states, MDC.mapDispatch)){
                            throttle(
                                sendStatRequest,
                                500,
                                {MDC: MDC, actionType: "DATA", actionSet:"COL", query_id: e.target.id, query_type: e.target.id}
                            )
                        }
                    }
                }
            >Average 1 Bedroom Apartment Rent Cost
                <span className="sw-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 294.873 340.584">
                        <path  data-name="Exclusion 1" d="M0,339.287H0V0L293.374,169.063,0,339.286ZM31.193,60.061V279.226L228.037,168.667Z" transform="translate(0.5 0.865)" fill="white" stroke="#009cff" strokeWidth="6"/>
                    </svg>
                </span></a>
            <a id={MDC.mapState.ids.r2} className={MDC.mapState.stats.stat_1 == MDC.mapState.ids.r2 ? "bActive button-i ob-1" : "button-i ob-1"}
                onClick={
                    function(e){
                        if (doButtons(e.target.id, btn_states, MDC.mapDispatch)){
                            throttle(
                                sendStatRequest,
                                500,
                                {MDC: MDC, actionType: "DATA", actionSet:"COL", query_id: e.target.id, query_type: e.target.id}
                            )
                        }
                    }
                }
            >Average 2 Bedroom Rent Cost
                <span className="sw-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 294.873 340.584">
                        <path  data-name="Exclusion 1" d="M0,339.287H0V0L293.374,169.063,0,339.286ZM31.193,60.061V279.226L228.037,168.667Z" transform="translate(0.5 0.865)" fill="white" stroke="#009cff" strokeWidth="6"/>
                    </svg>
                </span></a>
            <a id={MDC.mapState.ids.r3} className={MDC.mapState.stats.stat_1 == MDC.mapState.ids.r3 ? "bActive button-i ob-1" : "button-i ob-1"}
                onClick={
                    function(e){
                        if (doButtons(e.target.id, btn_states, MDC.mapDispatch)){
                            throttle(
                                sendStatRequest,
                                500,
                                {MDC: MDC, actionType: "DATA", actionSet:"COL", query_id: e.target.id, query_type: e.target.id}
                            )
                        }
                    }
                }
            >Average 3 Bedroom Rent Cost
                <span className="sw-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 294.873 340.584">
                        <path  data-name="Exclusion 1" d="M0,339.287H0V0L293.374,169.063,0,339.286ZM31.193,60.061V279.226L228.037,168.667Z" transform="translate(0.5 0.865)" fill="white" stroke="#009cff" strokeWidth="6"/>
                    </svg>
                </span></a>
            <a id={MDC.mapState.ids.r4} className={MDC.mapState.stats.stat_1 == MDC.mapState.ids.r4 ? "bActive button-i ob-1" : "button-i ob-1"}
                onClick={
                    function(e){
                        if (doButtons(e.target.id, btn_states, MDC.mapDispatch)){
                            throttle(
                                sendStatRequest,
                                500,
                                {MDC: MDC, actionType: "DATA", actionSet:"COL", query_id: e.target.id, query_type: e.target.id}
                            )
                        }
                    }
                }
            >Average 4 Bedroom Rent Cost
                <span className="sw-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 294.873 340.584">
                        <path  data-name="Exclusion 1" d="M0,339.287H0V0L293.374,169.063,0,339.286ZM31.193,60.061V279.226L228.037,168.667Z" transform="translate(0.5 0.865)" fill="white" stroke="#009cff" strokeWidth="6"/>
                    </svg>
                </span></a>
    </div>
    )
}

export default LifeStatSlide
