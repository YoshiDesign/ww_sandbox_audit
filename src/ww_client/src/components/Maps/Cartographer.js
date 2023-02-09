import React, { useContext, useEffect, useState, memo } from 'react'
import { MapDataContext } from '../../context/MapDataContext'
import {getCurrentCountryFromString, drawAnyMap} from './utils/utils'

import Nation from './Nation'
import Globe from './Globe'

/**
 * This component is responsible for rendering
 * different types of interactive projections
 * @returns
 */
function Cartographer() {

    const MDC = useContext(MapDataContext)
    // const [cur_country, set_cur_country] = useState("/")


    // The country has changed
    // useEffect(() => {

    //     console.log("Cartographer [MDC.mapState.currentCountry]")

    //     // This only includes maps that render individual countries
    //     if(!window.location.pathname.includes("/creators")) {
    //         if (MDC.mapState.currentCountry !== cur_country) {

    //             // set_cur_county to track latest selection
    //             set_cur_country(MDC.mapState.currentCountry)
    
    //             // There's a map that needs a' renderin'
    //             if (MDC.mapState.currentCountry !== "") {
    //                 drawAnyMap(MDC.mapState.currentCountry, MDC.mapState, MDC.mapDispatch, MDC.census, MDC.updateCensus)
    //             }
    //         }
    //     }

    // }, [MDC.mapState.currentCountry])

    return (

        <div id="map-wrapper">

            <>

                {MDC.mapState.mapType == "globe" ?
                    <Globe></Globe>
                : null }

                {MDC.mapState.mapType == "country" ? 
                    <Nation></Nation>
                : null }

            </>

        </div>

    )
}

export default memo(Cartographer)