import * as d3 from 'd3'
import axios from 'axios'
import { RadarSetup } from '../charts/do-radar'
import { color } from '../components/utils/utils'
import { scales, order, getReturnTo } from '../helpers/utils'
import { dollarize, should_dollarize } from "../helpers/functional/stringFuncs"
import { hideLegend } from '../components/mains/map_tools/Legend'
import {normTitle} from '../charts/helpers/helpers'
import {color_swatches} from '../components/utils/utils'
import { 
    makeLocalCompaniesList, 
    makeSchoolsList,
    getKeyTitle
} from '../charts/components_with_data/helpers'

function initialize_info_pane(fips, data) {

    try {

        /**
         * @MajorFuckingTODO
         * makeLocalCompaniesList and the County, State title are React anti-patterns.
         * They should be reactive from within InfoPane.js
         * 
         * The rest of this function assists the info pane display and implicit behavior
         */

        // document.getElementById('info-pane').firstChild

        // Initialize the Radar component (see: do-radar.js)
        RadarSetup(data.s, data.c, data.c[0]["_id"])

        // Initialize the list of top companies (see: do-topCompanies.js)
        makeLocalCompaniesList(data.w)

        // makeSchoolsList(data.sc)

        // This sets the County, State title at the top of the InfoPane
        let heading = document.getElementById('ifstat-title')
        let county_name = normTitle(data.c[0].county_name)
        heading.innerText = county_name + " County, " + data.s.abrv

        // Try adding a stroke to the selected county <path> from here
        try {
            // Highlight the county
            document.getElementById(fips).setAttribute("style", "stroke:red;")
        } catch(err){}

        // Lol
        document.getElementById('info-pane').classList.remove('hide-me')

        // Scroll to the top of the new info pane - Hint: there's only 1
        var n = document.getElementsByClassName('fl-row')
        for(let i = 0; i < n.length; i++) {
            var topPos = n[i].offsetTop;
            n[i].scrollTop = topPos
        }

    } catch(err) {
        console.error(err)
    }

}

/**
 * Fetch specific location or specific occupation data. No more, but possibly less
 * @param {} refetch 
 * @param {*} location_id 
 * @param {*} occupation_id 
 * @param {*} notebook_type_abbrev - Directs the outbound requests to the correct API route
 * @param {*} mapDispatch 
 * @param {*} region_id - The MDC.mapState.currentCountry. (e.g. /usa)
 * @returns 
 */
export function apiFetchQueriedInformation(location_id, occupation_id, notebook_type_abbrev, mapDispatch, cur_country){

    var nbta = notebook_type_abbrev

    

    // Find out what type of query we're about to perform and prevent blank nbta's (should never happen)
    let url = new URL(window.location)
    // let keys = Array.from(url.searchParams.keys())
    let loc = url.searchParams.get('loc')
    let occ = url.searchParams.get('occ')
    let cre = url.searchParams.get('cre')
    let cou = url.searchParams.get('cou')

    // Determine the id to query and the route to send the query to. The only nested ternary's in this entire codebase, certainly.
    let _id = loc ? loc : occ ? occ : cre ? cre : cou
    let qr = loc ? "loc" : occ ? "occ" : cre ? "cre" : cou ? "cou" : ""

    if (qr === "") return

    if (!nbta){ 

        if (loc) {

            // If a location was in the search params, highlight it on the map if it loads within 2.5 seconds
            try {
                setTimeout(function(){
                    try {
                        document.getElementById(String(loc)).setAttribute("style", "stroke:red; stroke-width:2px;")
                    } catch (err) {}
                    
                }, 2500)
            } catch(err) {
                console.error(err)
            }

        }

    }

    /**
     * Find out if we've already cached this notebook in session storage before punting to the API
     */
    console.log("Searching cache for :", "n_"+ qr + "_" + _id)
    let cached_data = JSON.parse(sessionStorage.getItem("n_"+ qr + "_" + _id))

    if (cached_data) {
        console.log("[utils.js] NoteBook was Cached...\nid:", _id, "\nqr:", qr)
        console.log("cache 1")
        notebookDispatch(qr, mapDispatch, cached_data, _id)
        return

    } else {

        console.log("[utils.js] NoteBook was NOT Cached...")
        var _uri = ""

        if (qr === "occ") {
            _uri = `/api/datas/occ?v_1=${null}&v_2=${null}&occ_code=${_id}`
        }
        else if (qr === "loc") {
            // _.
            _uri = `/api/datas/loc?fips=${cur_country}_.${_id}` // _. is a delimiter
        }

        if (_id) {

            console.log("[utils.js::apiFetchQueriedInformation] Server: ", _uri)

            axios.get(_uri, {
                proxy: {
                    host: 'localhost',
                    port: 4000
                }
            }).then( res => {

                // No info
                if (res.data.error) {
                    mapDispatch({
                        type: "NO_INFO"
                    })
                    return
                }

                // TODO(?) If the data structures returned here were more similar, then checking for the query type wouldn't be necessary
                if (qr === "loc") {
                    // Preserve the most recent search in an object we can recall later
                    sessionStorage.setItem("n_"+ qr + "_" + res.data['sc'][0].Fip, JSON.stringify(res.data))

                }
                if (qr === "occ") {
                    // Preserve the most recent search in an object we can recall later
                    sessionStorage.setItem("n_"+ qr + "_" + res.data._id, JSON.stringify(res.data))
                   
                }

                // save last notebook for this category
                sessionStorage.setItem("last_" + qr, JSON.stringify(res.data))
               
                console.log("cache 2")
                notebookDispatch(qr, mapDispatch, res.data, location_id, occupation_id)

            }).catch( err => {
                console.log(err)
                
            })

        } 

    }
    
}

