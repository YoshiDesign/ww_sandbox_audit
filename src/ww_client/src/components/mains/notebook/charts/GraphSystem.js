import React, {useEffect, useState} from 'react'
import NationGraph from './draw/do-NationGraphs'
import NationGraph2 from './draw/do-NationGraph2'

function GraphSystem({graphData}) {

    useEffect( () => {

        console.log("GraphData has been updated...")

        //
        let all_graph_keys = Object.keys(graphData)

        console.log(all_graph_keys)

        // Unique 0-indexed enumerator for current graph
        let _enum = all_graph_keys.length - 1

        console.log("Num Graphs:", _enum)

        //
        new NationGraph2(graphData[all_graph_keys[all_graph_keys.length - 1]], _enum)
    
    }, [graphData])

    return (
        <div id="graph-ts-wrapper">
            
        </div>
    )
}

export default GraphSystem