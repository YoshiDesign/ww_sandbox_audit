import axios from 'axios'

export const colors = ["#007bff", "#ff2a2d", "#0df25e", "#7800f5", "#ff7d00", "#542806", "#e2ff00", "#00ff80", "#4b4b6b", "#5ac8c8"]

export function fetchNationStatCategory(category, graph_key, updateGraphData, graphData, country_code, cats_fetched, update_cats_fetched) {

    console.log("Querying Category: ", category)

    axios.get(`/api/datas/nationStatsCategory?cat_code=${category}&cc=${country_code}`, {
        proxy: {
            host: 'localhost',
            port: 4000
        }
    }).then( res => {

        // No info
        if (res.data.error) {
            console.log("Error... utils/fetchNationStatCategory")
            return
        }

        let _new = {}       // To add a specific data series to graphData
        let q = null        // To extract the specific data series from a category  (added to _new)
        let _cat = {}       // To add an entire category to cats_fetched
        let d = {}          // To acquire the contents of an entire category        (added to _cat)

        for (let item of res.data[category]) {
            d[item.code] = item.data

            if (item.code == graph_key) {
                q = item.data
            }

        }
        
        _new[graph_key] = q
        updateGraphData({...graphData, ..._new})

        _cat[category] = d
        update_cats_fetched({...cats_fetched, ..._cat})

    })
    
}

// /**
//  * Update the stat buffer and retrieve new datasets
//  * Keep in mind that even though we're querying for 2 datapoints, they come from the same
//  * dataset, so no matter how many stats occupy the statBuffer, this only makes 1 DB request.
//  * TODO - Cacheing the results is just a cool thing to do. Check localstore before punting to the server,
//  *        Because I anticipate these metrics to be queried most frequently in the context of WFC data
//  * @param {*} requestType 
//  * @param {*} statType 
//  * @param {*} purge     -- Some stats aren't overlapping by design, e.g. salary info. We don't create a bivariate with 2 salary metrics atm
//  * @param {*} purgeKey  -- If stat_n.includes(purgeKey) remove it from the stat_buffer before we do anything
//  */
// export function alignStats (requestType, statType, purge=false, purgeKey="", from_id="") {

//     console.log("-- Align Stats --")

//     // Get the current state of variables
//     let stats = MDC.mapState.stats
//     let refetch = 0

//     if (purge) {
//         // Remove the purgeKey
//         stats = purgeBuffer(stats, purgeKey)
//         if (statType == null && from_id != CLEAR_KEY) {
//             // New key
//             statType = purgeKey + document.getElementById(from_id).value
//         }
//     }

//     if (from_id == CLEAR_KEY && purge && purgeKey) {
//         // Do nothing
//     }
//     else {
//         // Determine the stats to be drawn on the map
//         stats = assignStats(statType, stats, hasExperienceStat(stats))
//     }

//     // Deactivate every button
//     setLPState({...LPState, ...resetLPState("reset", false)})

//     if (allNull(stats)) {
//         // Don't recolor the map, this will remove all colors
//         refetch = 0
//     }
//     else {
//         refetch = 1
//         let update = Object.assign({}, resetLPState())
//         for (let k of Object.values(stats)) {
//             if (k) update[k] = true
//         }

//         setLPState({...LPState, ...update})

//         /* *
//         * Set the nautilus.state.colorswatch
//         * render the proper swatch.
//         * 
//         * Why the nautilus knows about the maps colors and not the MDC is beyond me at the present moment. Who cares, press onward
//         */
//         // if (hasNull(stats)) {
//         //     MDC.mapDispatch({colorswatch:[props.nautilusState.colorswatch[0], "monovar"]}) 
//         // } else {
//         //     MDC.mapDispatch({colorswatch:[props.nautilusState.colorswatch[0], "bivariate"]}) 
//         // }

//     }

//     // Alter the Map's global state, prompting a FETCH OF NEW DATA based on our selection.
//     // The returned data is specifically allocated within its data structure.
//     MDC.mapDispatch({
//         ...MDC.mapState,
//         refetch: refetch,
//         type: "DATA",
//         mapdataset : requestType, // mapdataset determines which server route the data is sent to (e.g. "WFC" or "COL")
//         stats: stats,
//         v_1: stats.stat_1 || null,
//         v_2: stats.stat_2 || null,
//     })

// }