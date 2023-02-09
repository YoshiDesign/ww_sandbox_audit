// import React, { useEffect, useContext } from "react"
// import * as d3 from 'd3'
// import { callAccessor, color } from "../../utils/utils";
// import { MapDataContext } from '../../../context/MapDataContext'

// import { Log } from '../../../App'
// const path = d3.geoPath()
// const zoom = d3.zoom()
// /**
//  * County shapes to fill in the USA
//  */
// function CountyFeatures ({dimensions, mapdata, g, svg}) {

//     useEffect( () => {
        
//         console.log("USA -- Use Effect")

//         d3.selectAll('[fip]')
//             .on("mouseover", function(){
//                 d3.select(this)
//                     .attr('stroke', 'yellow')
//             })
//             .on("mouseout", function(){
//                 d3.select(this)
//                     .attr('stroke', 'none')
//             })

//         // var _g = d3.select(g.current)    
//         // _g
//         //     .call( zoom.scaleExtent([1, 8])
//         //     .on("zoom", zoomed))

        

//         console.log("[COUNTIES] Event listeners set")

//     }, [])

//     return (
//         <>
//         <Log name="Counties" />
//         {/* {
//             mapdata.map( (d, i)  => {
//                 // Turn the geometry feature into a topojson path
//                 let c_feat = path(d)

//                 // id = the fip code
//                 // fip = is only used as a selector

//                 return (
                
//                 <path key={i} fip={1} id={d.id} d={c_feat} stroke=""/>

//             )})
//         } */}

//         </>
//     )

// }

// export default React.memo(CountyFeatures)