/**
 * @param {*} notebook_type_abbrev 
 * @param {*} mapDispatch 
 * @param {*} data 
 * @returns 
 */
export function notebookDispatch(notebook_type_abbrev, mapDispatch, data, id) {

    if (notebook_type_abbrev === "loc") {

        setTimeout(function() {
            initialize_info_pane(id, data)
        }, 100)

        return mapDispatch({
            type: "UPDATE_NOTEBOOK",
            loc_notebook: data,
            occ_notebook: false,
            nbta: "loc"
        })

    }
    else if (notebook_type_abbrev === "occ") {

        console.log("DISPATCHING OCCUPATION NOTEBOOK WOOT")
        return mapDispatch({
            type: "UPDATE_NOTEBOOK",
            occ_notebook: data,
            loc_notebook: false,
            nbta: "occ"
        })
    }

}

export function updateColors(data, colorScales, color_swatch, sortKeys, ready){

    if (ready) {

        let fips = d3.selectAll('[fip]')

        // Apply new colors to the map
        fips.each( function (p, j) {
            d3.select(this).transition().duration(700)
                .attr("fill", color(data[this.id], colorScales, color_swatch, sortKeys))
        })

    } else {

    }
}

/**
 * Paint data on the USA based on a user's selection
 * @param {*} mapState 
 * @param {*} mapDispatch 
 * @returns 
 */
