import * as d3 from "d3";
import * as topojson from "topojson-client";

const zoom = d3.zoom();
const pathGenerator = d3.geoPath();

function dataToTitle(string) {
    let splitString = string.split("_");
    for(var i = 0; i< splitString.length; i++){
        splitString[i] = splitString[i][0].toUpperCase() + splitString[i].slice(1);
    }
    return splitString.join(" ");
}

class DoChloroMap {

    constructor() {
        this.allCounties = null;
        this.allFipData  = null;
        this.dataPoint = null;
        this.color = null;
        this.selectedCounty = null;
        this.q_scale = null;
        this.d_title = null;
        this.allUSdata = null;
        this.wrapper = null;
        this.dimensions = null;
        this.pathGenerator = null;
        
    }

    zooming (_self) {

        let selection = d3.select(d3.event.target);
        const [[x0, y0], [x1, y1]] = pathGenerator.bounds(selection.datum());

        // d3.event.stopPropagation(); // Hmmm...
        selection.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity
                .translate(_self.dimensions.width / 2, _self.dimensions.height / 2)
                .scale(Math.min(8, 0.9 / Math.max((x1 - x0) 
                    / this.dimensions.width, (y1 - y0) 
                    / this.dimensions.height))
                )
                .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
            d3.mouse(selection.node()) // Current mouse coordinates
        )

        // Display the major tooltip
        // d3.select('#tip-description')
        //     .style('display','block')
        //     .style('height', window.innerHeight * 0.5 + "px");

