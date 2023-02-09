import * as d3 from "d3";
import React, { useEffect, useContext, useState } from 'react'
import { MapDataContext } from '../../../context/MapDataContext'
import {color_swatches} from '../../utils/utils'

// Select descriptors for the legend based on our current atts
function attribute_strings(atts) {
    let attributes = []
    let descriptions = {
        "lq": "Location Quotient",
        "pk": "Jobs / 1000",
        "em": "Total Employed",
        "ex0": "Entry Level Income",
        "ex1": "Associate Income",
        "ex2": "Senior Income",
        "col": "Relative Cost Of Living",
        "mhc": "Median Home Cost",
        "rav": "Average Rent",
        "r0": "Average Studio Apt. Rent",
        "r1": "Average 1 Bedroom Apt. Rent",
        "r2": "Average 2 Bedroom Apt. Rent",
        "r3": "Average 3 Bedroom Apt. Rent",
        "r4": "Average 4 Bedroom Apt. Rent"
    }

    for (let s of atts) {
        attributes.push(descriptions[s])
    }

    return attributes

}

export function hideLegend() {
    document.getElementById('legend-area').classList.add('hide-me')
    document.getElementById('legend-overlay').classList.add('hide-me')
    document.getElementById('legend-overlay').classList.remove('leg')
}

function clearMonoStats(atts){
    // for (let att of atts) {
    //     let counties = document.querySelectorAll(`[${att}]`)
    //     for (let county of counties)
    //         console.log(county.getAttribute(att))
    // }
}

