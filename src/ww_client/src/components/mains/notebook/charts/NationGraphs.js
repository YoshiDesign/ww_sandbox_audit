import React, {useEffect, useState, useContext} from 'react'
import {nation_stat_categories} from '../utils/lookup_tables'
import {fetchNationStatCategory} from '../utils/utils'
import {MapDataContext} from '../../../../context/MapDataContext'
import GraphSystem from './GraphSystem'
/**
 * Child component of MapDataContext.js (the MDC!)
 * This component is responsible for rendering the line charts for nation timeseries data.
 * Both NotebookCountry.js AND this class receive [nationGraphs, updateNationGraphs] from the MDC
 * 
 * - A stat is clicked and graphs is updated in NotebookCountry
 * - This component receives graphs (from MDC) and renders a line plot series based on the data provided therein.
 * 
 * There are 7 categories: Population, energy, education, miscellaneous, economics, tech, trade.
 * Currently, when any one stat is selected, ALL of the data from its category is fetched from MDB, even if the user will never use it.
 * [See lookup_tables.js]
 * 
 */
function NationGraphs({graphs, updateGraphs}) {

    // For reference to what's what: 
    // props.graphs (above) : ["ST.INT.DPRT", "ST.INT.ARVL", "ST.POP.DNST" ...]         Just an array of graph_keys. These are the ones being painted to the chart. Updated by NotebookCountry, provided by MDC's useState
    // graphData : "ST.INT.DPRT": <data{"1960": 1234, "1961": 345, ... "2020": 214}>,   The graph_key being painted and all of its data
    // cats_fetched {"cat_1": {"ST.INT.DPRT": {"1960": 1234, "1961": 345, ... "2020": 214}}, "cat_2": {"1960": 123, ...}, ...}  Similar to graphData with one more external layer- each category. HOWEVER- this is EVERY category as they are fetched and EVERY data point it contains for every graph_key in it. If a user clicks on every category once, they will effectively have the entire dataset for the currently selected nation.

    const MDC = useContext(MapDataContext)

    // Store the fetched categories so we don't need to call the server anymore. 
    // Once one is retrieved, we can just get other timeseries data from it here.
    const [graphData, updateGraphData] = useState({})

    // Store the complete categories once they're retrieved
    const [cats_fetched, update_cats_fetched] = useState({
        "cat_1": null,
        "cat_2": null,
        "cat_3": null,
        "cat_4": null,
        "cat_5": null,
        "cat_6": null,
        "cat_7": null
    })

    // When a new data series is clicked on (one of the rows from the NotebookCountry)
    useEffect( () => {

        if (graphs.length == 0) return;

        // The latest addition to the graph query
        let graph_key = graphs[graphs.length - 1]

        // Search each category in the lookup table for the graph_key (e.g. 'EN.POP.DNST')
        for (let cat in nation_stat_categories) {

            // Found the most recently added key within a category in the lookup table
            if (nation_stat_categories[cat].indexOf(graphs[graphs.length - 1]) !== -1) {

                // If we haven't fetched this category yet
                if (!cats_fetched[cat]) {
                    // Fetch the entire category this graph_key belongs to and store it in cats_fetched
                    fetchNationStatCategory(cat, graph_key, updateGraphData, graphData, MDC.mapState.currentCountry, cats_fetched, update_cats_fetched)
                    break
                }
                else { // We already fetched the category this graph_key belongs to
                    
                    let new_data = {}
                    new_data[graph_key] = cats_fetched[cat][graph_key]
                    updateGraphData({...graphData, ...new_data})
                    break

                }

            }

        }

    }, [graphs])

    function closeGraphs(e) {
        updateGraphs([])
        updateGraphData([])
    }

    return (
        <>
            { Object.keys(graphData).length > 0 ?

                <div id="graphs_window" style={{ overflowY: "auto" }} className="nation-graphs">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p style={{ color: "ghostwhite", textAlign: "center" }}>Select up to 10 statistics from any category</p>
                        <p onClick={closeGraphs} style={{ fontVariant:"small-caps", border: "1px solid white", padding:"3px",  color: "ghostwhite", zIndex: 1000, cursor: "pointer"}}>Reset</p>
                    </div>
                    <GraphSystem graphData={graphData}></GraphSystem>
                </div>

                : null

            }
        </>
    )
}

export default NationGraphs
