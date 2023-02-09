import * as d3 from "d3";
import * as topojson from "topojson-client";
import scaleCluster from 'd3-scale-cluster'

const path = d3.geoPath()
const svg = d3.create("svg")
    .attr("viewBox", [0, 0, 975, 610])
    
const zoom = d3.zoom()
const g = svg.append("g");
const labels = ["low", "", "high"]

class MakeWorkforce {

    constructor() {
        this.colors = []
        this.loScale = null
        this.pkScale = null

        this.loquo = null
        this.perk = null
        this.empl = null
        
        this.data = null
        this.geoData = null
        this.usMesh = null

        this.options = null

        this.loClusters = null
        this.pkClusters = null
        this.emClusters = null

        /**
         * @var dbuff is the most optimal form this data could be sitting in for THIS MAP
         * Of the three data types used for this map, only 2 should are used simultaneously (Bivariate)
         * There are 3 ways to arrange the set when more than 1 datapoint has been selected:
         *                  [loQuo, per1K] || [loQuo, ttEmp] || [per1K, ttEmp]
         */
        this.dbuff= {}
    }
    
    color = (value) => {
        if (!value || value == undefined) return "#211f35"; 
        let [a, b] = value;
    
        return this.colors[this.loScale(a) + this.pkScale(b) * 3]
    }

    async fetch_data(_self) {

        /**
         * This will be a network request when we move to GQL
         */
        try {
            _self.data = null
            _self.data = await d3.json('./../../datas/new_bls_fips_arrayed/occ_a_' + String(_self.options.occ_code) +  '.json')
            return true
        } catch (e) {
            console.log(e)
            return false
        }

    }

    /**
     * create_state -- We create a data structure {
     * 
     *  "fip_code" : [0, 0],
     *  "fip_code" : [0, 0],
     *  "fip_code" : [0, 0],
     * 
     * }
     * Change the map's displayed data.
     * Data points 1 through 6.
     * Can display 2 at a time or 1 at a time
     * 
     * 1 && 2 == LoQuo / PerK
     * 1 && 3 == LoQuo / Total
     * 2 && 3 == PerK / Total
     * 4 == Only LoQuo
     * 5 == Only PerK
     * 6 == Only Total Emp
     */
    create_state = (_self) => {
        // First, reset all of the necessary variables
        _self.loquo = null
        _self.perk = null
        _self.empl = null
        _self.loClusters = null
        _self.pkClusters = null
        _self.emClusters = null

        try{
            // If the LoQuo is part of this query
            if (_self.options.data_type == 1 || _self.options.data_type == 2 || _self.options.data_type == 4){
                _self.loquo = Array.from(_self.data, d => {

                    var fip = d['f']
                    // Create the record in our data buffer if it isn't there yet
                    if (typeof(_self.dbuff[fip]) === "undefined") {
                        _self.dbuff[fip] = [0,0]
                    }

                    // Set the first index of this fip's data to the Location Quotient
                    _self.dbuff[fip][0] = d.lpe[0]    // Important: Explicit indexing. Don't just push()
                    return d.lpe[0]
                })
            }
            if (_self.options.data_type == 1 || _self.options.data_type == 3 || _self.options.data_type == 5){
                _self.perk = Array.from(_self.data, d => {
                    var fip = d['f']
                    if (typeof(_self.dbuff[fip]) === "undefined") {
                        _self.dbuff[fip] = [0,0]
                    }

                    _self.dbuff[fip][1] = d.lpe[1]
                    return d.lpe[1]
                })
            }
            if (_self.options.data_type == 2 || _self.options.data_type == 3 || _self.options.data_type == 6){
                _self.empl = Array.from(_self.data, d => {
                    var fip = d['f'] 
                    if (typeof(_self.dbuff[fip]) === "undefined") {
                        _self.dbuff[fip] = [0,0]
                    }

                    _self.dbuff[fip][2] = d.lpe[2]
                    return d.lpe[2]
                })
            }

            /**
             * Create our scale functions using the
             * ckmeans algo as implemented in scaleCluster()
             * See d3-scale-cluster
             */
            if (this.loquo) {
                this.loScale = scaleCluster()               // represents x or y
                    .domain(this.loquo)
                    .range([1,2,3,4,5,6]);
                    this.loClusters  = this.loScale.clusters();
            }
            if (this.perk) {
                this.pkScale = scaleCluster()               // represents x or y
                .domain(this.perk)
                .range([1,2,3,4,5,6]);
                this.pkClusters  = this.pkScale.clusters();
            }
            if (this.empl) {
                this.emScale = scaleCluster()               // represents x or y
                    .domain(this.empl)
                    .range([1,2,3,4,5,6]);
                    this.emClusters  = this.emScale.clusters();
            }
            
            return true

        } catch (e) {
            console.log(e)
        }
    }

