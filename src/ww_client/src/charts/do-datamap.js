/**
 * This file's functions are responsible for handling map interactions,
 * tracking map state in correlation w/ the nautilus, displaying the hovering
 * tooltip and some event handler definitions
 * 
 * Anything to do with color changes occurs from MapDataContext
 */
import * as d3 from "d3";
import { debounce } from '../components/utils/utils'
import { update_recent } from '../helpers/utils'
import { getKeyTitle } from "../charts/components_with_data/helpers"
import { dollarize, should_dollarize } from "../helpers/functional/stringFuncs"
import { censusQuery } from '../context/utils'

const width = 975;
const height = width * 0.65;
const path = d3.geoPath();

const zoom = d3.zoom()

// Gaussian blur definition
/* <defs>
    <filter id="f1" x="0" y="0">
      <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
    </filter>
</defs> */

// Assumes strings are concatenated by "_" for some reason.
// function dataToTitle(string) {
//     let splitString = string.split("_");
//     for(var i = 0; i< splitString.length; i++){
//         splitString[i] = splitString[i][0].toUpperCase() + splitString[i].slice(1);
//     }
//     return splitString.join(" ");
//}

class DoDataMap {

    constructor (state_data=null, county_data=null) {

        console.log("Constructing DataMap")

        zoom.scaleExtent([1, 8])
            .on("zoom", this.zoomed);
            
        // The most recently clicked county via d3.select
        this.selectedCounty = null
        this.state_data  = state_data
        this.county_data = county_data
        
        // Used to add color highlights to the map
        this.curFill = null
        this.lastFill = null
        this.svg = d3.create("svg")
        this.svg.attr("xmlns", "http://www.w3.org/2000/svg")
        this.svg.attr("xmlns:xlink","http://www.w3.org/1999/xlink")
        this.g1 = this.svg.append("g"); 
        this.g = this.g1.append("g")
        this.svg.attr("id", "nation-svg")
        
        this.def = this.svg.append("defs")

        this.def.append("filter")
            .attr("id", "f1")
            .attr("x", "0")
            .attr("y", "0")
            .append("feGaussianBlur")
            // .attr("result","blur-source")
            .attr("in", "SourceGraphic")
            .attr("stdDeviation", "2")


        // Contains County names and states for the census tooltip
        this.mapTools = null
        // Data for the census tooltip
        this.updateCensus = null 
        this.census = null
        this.cur_census_county = null
        this.cur_census_state = null
        this.viewport = ""

    }

    // The keyup event, wrapped in the debouncer
    tSearch = debounce( function() {

        censusQuery(this.cur_fips, this.updateCensus, this.census, this.cur_census_county, this.cur_census_state)
        
    }, 500) // 500ms delay for each hovered element before its punted serverside

    selectKey(key) {

        // If the user is interacting with any Searchbar, ignore the keystrokes
        if (
            document.activeElement == document.getElementById("naut_work_search") || 
            document.activeElement == document.getElementById("naut_col_search")  ||
            document.activeElement == document.getElementById("main_src")
        )
        {
            return 0
        } else {
            // Dont try capturing keystrokes on mobile
            if (window.innerWidth > 768) {            
                switch(key) {
                    case 'j' :
                        console.log('pressed j')
                        break;
                    case 'k' :
                        console.log('pressed k')
                        break;
                    case 'x' :
                        console.log('pressed x')
                        this.reset()
                        break;
                }
            }
        }
    }

