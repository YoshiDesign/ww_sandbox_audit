// import React, { useEffect, useContext } from 'react'
// import {Log} from '../../App'
// import { MapDataContext } from '../../context/MapDataContext'
// import { MakeWorkforce } from '../../charts/ww-workforce'

// const initState = {
//     data_type  : 1,
//     color_swatch : 1,
//     fetch_data : 1,
//     occ_code   : "112011"
// }



// // const reducer = (state, action) => {
// //     switch(action.type) {
// //         case 1 : // Change occupation statistic
// //             return {
                
// //             }
// //         case 2 : // Change occupation
// //             return {
// //                 loading: false,
// //                 error: true,
// //                 initialized: false
// //             }
// //         default:
// //             return state
        
// //     }
// // }

// const Workforce = new MakeWorkforce

// function updateMap(stat, occu, color, fetch) {


//     let options = {
//         data_type  : stat,
//         color_swatch : color,
//         fetch_data : fetch,
//         occ_code   : occu
//     }

//     console.log(`Updating w/ options ${options}`)

//     Workforce.updateMap(options).then( rdy => {
//         console.log("Successful Update -- MAP THREE")


//     }).catch( err => {
//         console.log("Failed to initialize BV3", err)

//     })
//     return 0;
// }

// export function WorkforceOptions (props) {

//     const stat = React.useRef()
//     const occu = React.useRef()
//     const color = React.useRef()
//     var options = {}

//     return (
//         <div className="bg bg-2">

//             <Log name="optionsWorkforce" />

//             <div className="title-contents">
//                 <h3 className="bg-title">Options</h3>
//             </div>

//             <div className="bg-contents">
//                 <select ref={stat} onChange={e => updateMap(e.target.value, occu.current.value, color.current.value, true)}>
//                     <option value="1">LoQuo &amp; Per1k</option>
//                     <option value="2">LoQuo &amp; TotalEmp</option>
//                     <option value="3">Per1k &amp; TotalEmp</option>
//                     <option value="4">LoQuo</option>
//                     <option value="5">Per1k</option>
//                     <option value="6">Total Employed</option>
//                 </select>

//                 {/* No need to refetch data when changing color --> fetch_data : false */}
//                 <select ref={color} onChange={e => updateMap(stat.current.value, occu.current.value, e.target.value, false)}>
//                     <option value="1">color 1</option>
//                     <option value="2">color 2</option>
//                     <option value="3">color 3</option>
//                     <option value="4">color 4</option>
//                     <option value="5">color 5</option>
//                 </select>

//                 <select ref={occu} onChange={e => updateMap(stat.current.value, e.target.value, color.current.value, true)}>
//                     <option value="112011">112011</option>
//                     <option value="132072">132072</option>
//                     <option value="113051">113051</option>
//                     <option value="519061">519061</option>
//                     <option value="470000">470000</option>
//                     <option value="291181">291181</option>
//                     <option value="119013">119013</option>
//                     <option value="430000">430000</option>
//                 </select>
//             </div>

//         </div>

//     )
// }

// /**
//  * Memoized -see the export statement- Re-rendering is based on a shallow comparison
//  */
// function MapJobDensity() {
    
//     // const [state, dispatch] = useReducer(reducer, initState)
//     const mapContext = useContext(MapDataContext)
    
//     useEffect( () => {
        
//         // mapContext.setMap("WFC")

//         Workforce.makeMap(initState).then( rdy => {

//             console.log("Successful data -- MAP THREE")

//         }).catch( err => {

//             console.log("Failed to initialize BV3", err)

//         })

//     }, [])

//     return (
//         <>
//             <div id="mapThreeAnchor">
//                 <Log name="mapThree" />
//             </div>
//         </>
//     )
// } 

// export default React.memo(MapJobDensity)