    async updateMap(options) {

        var _self = this;
        _self.dbuff = {}
        _self.options = options
        var success

        if (options.fetch_data)
            success = await _self.fetch_data(_self)

        // TODO we don't need to change the color every time we update the map
        _self.chooseColor(Number(options.color_swatch))

        let paths = d3.selectAll('[fip]');
        _self.create_state(_self)

        this.construct_map()
        // paths.each(function(node) {

        //     console.log("--- NODE ---")
        //     /**
        //      * @param node Carries the data
        //      * @var n is a beautiful thing.
        //      */

        //     // node.id is the geoData's county fip id value, not a <path>'s [id]

        //     let n = d3.select(this)

        //     n.transition().attr('fill', _self.color(_self.dbuff[parseInt(node.id)]));
        // });

        return true

    }

    resetOrFill = (_self, path) => {

    }

    chooseColor = (color_swatch) => {

        // this.colors = null

        switch (color_swatch) {
            case 1: 
                // 6x6 BuPu
                this.colors = ["#e8e8e8", "#cee2e2", "#b3dcdc", "#97d6d6", "#7acfcf", "#5ac8c8", "#e0cedc", "#cecedc", "#b3cedc", "#97ced6", "#7acecf", "#5ac8c8", "#d8b4d1", "#ceb4d1", "#b3b4d1", "#97b4d1", "#7ab4cf", "#5ab4c8", "#cf9ac5", "#ce9ac5", "#b39ac5", "#979ac5", "#7a9ac5", "#5a9ac5", "#c780b9", "#c780b9", "#b380b9", "#9780b9", "#7a80b9", "#5a80b9", "#be64ac", "#be64ac", "#b364ac", "#9764ac", "#7a64ac", "#5a64ac"]
                break;
            case 2: 
                // 6x6 BlGn
                this.colors = ["#ffffff", "#ffddd1", "#ffbaa3", "#ff9475", "#ff6644", "#ff0000", "#dfd3f9", "#dfb7cc", "#df9a9f", "#df7a72", "#df5442", "#df0000", "#bda9f3", "#bd92c7", "#bd7b9b", "#bd626f", "#bd4441", "#bd0000", "#977fec", "#976ec1", "#975d97", "#974a6c", "#97333f", "#970000", "#6b57e4", "#6b4bbb", "#6b3f92", "#6b3269", "#6b233d", "#6b0000", "#2130db", "#212ab3", "#21238c", "#211c64", "#21133a", "#210000"]
                break;
            case 3:
                // 6x6 YlGn
                this.colors = ["#c5fffb", "#ade0ed", "#95c1e1", "#7ea3d6", "#6784cd", "#4f66c5", "#c7ffe8", "#afe0db", "#97c1d0", "#7fa3c6", "#6884be", "#5066b7", "#cbffd2", "#b2e0c7", "#9ac1bd", "#82a3b4", "#6a84ac", "#5266a5", "#ceffb8", "#b6e0ad", "#9dc1a5", "#84a39d", "#6c8496", "#536690", "#d2ff95", "#b9e08d", "#9fc186", "#86a37f", "#6e847a", "#546675", "#d6ff56", "#bde052", "#a3c14d", "#89a34a", "#708447", "#566644"]
                break;
            case 4:
                // 3x3 YlGn
                this.colors = ["#ffffff", "#fff0d9", "#ffe0b2", "#ffd089", "#ffbe5e", "#ffac30", "#e5d4ff", "#e5c8d9", "#e5bab2", "#e5ad89", "#e59e5e", "#e58f30", "#caa9ff", "#ca9fd9", "#ca94b2", "#ca8a89", "#ca7e5e", "#ca7230", "#af7dff", "#af76d9", "#af6eb2", "#af6689", "#af5d5e", "#af5430", "#914cff", "#9148d9", "#9143b2", "#913e89", "#91395e", "#913330", "#6200ff", "#6200d9", "#6200b2", "#620089", "#62005e", "#620030"]
                break;
            case 5:
                // YlGn
                this.colors = ["#e8e8e8", "#cee2e2", "#b3dcdc", "#97d6d6", "#7acfcf", "#5ac8c8", "#e4debe", "#cedebe", "#b3dcbe", "#97d6be", "#7acfbe", "#5ac8be", "#dfd492", "#ced492", "#b3d492", "#97d492", "#7acf92", "#5ac892", "#dbc964", "#cec964", "#b3c964", "#97c964", "#7ac964", "#5ac864", "#d6be34", "#cebe34", "#b3be34", "#97be34", "#7abe34", "#5abe34", "#d1b200", "#ceb200", "#b3b200", "#97b200", "#7ab200", "#5ab200"]
                break;
            default:
                // 6x6 BuPu
                this.colors = ["#e8e8e8", "#cee2e2", "#b3dcdc", "#97d6d6", "#7acfcf", "#5ac8c8", "#e0cedc", "#cecedc", "#b3cedc", "#97ced6", "#7acecf", "#5ac8c8", "#d8b4d1", "#ceb4d1", "#b3b4d1", "#97b4d1", "#7ab4cf", "#5ab4c8", "#cf9ac5", "#ce9ac5", "#b39ac5", "#979ac5", "#7a9ac5", "#5a9ac5", "#c780b9", "#c780b9", "#b380b9", "#9780b9", "#7a80b9", "#5a80b9", "#be64ac", "#be64ac", "#b364ac", "#9764ac", "#7a64ac", "#5a64ac"]

        }
    }
    /**
     * Called by the MapThree component
     * @param {*} options 
     */
    async makeMap (options) {

        this.options = options
        var _self = this

        // Select the color swatch
        // Generate them here: https://observablehq.com/@benjaminadk/bivariate-choropleth-color-generator
        this.chooseColor(options.color_swatch)

        // Our occupational statistics
        this.data = await d3.json('./../../datas/new_bls_fips_arrayed/occ_a_' + String(this.options.occ_code) +  '.json')

        // All Topologies
        this.geoData = await d3.json('./../../datas/new_albers.json');

        // Generate Mesh for States
        this.usMesh = topojson.mesh(this.geoData, this.geoData.objects.states, (a, b) => a !== b)

        // Set our color scale functions and create our thresholds
        this.create_state(_self)

        // Present the map
        this.construct_map()
    }