export function apiFetchAndUpdateStatistics(mapState, mapDispatch) {

    // Dont fetch from initial render
    const allNull = (val) => val === null
    let stat_check = Object.values(mapState.stats)

    if (stat_check.every(allNull)) {
        clearMap()
        return
    }

    if (mapState.refetch){

        let server_uri
        var cDomain = {}
        var setKeys
        
        switch(mapState.notebook_type_abbrev) {
            case "loc" : 
                server_uri = mapState._url + `?v_1=${mapState.v_1}&v_2=${mapState.v_2}`
                break
            case "occ" : 
                server_uri = mapState._url + `?v_1=${mapState.v_1}&v_2=${mapState.v_2}&occ_code=${mapState.notebooks.occ_notebook._id}`
                break
            case "cre" : 
                break
            case "cla" : 
                break
        }

        axios.get(server_uri, {
            headers: {'Content-Type': 'application/json'},
            proxy: {
                host: 'localhost',
                port: 4000
            }
        }).then( res => {

            // Construct our color domains
            for (let item in res.data) {
                
                // Set up our cDomain object (key/value store of all incoming data)
                if ( ! Object.keys(cDomain).length) {

                    // Get the keys we just queryied from any of the data object's entries
                    setKeys = Object.keys(res.data[item])

                    // Build a CDomain array for each query
                    for (let k of setKeys) {
                        cDomain[k] = []
                        // {stat_1: [], (...)}
                    }

                }

                // Populate our domain values
                for (let k of setKeys) {
                    cDomain[k].push(res.data[item][k])
                }

            }

            // Gather the colors per our clustering strategy
            let [colorScales, minMax] = scales(cDomain)

            // Add our scale functions here deterministically
            var sortKeys = [null, null]
            let keys = Array.from(Object.keys(colorScales), k => {
                if (colorScales[k]) {
                    return k
                }
            }).filter( n => n != null )

            // Asserts consistent color appearance of our map, so variables always end up on the same side of the legend no matter the configuration
            if (keys.length > 1){

                if (order[keys[0]] < order[keys[1]]){
                    sortKeys = [keys[0], keys[1]]
                }
                else{
                    sortKeys = [keys[1], keys[0]]
                }

            } else {
                // Assertion: length == 1
                sortKeys = keys // Just a lil array
            }

            // Configure the legend text elements. They should always appear
            // in the same locations consistentlygiven the current selection
            if (sortKeys.length == 1) {
                // Monovar legend text objects
                let curMaxColor = color_swatches[mapState.bimono][mapState.color_swatch]["colors"][color_swatches[mapState.bimono][mapState.color_swatch]["colors"].length - 1]
                let curMinColor = color_swatches[mapState.bimono][mapState.color_swatch]["colors"][0]
                document.getElementById('leg1').textContent = getKeyTitle(sortKeys[0])
                document.getElementById('area_min_val').textContent = should_dollarize(sortKeys[0]) ? dollarize(minMax[sortKeys[0]][0]) : minMax[sortKeys[0]][0]
                document.getElementById('area_max_val').textContent = should_dollarize(sortKeys[0]) ? dollarize(minMax[sortKeys[0]][1]) : minMax[sortKeys[0]][1]
                document.getElementById('area_max_val').style  = "color: " + curMaxColor + "; font-size:17px;"
                document.getElementById('area_min_val').style  = "color: " + curMinColor + "; font-size:17px;"

            }
            else if (sortKeys.length == 2) {    // Bivariate Legend text objects
                
                let curMaxColorLeft = color_swatches[mapState.bimono][mapState.color_swatch]["colors"][30]
                let curMinColorLeft = color_swatches[mapState.bimono][mapState.color_swatch]["colors"][0]
                let curMaxColorRight = color_swatches[mapState.bimono][mapState.color_swatch]["colors"][11]
                let curMinColorRight = color_swatches[mapState.bimono][mapState.color_swatch]["colors"][0]

                // Left legend title (bivariate)
                document.getElementById('leg2').textContent = " - " + getKeyTitle(sortKeys[0]) + " + "
                document.getElementById('left_min_val').textContent = minMax[sortKeys[0]][0]
                document.getElementById('left_max_val').textContent = minMax[sortKeys[0]][1]
                document.getElementById('left_max_val').style = "color: " + curMaxColorLeft + "; font-size:17px;"
                document.getElementById('left_min_val').style = "color: " + curMinColorLeft + "; font-size:17px;"

                // Right legend title (bivariate)
                document.getElementById('leg3').textContent = " - " + getKeyTitle(sortKeys[1]) + " + "
                document.getElementById('right_min_val').textContent = minMax[sortKeys[1]][0]
                document.getElementById('right_max_val').textContent = minMax[sortKeys[1]][1]
                document.getElementById('right_max_val').style = "color: " + curMaxColorRight + "; font-size:17px;"
                document.getElementById('right_min_val').style = "color: " + curMinColorRight + "; font-size:17px;"

            }

            // Get the attribute(s) we'll be applying to each available fips, they're the same across the board so just grab the keys of the first result
            var a_fips = Object.keys(res.data)[0]
            if (!a_fips) {

                // NO DATA! We need to collect data on this job
                console.log("NO DATA!")
                return

            }

            var atts = Object.keys(res.data[String(a_fips)])

            /**
             * Apply new colors to the map and attach data to each <path> for the tooltip to access.
             * Note that after we've effectively removed (or moved on to different) data, these
             * attributes won't disappear. This saves us some compute time but also adds to complexity. 
             * I might instead clear attributes prior to applying new ones.
             */
            Object.keys(res.data).forEach( function (fip) {

                if(atts.length === 1) {

                    // A consequence of cleaning the data. Some values are 101.01 for some reason, when they should be null
                    if (res.data[String(fip)][atts[0]] == "101.01") {/* Dont do a thing */}
                    else {
                        d3.select("[fip='"+String(fip)+"']").transition().duration(700)
                        // connect the data to the attribute for the tooltip
                        .attr("data-stat-one", atts[0])                 // The Key
                        .attr(atts[0], res.data[String(fip)][atts[0]])  // The Value
                        .attr("fill", color(res.data[fip], colorScales, mapState.color_swatch, sortKeys))
                    }


                } else if (atts.length === 2){

                    /**
                     * This is currently disabled. atts.length will only ever be 1 for now.
                     * This is for when we decide to re-enable the bivariate choropleth map
                     */

                    d3.select("[fip='"+String(fip)+"']").transition().duration(700)
                        // connect 2 attr's
                        .attr("data-stat-one", atts[0])                 // The Key
                        .attr(atts[0], res.data[String(fip)][atts[0]])  // The Value
                        .attr("data-stat-two", atts[1])                 // The Key
                        .attr(atts[1], res.data[String(fip)][atts[1]])  // The Value
                        .attr("fill", color(res.data[fip], colorScales, mapState.color_swatch, sortKeys)) 

                } else {
                    console.log("-No Attributes-")
                }

            })

            // Update the MapContext with it's new items and functions. The legend also gets painted
            mapDispatch({
                ...mapState, 
                type: "CACHE", 
                atts: atts,
                cDomain: cDomain, 
                data: res.data,
                sortKeys: sortKeys,
                colorScales: colorScales
            })

            // Garbage collect
            delete res.data
            delete mapState.data

        }).catch( err => {
            console.error("[CONTEXT ERROR] => \n", err)
        })

    } else {

        // TODO Refactor this I guess
        let n = Object.values(mapState.stats)
        for (let i in mapState.stats) {
            if (mapState.stats[i] !== null) {
                return
            }
        }
        clearMap()
    }
}

