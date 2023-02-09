import React, {useContext, useEffect} from 'react'

import {
    Link
} from "react-router-dom";
import { MapDataContext } from '../context/MapDataContext';

function HomeButton({event_func, notebook_type_abbrev}) {

    const MDC = useContext(MapDataContext)


    useEffect(() => {
        if (window.location.pathname == "/map/home") {
            console.log("HOME!!!!!")
        }
    }, [])

    function returnTo(e) {

        MDC.mapState.theMap.reset()
    
    }

    return (
        <>
        
            {MDC.mapState.info_pane && window.innerWidth > 768 ?
                <div data-bal="Home" id="return_to" className={String('wl-item ') + String(notebook_type_abbrev === false ? " wl-active " : "")} onClick={returnTo} >
                    &lt;
                </div>
            :
            
            <Link id="home" data-bal="home" className={String('wl-home ') + String(MDC.mapState.notebook_type_abbrev === "hom" ? " wl-active " : "")} onClick={event_func} to={"/map/home" + window.location.search}>
                <div>
                    <svg className="no-evt" xmlns="http://www.w3.org/2000/svg" width="30.804" height="28" stroke="blue"viewBox="0 0 214.804 218.484">
                        <line id="Line_3" data-name="Line 3" y2="20" transform="translate(147.39 16.39)" fill="none" stroke={MDC.mapState.notebook_type_abbrev === "hom" ? "#eee" : "#51a5ff"} strokeWidth="12"/>
                        <line id="Line_4" data-name="Line 4" y2="127" transform="translate(17.89 85.39)" fill="none" stroke={MDC.mapState.notebook_type_abbrev === "hom" ? "#eee" : "#51a5ff"} strokeLinecap="round" strokeWidth="12"/>
                        <line id="Line_5" data-name="Line 5" x2="2" y2="127" transform="translate(194.89 85.39)" fill="none" stroke={MDC.mapState.notebook_type_abbrev === "hom" ? "#eee" : "#51a5ff"} strokeLinecap="round" strokeWidth="12"/>
                        <line id="Line_6" data-name="Line 6" x2="59" transform="translate(17.89 212.39)" fill="none" stroke={MDC.mapState.notebook_type_abbrev === "hom" ? "#eee" : "#51a5ff"} strokeLinecap="round" strokeWidth="12"/>
                        <line id="Line_7" data-name="Line 7" x1="59" transform="translate(137.89 212.39)" fill="none" stroke={MDC.mapState.notebook_type_abbrev === "hom" ? "#eee" : "#51a5ff"} strokeLinecap="round" strokeWidth="12"/>
                        <line id="Line_8" data-name="Line 8" y1="65" transform="translate(76.89 147.39)" fill="none" stroke={MDC.mapState.notebook_type_abbrev === "hom" ? "#eee" : "#51a5ff"} strokeLinecap="round" strokeWidth="12"/>
                        <line id="Line_9" data-name="Line 9" y1="65" transform="translate(137.89 147.39)" fill="none" stroke={MDC.mapState.notebook_type_abbrev === "hom" ? "#eee" : "#51a5ff"} strokeLinecap="round" strokeWidth="12"/>
                        <line id="Line_10" data-name="Line 10" x2="61" transform="translate(76.89 147.39)" fill="none" stroke={MDC.mapState.notebook_type_abbrev === "hom" ? "#eee" : "#51a5ff"} strokeLinecap="round" strokeWidth="12"/>
                        <line id="Line_11" data-name="Line 11" x1="45" transform="translate(147.39 16.39)" fill="none" stroke={MDC.mapState.notebook_type_abbrev === "hom" ? "#eee" : "#51a5ff"} strokeLinecap="round" strokeWidth="12"/>
                        <line id="Line_12" data-name="Line 12" y1="73" x2="99" transform="translate(8.39 8.39)" fill="none" stroke={MDC.mapState.notebook_type_abbrev === "hom" ? "#eee" : "#51a5ff"} strokeLinecap="round" strokeWidth="12"/>
                        <line id="Line_13" data-name="Line 13" x2="40" y2="28" transform="translate(107.39 8.39)" fill="none" stroke={MDC.mapState.notebook_type_abbrev === "hom" ? "#eee" : "#51a5ff"} strokeLinecap="round" strokeWidth="12"/>
                        <line id="Line_16" data-name="Line 16" x1="1" y1="55" transform="translate(192.39 16.39)" fill="none" stroke={MDC.mapState.notebook_type_abbrev === "hom" ? "#eee" : "#51a5ff"} strokeLinecap="round" strokeWidth="12"/>
                        <line id="Line_18" data-name="Line 18" x2="13" y2="10" transform="translate(193.39 71.39)" fill="none" stroke={MDC.mapState.notebook_type_abbrev === "hom" ? "#eee" : "#51a5ff"} strokeLinecap="round" strokeWidth="12"/>
                    </svg>
                </div>
            </Link>  

            }

        </>
    )
}

export default HomeButton