        // d3.selectAll('.mod-btn').style('display', 'inline-block');

    }

    determineType(lookFor) {

        switch (lookFor) {

            case "col" :
                this.q_scale = [1, 163];
                this.dataPoint = "col";
                this.d_title = "Relative Cost of Living: "
                break;
            case "rav_any" : 
                this.q_scale = [1, 2000];
                this.dataPoint = "rav";
                this.d_title = "Average Rent Price: "
                break;
            case "rav_0" :
                this.q_scale = [150, 1210];
                this.dataPoint = "r0";
                this.d_title = "Average Studio Apartment Price: "
                break;
            case "rav_1" :
                this.q_scale = [1, 1300];
                this.dataPoint = "r1";
                this.d_title = "Average 1 Bedroom Apartment Pricie: "
                break;
            case "rav_2" :
                this.q_scale = [1, 1650];
                this.dataPoint = "r2";
                this.d_title = "Average 2 Bedroom Apartment Price: "
                break;
            case "rav_3" :
                this.q_scale = [1, 1900];
                this.dataPoint = "r3";
                this.d_title = "Average 3 Bedroom Apartment Price: "
                break;
            case "rav_4" :
                this.q_scale = [1, 2000];
                this.dataPoint = "r4";
                this.d_title = "Average 4 Bedroom Apartment Price: "
                break;

            default:
                this.q_scale = [1, 163];
                this.dataPoint = "col";
        }

    }

    async updateMap(type) {

        var _self = this;

        this.determineType(type);

        let paths = d3.selectAll('.countyNode');

        paths.each(function(node) {
            /**
             * @param node Carries the data
             * @var n is a beautiful thing.
             */
            let n = d3.select(this)
            let color = d3.scaleQuantize(_self.q_scale, d3.schemePuBu[9])
            n.transition().attr('fill', color(_self.allFipData[parseInt(node.id)][_self.dataPoint]));
        });
        
    }

    async drawMap(lookFor) {
        
        this.determineType(lookFor);
        var _self = this;

        const us = await d3.json('./../../datas/new_albers.json');
        this.allUSdata = topojson.feature(us, us.objects.counties).features;
        
        const data = await d3.json('../../datas/FIP_co_data_4.json');
        this.allFipData = data;

        let color = d3.scaleQuantize(this.q_scale, d3.schemePuBu[9]);
        
        this.color = color;

        let currentValueAccessor = d => data[d.id][this.dataPoint];
        let currentNameAccessor = d => data[d.id].county_name;
        let currentStateAccessor = d => data[d.id].state;

        const dimensions = {
            "scale" : 1,
            "height" : window.innerHeight,
            "width" :  window.innerWidth,
            "margin" : {
                "top" : 10,
                "bottom" :  10,
                "left" : 10,
                "right" : 10
            }
        };

        this.dimensions = dimensions;

        dimensions.boundedWidth = dimensions.width - (dimensions.margin.left + dimensions.margin.right);
        dimensions.boundedHeight = dimensions.height - (dimensions.margin.top + dimensions.margin.bottom);

        /**
         * 
         * Wrappers, bounds, counties and states
         * 
         */
        // TODO This might not be necessary, test tsetsetest se tsets test it
        d3.select('#chloro-map-wrapper').select("svg").remove();

        const wrapper = d3.select('#chloro-map-wrapper')
            .style('display', 'inline-block')
            .append("svg")
                .attr("viewBox", [0, 0, dimensions.width, dimensions.height])
                // .on("click", reset);


        // d3.select('#chloro-map-wrapper').select("svg").on('click', function(){
        //     _self.zooming(_self);
        // },d3.event);

        this.wrapper = wrapper;
        // d3.select('#chloro-map-wrapper').select("svg").on('click', reset);
        const bounds = wrapper.append("g")
            .style("transform", `translate(-${
                dimensions.margin.left
            }px,${
                dimensions.margin.top
            }px)`)

        const counties = bounds.append("g")
            .selectAll("path")
            .data(this.allUSdata)
            .enter().append("path")
                .attr("class", "countyNode")
                .attr('fip',  d => String(d.id))
                .attr("fill", d => color(data[parseInt(d.id)][this.dataPoint]))
                .attr("d", pathGenerator)

        const states = bounds.append("path")
            .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-linejoin", "round")
            .attr("d", pathGenerator)
            .attr("zooming", '1')

        const zooms = d3.select("[zooming]")
        // zooms.call()

        /**
         * 
         * Event listeners
         * 
         */
        zoom.scaleExtent([1, 8])
            .on("zoom", zoomed);

        function zoomed() {
            const {transform} = d3.event;
            counties.attr("transform", transform);
            counties.attr("stroke-width", 1 / transform.k);
            states.attr("transform", transform);
            // states.attr("stroke-width", 1 / transform.k);
            states.style('opacity', 0)
        }

        counties.on('mouseenter', function(data, i, n) {
            // console.log(this);
            d3.select(this)
                .style("fill", "orange")
                .style('stroke', 'yellow')

            displayTooltip(data, d3.event);
        });

        counties.on('mouseout', function(da, i, n) {
            let curCounty = d3.select(this)
        
            // TODO Can this be optimized?
            curCounty.style('fill', color(data[parseInt(da.id)][this.dataPoint]))

            if (curCounty.attr('vis') == undefined)
                curCounty.style('stroke', 'none');

            d3.select('#chloro-tooltip').style('opacity', 0);

        });      // Using data from up yonder

        // Zoom function
        counties.on("click", function(data, i, n) {

            // Get the selected county path
            let selection = d3.select(this);
            this.selectedCounty = selection;

            console.log(selection);
            // Track the last county selection and its fill value
            if (_self.selectedCounty != null) {
                _self.selectedCounty[0].attr('fill', _self.selectedCounty[1])
            }
            // Acquire the last county selection and its fill
            _self.selectedCounty = [selection, selection.attr('fill')];

            selection.attr('fill', 'orange');
            selection.style('stroke', 'yellow');
            selection.attr('vis', '1');

            
        });

        this.allCounties = counties;

        /* *
         * 
         * Tooltip functions
         * 
         */
        const tooltip = d3.select('#chloro-tooltip')
        function displayTooltip (datapoint, e) {

            tooltip.style("opacity", 1)
            tooltip.select('#chloro-value-title').text(_self.d_title);
            tooltip.select('#chloro-value').text(currentValueAccessor(datapoint));
            let countyName = currentNameAccessor(datapoint)
            let stateName = currentStateAccessor(datapoint)

            tooltip.select('#county_name_tip').text(dataToTitle(countyName) + " County ");
            tooltip.select('#state_name_tip').text(dataToTitle(stateName));

            const x = e.clientX;
            const y = e.clientY - 20;
            
            tooltip.style('transform', `translate(`
            + `calc( -50% + ${x}px),`
            + `calc( -100% + ${y}px)`
            + `)`)
        }

        function reset() {
            console.log(_self);
            let svg = d3.select('#chloro-map-wrapper').select("svg");
            svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity,
                d3.zoomTransform(svg.node())
                    .invert([_self.dimensions.width / 2, _self.dimensions.height / 2])
    
            );
        }

        /**
         * Dunzo
         */
        return {
            "states" : states,
            "counties" : counties,
            "data" : data
        };
    }

}

export default DoChloroMap;