    construct_map () {

        g.innerHTML = ""

        // Render the county features
        g.append("g")
        .selectAll("path")
        .data(topojson.feature(this.geoData, this.geoData.objects.counties).features)
        .enter().append("path")
        .on('mouseenter', function(data, i, n) {

            d3.select(this)
                // .style("fill", "orange")
                .attr('stroke', 'yellow')

            // displayTooltip(data, d3.event);
        })
        .on("click", this.clicked)
        .on('mouseout', function(da, i, n) {
            let curCounty = d3.select(this)
            let curFill = curCounty.attr('fill')

            // TODO Can this be optimized?
            // curCounty.style('fill', _self.color(data[parseInt(da.id)][this.dataPoint]))
            curCounty.attr('fill', curFill)

            if (curCounty.attr('vis') == undefined)
                curCounty.attr('stroke', 'none');

            d3.select('#chloro-tooltip').style('opacity', 0);
    
        })      // Using data from up yonder
            .attr("fill", d => this.color(this.dbuff[d.id]))
            .attr('fip',  d => String(d.id))
            .attr("d", path)

        // Generate State Mesh
        g.append("path")
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-linejoin", "round")
            .attr("d", path(this.usMesh))

        // svg.call(zoom);
        document.getElementById("mapThreeAnchor").append(svg.node())
    }

}
export { MakeWorkforce }