function Legend() {

    const MDC = useContext(MapDataContext)

    useEffect( () => {

        const atts = MDC.mapState.atts

        if (!atts || atts.length === 0) return

        // let att_titles = attribute_strings(atts)

        // Clear any previous legend
        document.getElementById('legend-area').innerHTML = ""
        document.getElementById('legend-overlay').innerHTML = ""

        let c = color_swatches[MDC.mapState.bimono][MDC.mapState.color_swatch].colors
        let n = (MDC.mapState.bimono == "bivariate") ? 6 : 3   
        let uid10 = "uid10"
        const k = 12
        let _svg

        if (MDC.mapState.bimono == "bivariate") {
            /**
             * Bivariate Legend
             */

            const legend_width = 90
            const legend_height = 8

            _svg = d3.create("svg")
            .attr('viewBox', "0 0 70 70")
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .attr('class', 'legend-b').attr('transform', ` rotate(-45)`)

            const legend_title = _svg.append("text")
            .attr("y", -23)
            .attr("x", legend_width / 2 - 29)
            .attr('class', "legend-title-mono")
            .text("Legend")

            const legend_line = _svg.append("text")
            .attr("y", -32)
            .attr("x", legend_width / 2 - 29)
            .attr('class', "legend-line")
            .text(`${123}`)

            // Access the right swatch
            let _g0 = _svg.append("g")
            let _g1 = _svg.append("g")
                
            _g0.attr("font-size", 10)
            // translate(-${k * n / 2},-${k * n / 2})
            _g1
                
                .append('marker').attr('id', `${uid10}`).attr('markerHeight', 10).attr('markerWidth', 10).attr('refX', 6).attr('refY', 3).attr('orient', 'auto')
                .append('path').attr('d', 'M0,0L9,3L0,6Z')
    
            let cross = d3.cross(d3.range(n), d3.range(n)).map( ([i, j]) => _g1.append("rect").attr('width', `${k}`)
                .attr('height', `${k}`)
                .attr('x', `${i * k}`)
                .attr('y', `${(n - 1 - j) * k}`)
                .attr('fill', `${c[j * n + i]}`)
            )
        } else if (MDC.mapState.bimono == "monovar") {
            /**
             * Monovar legend
             */
            const legend_width = 180
            const legend_height = 16
    
            _svg = d3.create("svg")
            .attr('viewBox', "0 0 180 134")
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .attr('class', 'legend-a')
            .attr('id', 'leg-a')
    
            const defs = _svg.append('defs')
            const legendGroup = _svg.append("g").attr("transform", `translate(${0}, ${120})`)
            const legendGradientId = "legend-gradient"
            const gradient = defs.append("linearGradient")
                .attr("id", legendGradientId)
    
            const stop1 = gradient.append("stop")
                .attr('stop-color', c[0])
                .attr('offset', "0%")

            const stop2 = gradient.append("stop")
                .attr('stop-color', c[c.length - 1])
                .attr('offset', "100%")
    
            // const legend_title = legendGroup.append("text")
            //     .attr("y", -23)
            //     .attr("x", legend_width / 2 - 29)
            //     .attr('class', "legend-title-mono")
            //     .text("Legend")
    
            const legendGradient = legendGroup.append("rect")
                .attr('height', legend_height)
                .style("fill", `url(#${legendGradientId})`)
                .style("width", `100%`)
                
            // const legendValueLeft = legendGroup.append("text")
            //     .attr('class', 'legend-value')
            //     .attr('id', 'legendValueL')
            //     .attr("x", legend_width / 2 - 10)
            //     .attr("y", legend_height / 2)
    
            // const legendValueRight = legendGroup.append("text")
            //     .attr('class', 'legend-value')
            //     .attr('id', 'legendValueR')

            
        }   
        
        d3.select('#legend-area').node().append(_svg.node())
        
        // Text decorations - Construct the Legend items but do not apply the data to their textcontent here
        // That happens context/utils.js. When data is returned from the server it is given a deterministic
        // orientation so that the same data points always appear on the same side of the legend no matter the selection order
        if (MDC.mapState.bimono == "bivariate") {
            
            let left = document.createElement("DIV")
            let left_title = document.createElement("P")
            let left_vals = document.createElement("P")
            let left_min_val = document.createElement("SPAN")
            let left_max_val = document.createElement("SPAN")
            
            left_title.classList.add("clr-txt")
            left_title.setAttribute("id", "leg2")
            left.setAttribute("class", "absMark abs-L")
            left_vals.setAttribute("class", "mmVals")
            left_min_val.setAttribute("id", "left_min_val")
            left_max_val.setAttribute("id", "left_max_val")
            left_max_val.setAttribute("class", "go-right")

            let right = document.createElement("DIV")
            let right_title = document.createElement("P")
            let right_vals = document.createElement("P")
            let right_min_val = document.createElement("SPAN")
            let right_max_val = document.createElement("SPAN")
           
            right_title.classList.add("clr-txt")
            right_title.setAttribute("id", "leg3")
            right.setAttribute("class", "absMark abs-R")
            right_vals.setAttribute("class", "mmVals")
            right_min_val.setAttribute("id", "right_min_val")
            right_max_val.setAttribute("id", "right_max_val")
            right_max_val.setAttribute("class", "go-right")

            left.appendChild(left_title)
            left_vals.appendChild(left_min_val)
            left_vals.appendChild(left_max_val)
            left.appendChild(left_vals)

            right.appendChild(right_title)
            right_vals.appendChild(right_min_val)
            right_vals.appendChild(right_max_val)
            right.appendChild(right_vals)

            document.getElementById('legend-overlay').append(left)
            document.getElementById('legend-overlay').append(right)
            document.getElementById('legend-area').classList.remove('single')
            document.getElementById('legend-overlay').classList.remove('single')

            clearMonoStats(atts)

        } else {
            let area = document.createElement("DIV")
            let area_title = document.createElement("P")
            let area_vals = document.createElement("P")
            let area_min_val = document.createElement("SPAN")
            let area_max_val = document.createElement("SPAN")
            area_title.classList.add('clr-txt')
            area_title.setAttribute('id', 'leg1')
            area.setAttribute("class", "absMark abs-S")
            area.id = "lshift-s"
            area_vals.setAttribute("class", "mmVals")
            area_min_val.setAttribute("id", "area_min_val")
            area_max_val.setAttribute("id", "area_max_val")
            area_max_val.setAttribute("class", "go-right")
            
            area.appendChild(area_title)
            area_vals.appendChild(area_min_val)
            area_vals.appendChild(area_max_val)
            area.appendChild(area_vals)
            document.getElementById('legend-area').classList.add('single')
            document.getElementById('legend-overlay').classList.add('single')
            document.getElementById('legend-overlay').append(area)

        }

        document.getElementById('legend-area').classList.remove('hide-me')
        document.getElementById('legend-overlay').classList.remove('hide-me')

        return function(){
            _svg = null
        }

    }, [MDC.mapState.atts, MDC.mapState.color_swatch, MDC.mapState.bimono])

    useEffect( () => {

        if (!MDC.mapState.stats) return

        // Dont fetch from initial render
        const allNull = (val) => val === null
        let stat_check = Object.values(MDC.mapState.stats)
        if (stat_check.every(allNull)) {
            return
        }

        let arr = Object.values(MDC.mapState.stats)
        if (arr.every(element => element === null)) {
            hideLegend()
        }
        
    }, [MDC.mapState.stats])

    useEffect( () => {
        
        try {

            // if (MDC.mapState.info_pane == false) {
            //     document.getElementById("lshift-s").classList.remove('l-shift-2')
            //     document.getElementById("leg-a").classList.remove('l-shift-2')
                
            // } else {
            //     document.getElementById("lshift-s").classList.add('l-shift-2')
            //     document.getElementById("leg-a").classList.add('l-shift-2')
            // }

        } catch(err) {
            // next time.
        }

    }, [MDC.mapState.info_pane])
    
    return (
        <div>  
            
            <div id="legend-area" className="hide-me">

            </div>
            <div id="legend-overlay" className="hide-me">
            </div>
        </div>
    )
}

export default Legend
