import React, {useState, useEffect} from 'react'
import * as topojson from "topojson-client";
import * as d3 from "d3";
import {loadData, makeCanvasContext}  from '../charts/do-scroller'

function ScrollingMap({width, height, p, speed}) {

    const [state, setState] = useState({
        rotation: 0,
        data: null,
        loaded: 0,
        land: null,
        context: makeCanvasContext(),
        projection: null,
    })

    const projections = {
        "conicEquidistant" : d3.geoConicEquidistant,
        "mercator" : d3.geoMercator
    }

    useEffect( () => {
        document.body.classList.add('no-flow-y')

        async function doit () {
            // Load the world feature data
            await loadData()
            .then( (world) => {

                let land = topojson.feature(world, world.objects.land)

                setState({
                    ...state,
                    rotation: 1, 
                    data: world, 
                    loaded: 1,
                    land: land,
                    projection: projections[p]().fitSize([width,height], land),
                    geoGenerator: d3.geoPath()
                })
                                
            }).catch(err => {
                console.log(err)
            }) 

        }

        doit()

        return function cleanup (){

        }
        
    }, [])

    useEffect ( () => {

        // Initiate rotating projection
        makeMap(state.rotation)

    }, [state.loaded])



    /**
     * Paint the rotating projection - Called every animation frame
     */
    const makeMap = function(rot){

        if (state.data == null)
            return false

        else {
            var rotation = rot + speed
            let projection = state.projection.rotate([rot])
            
            let geoGenerator = state.geoGenerator
            .projection(projection)
            .context(state.context)

            state.context.clearRect(0, 0, width, height);
            state.context.save();
            state.context.beginPath()
            geoGenerator(({type: "Sphere"}))

            state.context.clip() 
            // state.context.fillStyle = "transparent" 
            // state.context.fillRect(0, 0, width, height)
            state.context.beginPath() 
            geoGenerator(d3.geoGraticule10()) 

            state.context.strokeStyle = "#fff" 
            state.context.stroke();
            state.context.beginPath() 
            geoGenerator(state.land)

            state.context.strokeStyle = "#fff"
            state.context.stroke()
            state.context.restore();
            
            state.context.beginPath() 
            geoGenerator(({type: "Sphere"}))

            state.context.strokeStyle = "#fff"
            state.context.stroke();
            try {
                document.getElementById('_anchor').innerHTML = ""
                document.getElementById('_anchor').appendChild(state.context.canvas)
            } catch(err) {
                return
            }

            setTimeout(function() {
                window.requestAnimationFrame(() => {
                    makeMap(rotation)
                })
            }, 50)
            
        }
    }


    return (
        <div id="_anchor">

        </div>
    )
}

export default ScrollingMap