/**
 * Fetch census data from the server.
 * Used when hovering over a county in the USA component
 * @param {*} _id 
 * @param {*} updateCensus 
 * @param {*} census 
 * @param {*} cur_census_county 
 * @param {*} cur_census_state 
 * @returns 
 */
export function censusQuery(_id, region_id, updateCensus, title) {

    let url = new URL(window.location)
    if (url.searchParams.get('loc')) return

    console.log("Census Query: ", _id)

    axios.get(`/api/datas/census?fips=${region_id}-${_id}` , {}, {
        proxy: {
            host: 'localhost',
            port: 4000
        }
    }).then( (res) => {

        // clear any "no data" text
        var nd = document.getElementsByClassName('_nodata')

        for (let i = 0; i < nd.length; i++){
            nd[i].classList.add('hide-me')
        }

        if (res.data.error) {

            for (let i = 0; i < nd.length; i++){
                nd[i].classList.remove('hide-me')
            }
        }
        else {

            // Interesting to note: The census as it exists between DoDataMap2 and
            // here is not persistent. However, it still seems to update the 
            // census within the MapDataContext, which is where it is ultimately needed.
            updateCensus({
                cur_census_title: title,
                cur_census: res.data, 
            })

        }
        
    })
    .catch( err => { 
        console.log(err) 
    })
}

/**
 * Clear all data and stat-related attributes from the map and its path elements
 */
export function clearMap(dispatch=null) {

    let fips = d3.selectAll('[fip]')

    // This will fail on init, no big deal
    try{
        hideLegend()
    } catch(err){}

    fips.each( function (p, j) {

        let s1 = this.dataset.statOne || null
        let s2 = this.dataset.statTwo || null

        // Clear data values from each fips path
        d3.select(this).transition()
            .attr(s1, null)
            .attr(s2, null)
            .attr('data-stat-one', null)
            .attr('data-stat-two', null)
            .duration(900)
            .attr("fill", "#0002")

    })

    if (dispatch !== null) {
        dispatch({
            type: "RST"
        })
    }

}