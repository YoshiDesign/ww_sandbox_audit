import React, {useContext, useState, useEffect} from 'react'
import { MapDataContext } from '../../context/MapDataContext'
import { throttle } from '../utils/utils'
import {doButtons, sendStatRequest} from '../../helpers/stats/statHelper'

function WorkStatSlide(props) {

    const [btn_states, setButtonStates] = useState({
        "ex0": 0,
        "ex1": 0,
        "ex2": 0,
        "pk" : 0,
        "em" : 0,
    })

    const MDC = useContext(MapDataContext)

    return (

        <>

            {/* If we're missing data for this occupation, don't render any buttons */}
            {MDC.mapState.notebooks.occ_notebook['error'] || MDC.mapState.notebooks.occ_notebook['avg_an'] == 0 ? 
                null
            :
                <>
                    <a id={MDC.mapState.ids.ex0} className={MDC.mapState.stats.stat_1 == MDC.mapState.ids.ex0 ? "button-i ob-1 bActive" : "button-i ob-1"}
                        onClick={
                            function(e){

                                if (doButtons(e.target.id, btn_states, MDC.mapDispatch))
                                {
                                    throttle(
                                        sendStatRequest,
                                        500,
                                        {MDC: MDC, actionType: "DATA", actionSet:"WFC", query_id: e.target.id}
                                    )
                                }
                            }
                        }
                        
                    >Salary - Newbie 
                    <span className="sw-info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 294.873 340.584">
                            <path  data-name="Exclusion 1" d="M0,339.287H0V0L293.374,169.063,0,339.286ZM31.193,60.061V279.226L228.037,168.667Z" transform="translate(0.5 0.865)" fill="white" stroke="#009cff" strokeWidth="6"/>
                        </svg>
                    </span></a>
                    <a id={MDC.mapState.ids.ex1} className={MDC.mapState.stats.stat_1 == MDC.mapState.ids.ex1 ? "button-i ob-1 bActive" : "button-i ob-1"}
                        onClick={
                            function(e){

                                if (doButtons(e.target.id, btn_states, MDC.mapDispatch))
                                {
                                    throttle(
                                        sendStatRequest,
                                        500,
                                        {MDC: MDC, actionType: "DATA", actionSet:"WFC", query_id: e.target.id}
                                    )
                                }

                            }
                        }
                    >Salary - Associate
                    <span className="sw-info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 294.873 340.584">
                            <path  data-name="Exclusion 1" d="M0,339.287H0V0L293.374,169.063,0,339.286ZM31.193,60.061V279.226L228.037,168.667Z" transform="translate(0.5 0.865)" fill="white" stroke="#009cff" strokeWidth="6"/>
                        </svg>
                    </span>
                    </a>
                    <a id={MDC.mapState.ids.ex2} className={MDC.mapState.stats.stat_1 == MDC.mapState.ids.ex2 ? "button-i ob-1 bActive" : "button-i ob-1"}
                        onClick={
                            function(e){

                                if (doButtons(e.target.id, btn_states, MDC.mapDispatch))
                                {
                                    throttle(
                                        sendStatRequest,
                                        500,
                                        {MDC: MDC, actionType: "DATA", actionSet:"WFC", query_id: e.target.id}
                                    )
                                }
                                
                            }
                        }

                    >Salary - Senior

                    <span className="sw-info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 294.873 340.584">
                            <path  data-name="Exclusion 1" d="M0,339.287H0V0L293.374,169.063,0,339.286ZM31.193,60.061V279.226L228.037,168.667Z" transform="translate(0.5 0.865)" fill="white" stroke="#009cff" strokeWidth="6"/>
                        </svg>
                        </span>
                    </a>

                    <a id={MDC.mapState.ids.em} className={MDC.mapState.stats.stat_1 == MDC.mapState.ids.em ? "button-i ob-1 bActive" : "button-i ob-1"}
                        onClick={
                            function(e){

                                if (doButtons(e.target.id, btn_states, MDC.mapDispatch))
                                {
                                    throttle(
                                        sendStatRequest,
                                        500,
                                        {MDC: MDC, actionType: "DATA", actionSet:"WFC", query_id: e.target.id}
                                    )
                                }

                            }
                        }
                    >Total Employed
                    <span className="sw-info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 294.873 340.584">
                            <path  data-name="Exclusion 1" d="M0,339.287H0V0L293.374,169.063,0,339.286ZM31.193,60.061V279.226L228.037,168.667Z" transform="translate(0.5 0.865)" fill="white" stroke="#009cff" strokeWidth="6"/>
                        </svg>
                        </span>
                    </a>
                    <a id={MDC.mapState.ids.pk} className={MDC.mapState.stats.stat_1 == MDC.mapState.ids.pk ? "button-i ob-1 bActive" : "button-i ob-1"}
                        onClick={
                            function(e){

                                if (doButtons(e.target.id, btn_states, MDC.mapDispatch))
                                {
                                    throttle(
                                        sendStatRequest,
                                        500,
                                        {MDC: MDC, actionType: "DATA", actionSet:"WFC", query_id: e.target.id}
                                    )
                                }

                            }
                        }
                    >Jobs/1000
                    <span className="sw-info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 294.873 340.584">
                            <path  data-name="Exclusion 1" d="M0,339.287H0V0L293.374,169.063,0,339.286ZM31.193,60.061V279.226L228.037,168.667Z" transform="translate(0.5 0.865)" fill="white" stroke="#009cff" strokeWidth="6"/>
                        </svg>
                    </span>
                    </a>
                </>
            }
        </>
    )
}

export default WorkStatSlide
