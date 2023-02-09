import React, { useState, useEffect, useContext } from 'react'
import * as d3 from 'd3'
import { MapDataContext } from '../../../context/MapDataContext'
import {showToolTip, removeTooltip} from '../../../helpers/factory/factoryHelpers'

const Gauge = (props) =>  {

    const MDC = useContext(MapDataContext)

    const [state, setState] = useState({
        value: null,
        min: null,
        max: null,
        label: "",
        units: "",

    })

    let value = props.avg_an
    let min = 0
    let max = props.max_an

    // The shape of the gauge
    const backgroundArc = d3.arc()
        .innerRadius(0.65)
        .outerRadius(1)
        .startAngle(-Math.PI / 2)
        .endAngle(Math.PI / 2)
        .cornerRadius(1)
        ()

    const percentScale = d3.scaleLinear()
        .domain([min, max])
        .range([0, 1])
        
    const percent = percentScale(value)
    const angleScale = d3.scaleLinear()
        .domain([0, 1])
        .range([-Math.PI / 2, Math.PI / 2])
        .clamp(true)

    const angle = angleScale(percent)

    // Inner arc of observation
    const filledArc = d3.arc()
        .innerRadius(0.65)
        .outerRadius(1)
        .startAngle(-Math.PI / 2)
        .endAngle(angle)
        .cornerRadius(1)
        ()

    // 
    const colorScale = d3.scaleLinear()
        .domain([0, 1])
        .range(["#dbdbe7", "#4834d4"])
    const gradientSteps = colorScale.ticks(10)
        .map(value => colorScale(value))

    // Bubble of visual importance
    const markerLocation = getCoordsOnArc(
        angle,
        1 - ((1 - 0.65) / 2),
    )

    return (
        <>
            <div 
            // onMouseEnter={showAvg} 
            // onMouseLeave={removeAvg}
            id="gauge_container" className="c-svg-bg">

                <div className="grid">
                    <div className="s1 a">
                    </div>
                </div>
                <div className="c-svg">
                    <svg style={{overflow: "visible"}} className=""
                        width="6em"
                        viewBox={[
                            0, -1,
                            1, 1,
                        ].join(" ")}>
                        <defs>
                            <linearGradient
                                id={props._id}
                                gradientUnits="userSpaceOnUse"
                                x1="-1"
                                x2="1"
                                y2="0">
                                {gradientSteps.map((color, index) => (
                                    <stop
                                        key={color}
                                        stopColor={color}
                                        offset={`${
                                            index
                                            / (gradientSteps.length - 1)
                                        }`}
                                    />
                                ))}
                            </linearGradient>
                        </defs>

                        <path
                            id="_gmed"
                            d={backgroundArc}
                            fill="#dbdbe7"
                        />
                        <path
                            d={filledArc}
                            fill={String("url(#") + props._id + String(")")}
                        />

                        <line
                            y1="-1"
                            y2="-0.65"
                            stroke="white"
                            strokeWidth="0.027"
                        />

                        <circle
                            id="_gavg"
                            cx={markerLocation[0]}
                            cy={markerLocation[1]}
                            r="0.15"
                            stroke="#1e1e20"
                            strokeWidth="0.1"
                            fill= "rgb(245, 233, 230)"
                        />

                        {/* The arrow. transform is used to place its origin of rotation */}
                        <path
                            d="M0.136364 0.0290102C0.158279 -0.0096701 0.219156 -0.00967009 0.241071 0.0290102C0.297078 0.120023 0.375 0.263367 0.375 0.324801C0.375 0.422639 0.292208 0.5 0.1875 0.5C0.0852272 0.5 -1.8346e-08 0.422639 -9.79274e-09 0.324801C0.00243506 0.263367 0.0803571 0.120023 0.136364 0.0290102ZM0.1875 0.381684C0.221591 0.381684 0.248377 0.356655 0.248377 0.324801C0.248377 0.292947 0.221591 0.267918 0.1875 0.267918C0.153409 0.267918 0.126623 0.292947 0.126623 0.324801C0.126623 0.356655 0.155844 0.381684 0.1875 0.381684Z"
                            transform={`rotate(${
                                angle * (180 / Math.PI)
                            }) translate(-0.2, -0.33)`}
                            fill="#1e1e20"
                        />
                    </svg>
                </div>
                {/* <div className="bwa">
                    <div style={{
                        marginTop: "0.4em",
                        fontSize: "1em",
                        lineHeight: "1em",
                        fontWeight: "500",
                        fontFeatureSettings: "'zero', 'tnum' 1",
                    }}>
                        <ul className="salary-data">
                            <li>Lorem: { d3.format(",")(value) }</li>
                            <li>Lorem: { d3.format(",")(value) }</li>
                            <li>Lorem: { d3.format(",")(value) }</li>
                            <li>Lorem: { d3.format(",")(value) }</li>
                        </ul>
                        
                    </div>
                </div> */}
            </div>
            {/* <div style={{width:"100%"}}>

                <div className="s1 b">
                    <span className="exp-text">Entry Level</span>
                    <input disabled={true} type="range" id="ex" className="range-i" min="0" max="2" onChange={ function(e) {
                        let val = e.target.id + String(e.target.value)
                        console.log(val)
                        props.alignStats("WFC", val, true, "ex")
                    }} />
                    <span className="exp-text">Senior</span>

                </div>

            </div> */}

        </>

    )
}

const getCoordsOnArc = (angle, offset=10) => [
    Math.cos(angle - (Math.PI / 2)) * offset,
    Math.sin(angle - (Math.PI / 2)) * offset,
]

export default Gauge