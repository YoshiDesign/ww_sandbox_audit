import React, { useState, useEffect } from 'react'
import SearchBar from './mains/navigator/SearchBar'
import * as topojson from "topojson-client";
import * as d3 from "d3";
import {loadData, makeCanvasContext}  from '../charts/do-scroller'
import {Link} from 'react-router-dom'

var width = 1000
var canvas = document.createElement("canvas");
    canvas.width = 954
    canvas.height = 954
    canvas.style.width = width + "px";
    canvas.style.margin = "auto"

function Landing(props) {

    const [state, setState] = useState({
        notebook_type_abbrev: "occ"
    })

    const [_state, _setState] = useState({
        rotation: 0,
        data: null,
        loaded: 0,
        land: null,
        context: makeCanvasContext(canvas),
        projection: null,
    })

    const speed = 0.1
    const width = 954
    const height = 420
    const p = "conicEquidistant"

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

                _setState({
                    ..._state,
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
        
    }, [])

    useEffect ( () => {

        // Initiate rotating projection
        makeMap(_state.rotation)

    }, [_state.loaded])



    /**
     * Paint the rotating projection - Called every animation frame
     */
    const makeMap = function(rot){

        if (_state.data == null)
            return false

        else {
            var rotation = rot + speed
            let projection = _state.projection.rotate([rot])
            
            let geoGenerator = _state.geoGenerator
            .projection(projection)
            .context(_state.context)

            _state.context.clearRect(0, 0, width, height);
            _state.context.save();
            _state.context.beginPath()
            geoGenerator(({type: "Sphere"}))

            _state.context.clip() 
            // _state.context.fillStyle = "transparent" 
            // _state.context.fillRect(0, 0, width, height)
            _state.context.beginPath() 
            geoGenerator(d3.geoGraticule10()) 

            _state.context.strokeStyle = "#fff" 
            _state.context.stroke();
            _state.context.beginPath() 
            geoGenerator(_state.land)

            _state.context.strokeStyle = "#fff"
            _state.context.stroke()
            _state.context.restore();
            
            _state.context.beginPath() 
            geoGenerator(({type: "Sphere"}))

            _state.context.strokeStyle = "#fff"
            _state.context.stroke();
            try {
                document.getElementById('_anchor').innerHTML = ""
                document.getElementById('_anchor').appendChild(_state.context.canvas)
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
        
        <div className="landing">
            <p className="cta1"><i>While under development this website is also a mobile app, add our site to your home screen for quick access!</i></p>
            <section className="title">
                <h1>The World Works</h1>
                <p className="subheading"> We can't always change how our lives work, but we can always choose a more balanced work life.</p>
                    <p className="subheading">Explore Economics and Creativity World-Wide</p>
                    <p className="subheading" style={{display:"block", fontSize:"13px", textDecoration: "underline"}}>
                        <Link to="/map/usa/creators">
                            Sign up and reserve your creator profile to be notified when we launch the Global Creator Space!
                        </Link>
                    </p>
            
            </section>
            <section className="l-midsection pos-rel ">
                {/* <SearchBar 
                    help_state={state} 
                    set_help_state={setState} 
                    landing={true} 
                    mobile={false} 
                    nType={false} 
                    wlClass="wt-border" 
                    occBtnClass="wt-text" 
                    locBtnClass="wt-text"
                /> */}
            </section>

            <section className="stmt">
                <p className="subheading lg-text">
                    Launch our map and begin making discoveries.
                </p>
            </section>
            <section className="b-section">
                <div className="fit">
                    <a href="/map/home">
                        <button className="btn btn-skel">Launch The Map</button>
                    </a>
                </div>
            </section>

            <div id="_anchor">

            </div>

        </div>
    )
}

export default Landing