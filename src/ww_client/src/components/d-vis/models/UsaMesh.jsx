import React, {useEffect} from "react"
import * as d3 from 'd3'

const path = d3.geoPath()

/**
 * State borders for the USA
 */
function UsaMesh ({mapdata}) {

    return (
        <>
            <path d={path(mapdata)} state="1" fill="none" stroke="#fff" />
        </>
    )

}

export default React.memo(UsaMesh)