    reset() {

        try {

            this.selectedCounty = null

            // Show the ctr button
            this.MDC.mapDispatch({
                ...this.MDC.mapState,
                // left_pane: false,
                // right_pane: false,
                info_pane: false,
                // left_spin: false,
                // right_spin: false,
                type: "HANDLE_PANE_INFO"
            })

            // Remove the URL Search. It will be reacquired after the resulting dispatch/render
            let url = new URL(window.location)
            url.search = ""
            window.history.pushState(null, null, url.pathname)

            this.svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity,
                d3.zoomTransform(this.svg.node()).invert([width / 2, height / 2])
            )

        } catch(err) {
            console.log(err)
        }
    }

    _dispatchSelection(county_id){

        // Set the proper window state
        let url = new URL(window.location)
        url.search = '?loc=' + String(county_id)
        window.history.pushState(null, "Location Search ", url.pathname + url.search)

        update_recent('loc', county_id)

        let nbta

        if (window.location.pathname.includes("occupations")) nbta = "occ"
        if (window.location.pathname.includes("locations")) nbta = "loc"
        if (window.location.pathname.includes("creators")) nbta = "cre"
        if (window.location.pathname.includes("country")) nbta = "cou"

        this.MDC.mapDispatch({
            ...this.MDC.mapState,
            type: "SELECT_QUERY",
            selections: 1,
            info_pane: true,
            refetch: 1,
            notebook_type_abbrev: nbta,
            new_location: county_id,
            new_occupation: null
        })

    }

    clicked(d,i) {

        if (window.location.pathname.includes('creators')) return

        // Highlight the current selection
        this.selectedCounty = d3.select(d3.event.target)

        this.adjustViewport(d)
        this.selectedCounty.style('stroke', 'red');
        this.selectedCounty.attr("stroke-width",2);
        this.selectedCounty.attr('vis', '1');

        /**
         * @Important
         * Trigger the Radar Component's useEffect. Doing so will prompt another map dispatch from Radar.js
         * 
         * (Below) If a selected county is not the most recently selected county, push it onto our history.
         * Else, simply update the current county we're looking at.
         */

        this._dispatchSelection(d3.event.target.id)

    }

    /**
     * Woosh around the map
     */
    adjustViewport(d) {
        const [[x1, y1], [x2, y2]] = path.bounds(d);

        d3.event.stopPropagation();

        let l_adjust = window.innerWidth > 768 ? 2.06 : 2;

        this.svg.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity
                .translate(width / 2, height / 2)
                .scale(Math.min(8, 1.0 / Math.max((x2 - x1) / width, (y2 - y1) / height)))
                .translate(-(x1 + x2) / l_adjust, -(y1 + y2) / 2),
                d3.mouse(this.svg.node())
        );

    }

    zoomed = () => {
        const {transform} = d3.event;
        this.g.attr("transform", transform);
        this.g.attr("stroke-width", 1 / transform.k);
    }

    async makemap (init=0) {

        try {

            // In case the map attempts to render twice
            let check = document.getElementById('nation-svg')
            if (check) {
                return
            }

            const stateMesh = this.state_data
            var anchor = document.getElementById("nation-wrapper");
            var _this = this

            // Just a safety net against using makemap where you can't
            if (!anchor) {
                console.log("No map anchor was found.")
                return 0
            }

            this.svg.attr("viewport", this.viewport)
            this.g1.attr("id", "filter-group")
                .attr("filter", "0")

            /**
             * This is the interactive group of the svg.
             * Whether it's counties, provinces, cities or whatever
             * it is the interactive layer of the map, the one which
             * can be clicked on, zoomed in, and highlighted
             */
            {
                this.g.append("g")
                    // .attr("id", "debug")
                    .selectAll('path')
                    .data(this.county_data)
                    .enter().append("path")
                    // each county's init fill
                    .attr("fill", "#0001")
                    .attr("id", d => d.id)
                    .attr('fip',  d => String(d.id))
                    .attr("d", path)
                    .on('mouseenter', function() {

                        // Hide any previous "No-Data" displays
                        let n = document.getElementsByClassName('_nodata')

                        for (let i = 0; i < n.length; i++) {
                            if (!n[i].classList.contains('hide-me'))
                                n[i].classList.add('hide-me')
                        }

                        // Don't display census data on mobile, we'll just add it to a location selection in the info pane
                        if (window.innerWidth > 768){

                            let stat_1 = d3.select(this).attr("data-stat-one")
                            let stat_2 = d3.select(this).attr("data-stat-two")
                            let title_1 = getKeyTitle(stat_1)
                            let title_2 = getKeyTitle(stat_2)

                            _this.buildTooltip(Array(stat_1, title_1), Array(stat_2, title_2), d3.select(this))
                        }

                        // Acquire census county and state
                        var id = this.id
                        _this.cur_census_county = _this.mapTools[id].n 
                        _this.cur_census_state  = _this.mapTools[id].s

                        try {
                            // add name and state to tooltip, immediately
                            _this.updateCensus({
                                ..._this.census,
                                cur_census: null,
                                cur_census_county:_this.mapTools[id].n, 
                                cur_census_state: _this.mapTools[id].s
                            })
    
                            // Add census data to tooltip via Redis call -- Debounced for safety
                            _this.cur_fips = this.id

                            if (window.innerWidth > 768)
                                _this.tSearch()

                        } catch(err) {
                            console.error(err)
                            console.log(id)
                            console.log(_this.mapTools.id)
                        }

                        let curCounty = d3.select(this)
                        
                        // Current fill prior to orange overlay
                        this.curFill = curCounty.attr("fill")

                        this.lastFill = this.curFill || "none"
                        
                        curCounty
                            // .attr("fill", "orange")
                            .attr('stroke', 'red')
                            .attr('stroke-width', "2")

                    })
                    .on("click", this.clicked.bind(this))
                    .on('mouseout', function() { 

                        let curCounty = d3.select(this)

                        if (this.curFill) {
                            this.lastFill = this.curFill
                        }
                        
                        // No census tooltips on mobile. They display in the iNfo Pane
                        if (window.innerWidth > 768){
                            Array.from(document.getElementsByClassName('l-cursor')).forEach( el => {
                                el.classList.add('hide-me')
                            })
                        }

                        curCounty
                            .attr('fill', this.curFill)
                            .attr('stroke', 'none');

                    }) 


            }


            /**
             * This group is dedicated to boundaries around counties (regions, provinces, etc.)
             * Most countries will not have this data because the boundary is consequently provided by the counties.
             */
            if (stateMesh) {

                // Generate State Mesh
                this.g.append("path")
                    .attr("fill", "none")
                    .attr("stroke", "white")
                    .attr("stroke-linejoin", "round")
                    .attr("d", path(stateMesh))

            }

            this.svg.call(zoom);

            anchor.append(this.svg.node());

            let url = new URL(window.location)

            // Outline the fips from an existing url query
            if (url.searchParams.get('loc')) {
                
                setTimeout(function(){
                    try {
                        var county = d3.select(document.getElementById(String(url.searchParams.get('loc'))))
                        county.attr('stroke', 'red')
                        county.attr('stroke-width', '2')
                        this.selectedCounty = url.searchParams.get('loc')
                    } catch (err) {
                        console.log(err)
                    }

                }, 500)
            }


        } catch (err) {
            console.error(err)
        }

    }

    buildTooltip(set_1, set_2=null, element=null) {

        if (element.attr("fips")) {
            return 0
        }
        let check_st_container = document.getElementsByClassName('st_container')
        if (check_st_container.length > 0) {
            // Append the first stat selection to the tooltip
            if (set_1[0] !== null && set_1[1] !== undefined) {
                let value = should_dollarize(set_1[0]) ? dollarize(element.attr(set_1[0])) : element.attr(set_1[0])
                document.getElementById('st_1_stat_1').textContent = set_1[1] + " " + value
                document.getElementById('st_2_stat_1').textContent = set_1[1] + " " + value
            } else {
                document.getElementById('st_1_stat_1').textContent = ""
                document.getElementById('st_2_stat_1').textContent = ""
            }

            // Append the second stat selection to the tooltip
            if (set_2[0] !== null && set_2[1] !== undefined) {
                let value = should_dollarize(set_2[0]) ? dollarize(element.attr(set_2[0])) : element.attr(set_2[0])
                document.getElementById('st_1_stat_2').textContent = set_2[1] + " " + value
                document.getElementById('st_2_stat_2').textContent = set_2[1] + " " + value
            } else {
                document.getElementById('st_1_stat_2').textContent = ""
                document.getElementById('st_2_stat_2').textContent = ""
            }
        }

        // document.getElementById('lc-1').classList.add('TR')
        // document.getElementById('lc-2').classList.add('TR')

    }

}

export default DoDataMap;