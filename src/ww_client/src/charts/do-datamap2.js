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
 const height = width;
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
 
     constructor (nation_name="none", layer_1=null, layer_2=null) {
 
         zoom.scaleExtent([1, 8])
             .on("zoom", this.zoomed);
             
         // The most recently clicked county via d3.select
         this.selectedRegion = null
         this.layer_1 = layer_1
         this.layer_2 = layer_2
         this.MDC = null
         
         // Used to add color highlights to the map
         this.curFill = null
         this.lastFill = null
         this.svg = d3.create("svg")
         this.svg.attr("xmlns", "http://www.w3.org/2000/svg")
         this.svg.attr("xmlns:xlink","http://www.w3.org/1999/xlink")
         this.svg.attr("data-nation", nation_name)

         this.g1 = this.svg.append("g"); 
         this.g = this.g1.append("g")
         this.svg.attr("viewBox", [0, 0, width, height])
         this.svg.attr("id", "nation-svg")
         
        //  this.def = this.svg.append("defs")
 
        //  this.def.append("filter")
        //      .attr("id", "f1")
        //      .attr("x", "0")
        //      .attr("y", "0")
        //      .append("feGaussianBlur")
        //      // .attr("result","blur-source")
        //      .attr("in", "SourceGraphic")
        //      .attr("stdDeviation", "2")
 
 
         // Contains County names and states for the census tooltip
        //  this.mapTools = null
         // Data for the census tooltip
        //  this.updateCensus = null 
        //  this.census = null
         this.cur_census_county = null
         this.cur_census_state = null
         this.cur_census_title = null
         this.viewport = ""
 
     }
 

     /**
      * Important
      * censusQuery()'s job is to update the MDC.census object (which is different than this.MDC.census).
      * The census object itself is passed around by value and should not be used
      * to gain any current state information bc it is unreliable. However, updateCensus
      * still manages to update the MDC.census object appropriately. For this reason,
      * it is not wise to rely on the census object if it exists anywhere beyond the scope
      * of the MDC before this.MDC.updateCensus has modified it.
      * 
      * In other words, this.MDC.updateCensus reliably modifies MDC.census
      */
     tSearch = debounce( function() {

        censusQuery(this.cur_census_id, this.MDC.mapState.currentCountry, this.MDC.updateCensus, this.cur_census_title)
         
     }, 300) // 500ms delay for each hovered element before its punted serverside
 
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
 
             this.selectedRegion = null

             let url = new URL(window.location)
             url.searchParams.delete("loc")
             window.history.pushState(null, "Location Search - Return to Map", url.pathname + url.search)
 
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
 
             this.svg.transition().duration(750).call(
                 zoom.transform,
                 d3.zoomIdentity,
                 d3.zoomTransform(this.svg.node()).invert([width / 2, height / 2])
             )
 
         } catch(err) {
             console.log(err)
         }
     }
 
     _dispatchSelection(region_id){

        // console.log("Dispatch Selection from DataMap2.js")
        // console.log(this.MDC.mapState.currentCountry)

        switch (this.MDC.mapState.currentCountry) {
            case "/world": 
                /**
                 * Clicking on a region from a global map
                 */
                console.log("World is selected...")
                this.gotoPane(region_id)
                break;
            default:
                /**
                 * Clicking on a region from a country map
                 */
                console.log("Loading Region selection...")
                this.gotoRegion(region_id)
        } 

     }

     /**
      * A selection that loads a pane with a given/implied state
      * e.g. A country is selected from a global map. This should
      * load the stat's pane, but can happen from outside or inside
      * of the stat's pane itself.
      */
     gotoPane(country_id) {
        console.log("GotoPane: ", country_id)
        // TODO: Load /country with ?key
     }

     /**
      * A region was selected from a country map.
      * @param {} region_id 
      */
     gotoRegion(region_id) {
        // Set the proper window state
        let url = new URL(window.location)
        url.searchParams.delete("loc")
        url.searchParams.append("loc",region_id )
        window.history.pushState(null, "Location Search ", url.pathname + url.search)

        update_recent('loc', region_id)

        // let nbta

        // if (window.location.pathname.includes("occupations")) nbta = "occ"
        // if (window.location.pathname.includes("locations")) nbta = "loc"
        // if (window.location.pathname.includes("creators")) nbta = "cre"
        // if (window.location.pathname.includes("country")) nbta = "cou"

        this.MDC.mapDispatch({
            ...this.MDC.mapState,
            type: "SELECT_QUERY",
            selections: 1,
            info_pane: true,
            refetch: 1,
            // notebook_type_abbrev: nbta,
            new_location: region_id,
            new_occupation: null
        })
     }
 
     clicked(d,i) {
 
         if (window.location.pathname.includes('creators')) return
 
         // Highlight the current selection
         this.selectedRegion = d3.select(d3.event.target)
 
         this.adjustViewport(d)
         this.selectedRegion.style('stroke', 'red');
         this.selectedRegion.attr("stroke-width",1);
         this.selectedRegion.attr('vis', '1');
 
         /**
          * @Important
          * Trigger the Radar Component's useEffect. Doing so will prompt another map dispatch from Radar.js
          * 
          * (Below) If a selected county is not the most recently selected county, push it onto our history.
          * Else, simply update the current county we're looking at.
          */
 
         this._dispatchSelection(d3.event.target.id)
         console.log("Clicked: ", d3.event.target.id)
 
     }
 
     /**
      * Woosh around the map
      */
     adjustViewport(d) {
         const [[x1, y1], [x2, y2]] = path.bounds(d);
 
         d3.event.stopPropagation();
 
         let l_adjust = window.innerWidth > 768 ? 2.06 : 2;
 
         if (d3.event.sourceEvent == null) return

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
            
            // Box, port, whatever!
            this.svg.attr("viewBox", this.viewport)

            // In case the map attempts to render twice
            let check = document.getElementById('nation-svg') || null

            try {
                if (check && this.MDC.mapState.currentCountry == check.dataset.nation) {
                    console.log("Do-Datamap-2: currentCountry == dataset.nation")
                    // No need to redraw
                    return
                }
            } catch(err) {console.error(err)}

            
            var anchor = document.getElementById("nation-wrapper");
            anchor.innerHTML = ""
            var _this = this

            // Just a safety net against using makemap where you can't
            if (!anchor) {
                console.log("No map anchor was found.")
                return 0
            }

            this.g1.attr("id", "filter-group")
                .attr("filter", "0")

            /**
             * This is the interactive group of the svg.
             * Whether it's counties, provinces, cities or whatever
             * it is the interactive layer of the map, the one which
             * can be clicked on, zoomed in, and highlighted
             */
            {

            var has_layer_1 = false

            /**
             * This group is dedicated to boundaries around counties (regions, provinces, etc.)
             * Most countries will not have this data because the boundary is consequently provided by the counties.
             */
            if (this.layer_1.length > 0) {

                has_layer_1 = true

                // Generate State Mesh (layer_1 - only some maps have this layer e.g. states of the USA)
                this.g.append("g")
                    .selectAll('path')
                    .data(this.layer_1)
                    .enter().append("path")
                    .attr("fill", "none")
                    .attr("stroke", "white")
                    .attr("stroke-linejoin", "round")
                    .attr("d", d => String(d[0]))

            }

            // Generate counties & povinces (layer_2 - All maps have this layer)
            this.g.append("g")
                // .attr("id", "debug")
                .selectAll('path')
                .data(this.layer_2)
                .enter().append("path")
                // each county's init fill
                .attr("fill", "#0003")
                .attr("stroke", has_layer_1 ? null : "#fff8")
                .attr("stroke-width", has_layer_1 ? 0 : 0.5)
                .attr("id",    d => d[2])
                .attr('fip',   d => String(d[2]))
                .attr('title', d => String(d[1]))
                .attr("d",     d => String(d[0]))
                .on('mouseenter', function(e) {

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
                    var id = e[2]
                    var title = e[1]
                    _this.cur_census_title = title

                    try {
                        // add title to tooltip, immediately
                        _this.MDC.updateCensus({
                            ..._this.MDC.census,
                            //cur_census: null,
                            cur_census_title: title, 
                        })

                        // Add census data to tooltip via Redis call -- Debounced for safety
                        _this.cur_census_id = id
                        if (window.innerWidth > 768)
                            _this.tSearch()

                    } catch(err) {
                        console.error(err)
                        console.log(id)
                    }

                    let current_layer2_path = d3.select(this)
                    
                    // Current fill/stroke prior to interactive attributes
                    this.curFill = current_layer2_path.attr("fill")
                    this.curStroke = current_layer2_path.attr("stroke")
                    // this.curStrokeWidth = current_layer2_path.attr("stroke-width")

                    this.lastFill = this.curFill || "none"
                    this.lastStroke = this.curStroke || "none"
                    // this.lastStrokeWidth = this.curStrokeWidth || "none"
                    
                    current_layer2_path
                        .attr("fill", "orange")
                        .attr('stroke', 'orange')
                        // .attr('stroke-width', "1")

                })
                .on("click", this.clicked.bind(this))
                .on('mouseout', function() { 

                    let current_layer2_path = d3.select(this)

                    if (this.curFill) {
                        this.lastFill = this.curFill
                    }
                    if (this.curStroke) {
                        this.lastStroke = this.curStroke
                    }
                    
                    // No census tooltips on mobile. They display in the iNfo Pane
                    if (window.innerWidth > 768){
                        Array.from(document.getElementsByClassName('l-cursor')).forEach( el => {
                            el.classList.add('hide-me')
                        })
                    }

                    current_layer2_path
                        .attr('fill', this.curFill)
                        .attr('stroke', this.curStroke)

                }) 

 
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
                        this.selectedRegion = url.searchParams.get('loc')
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