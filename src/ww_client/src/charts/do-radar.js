import * as d3 from 'd3'
import {normalString, titleCase} from './helpers/helpers'

/**
 * Used to keep our values within a suitable
 * range for the radar plot
 */
function normalize200(data) {
    try {

        let new_data = []

        for (let set of data) {
 
            set["value"] = set["value"] * 0.01
            if (set["value"] > 2)
                set["value"] = 2
            new_data.push(set)
        }

        return new_data

    } catch (err) {return}
}

export function RadarSetup(state, cities, target_city_id) {

    setInterval(function() {
        Array.from(document.getElementsByClassName('rcl'), function(el){
            el.classList.remove('no-evt', 'dim')
        })
    }, 1000)

    // Clear the city list
    let cityList = document.getElementById('city-radar-list')
    cityList.innerHTML = ""
    let cityBtn = document.createElement('BUTTON')
    let update_notification = document.createElement('SPAN')
    update_notification.classList.add('hide-me')
    update_notification.textContent = "Graph Updated!"
    cityBtn.classList.add('wa-btn')
    cityBtn.classList.add('rcl')

    /**
     * Builds the city list beneath the radar chart
     * and sets the event listeners.
     * 
     * Builds the radar chart
     */
    var margin = {top: 65, right: 65, bottom: 65, left: 65},
        width = Math.min(280, window.innerWidth - 10) - margin.left - margin.right,
        height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

    var color = d3.scaleOrdinal(d3.schemeCategory10)
        .range(["#FF0000","#0000FF","#e3e3e3"]);

    var radarChartOptions = {
        w: width,
        h: height,
        margin: margin,
        maxValue: 2,
        levels: 2,
        roundStrokes: true,
        color: color
    };

    var data = []

    var state_datas = [
        {axis: "Health Services", value: parseInt(state['hea'])},
        {axis: "Groceries", value: parseInt(state['gro'])},
        {axis: "Housing", value: parseInt(state['hou'])},
        {axis: "Utilities", value: parseInt(state['uti'])},
        {axis: "Transportation", value: parseInt(state['tra'])},
        {axis: "Entertainment", value: parseInt(state['ent'])}
    ];

    // Making the cities easier to address from local storage
    var citiesForStorage = {}
    for (let c of cities) {
        citiesForStorage[c._id] = c
    }

    // Store
    window.sessionStorage.setItem("cities", JSON.stringify(citiesForStorage))
    window.sessionStorage.setItem("state", JSON.stringify(state))
    document.getElementById("cc").innerText = "(" + String(cities.length) + ")"
    let tabIndex = 0
    for (var city of cities) {

        let weBuiltThisCity = cityBtn.cloneNode(true)
        let cityName = city.name.split('_').join(" ")
        let update_notification_clone = update_notification.cloneNode(true)

        weBuiltThisCity.setAttribute('tabindex', String(tabIndex++))
        weBuiltThisCity.setAttribute('role', 'button')

        if (tabIndex == 0)
            weBuiltThisCity.setAttribute('aria-pressed', 'true')
        else
            weBuiltThisCity.setAttribute('aria-pressed', 'false')

        weBuiltThisCity.innerText = titleCase(normalString(cityName))
        weBuiltThisCity.id = city._id

        weBuiltThisCity.addEventListener('click', function(e) {

            /**
             * Whenever a county is selected its city & state data is immediately
             * stored in sessionStorage and overwritten upon every selection
             */

            // The city selection
            city = JSON.parse(window.sessionStorage.cities)[e.target.id]
            // The state this city is in
            state = JSON.parse(window.sessionStorage.state)

            // Remove previous active selection
            Array.from(document.getElementsByClassName('rcl'), function(el){
                el.classList.remove('active-btn')
                el.setAttribute('aria-pressed', 'false')
                el.classList.add('no-evt', 'dim')
                
            })

            var tar = e.currentTarget
            tar.setAttribute('aria-pressed', 'true')
            tar.classList.add('active-btn')
            tar.children[0].classList.remove('hide-me')
            tar.children[0].classList.add('graph-update')

            setTimeout(function(){
                tar.children[0].classList.add('hide-me')
                tar.children[0].classList.remove('graph-update')
            }, 3000)

            try {

                var city_datas = [
                    {axis: "Health Services", value: parseInt(city['hea'] )},
                    {axis: "Groceries", value: parseInt(city['gro'] )},
                    {axis: "Housing", value: parseInt(city['hou'] )},
                    {axis: "Utilities", value: parseInt(city['uti'])},
                    {axis: "Transportation", value: parseInt(city['tra'])},
                    {axis: "Entertainment", value: parseInt(city['ent']) }
                ]
                // City data will be NaN if it isn't redefined here. This can clearly be optimized.
                state_datas = [
                    {axis: "Health Services", value: parseInt(state['hea'])},
                    {axis: "Groceries", value: parseInt(state['gro'])},
                    {axis: "Housing", value: parseInt(state['hou'])},
                    {axis: "Utilities", value: parseInt(state['uti'])},
                    {axis: "Transportation", value: parseInt(state['tra'])},
                    {axis: "Entertainment", value: parseInt(state['ent'])}
                ];
                console.log("Cities: ", city_datas)
                console.log("State: ", state_datas)
            } catch (err) {
                console.log(err)
            }
            let d = [city_datas, state_datas]
            for (let set in d){
                d[set] = normalize200(d[set])
            }

            RadarChart(".radarChart", d, radarChartOptions)

        })

        weBuiltThisCity.appendChild(update_notification_clone)
        cityList.appendChild(weBuiltThisCity)

        // Highlight and focus the first item upon init
        if (city._id == target_city_id) {
            document.getElementById(city._id).focus()
            document.getElementById(city._id).classList.add('active-btn')

            var city_datas = [
                {axis: "Health Services", value: parseInt(city['hea'] )},
                {axis: "Groceries", value: parseInt(city['gro'] )},
                {axis: "Housing", value: parseInt(city['hou'] )},
                {axis: "Utilities", value: parseInt(city['uti'])},
                {axis: "Transportation", value: parseInt(city['tra'])},
                {axis: "Entertainment", value: parseInt(city['ent']) }
            ]

            data.push(city_datas);
        }
    }

    data.push(state_datas);

    // Some of the ridiculously high numbers
    // mess with the radar chart. 
    // Handling this more gracefully is a big TODO
    for (let set in data){
        data[set] = normalize200(data[set])
    }

    RadarChart("#radar_1", data, radarChartOptions);
    
}

export function RadarChart(id, data, options) {

    try {
    var cfg = {
        w: 600,				//Width of the circle
        h: 600,				//Height of the circle
        margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
        levels: 2,				//How many levels or inner circles should there be drawn
        maxValue: 2, 			//What is the value that the biggest circle will represent
        labelFactor: 1.2, 	//How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
        opacityArea: 0.15, 	//The opacity of the area of the blob
        dotRadius: 2, 			//The size of the colored circles of each blob
        opacityCircles: 0.1, 	//The opacity of the circles of each blob
        strokeWidth: 1, 		//The width of the stroke around each blob
        roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
        color: d3.scaleOrdinal(d3.schemeCategory10)	//Color function
    };
    
    //Put all of the options into a variable called cfg
    if('undefined' !== typeof options){
        for(var i in options){
            if('undefined' !== typeof options[i]){ cfg[i] = options[i]; 
            }
        }
    }
    
    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i) {
        return d3.max(i.map(function(o){
            return o.value;
        }))
    }));
        
    var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
        total = allAxis.length,					//The number of different axes
        radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
        Format = d3.format('%'),			 	//Percentage formatting
        angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
    
    //Scale for the radius
    var rScale = d3.scaleLinear(d3.schemeCategory10)
        .range([0, radius])
        .domain([0, maxValue]);

    /////////////////////////////////////////////////////////
    //////////// Create the container SVG and g /////////////
    /////////////////////////////////////////////////////////

    //Remove whatever chart with the same id/class was present before
    d3.select(id).select("svg").remove();
    
    //Initiate the radar chart SVG
    var svg = d3.select(id).append("svg")
            .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
            .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)

    //Append a g element		
    var g = svg.append("g")
            .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
    
    /////////////////////////////////////////////////////////
    ////////// Glow filter for some extra pizzazz ///////////
    /////////////////////////////////////////////////////////
    
    //Filter for the outside glow
    var filter = g.append('defs').append('filter').attr('id','glow'),
        feMerge = filter.append('feMerge'),
        feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur')
        // feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

    var axisGrid = g.append("g").attr("class", "axisWrapper");
    
    axisGrid.selectAll(".levels")
       .data(d3.range(1,(cfg.levels)).reverse())
       .enter()
        .append("circle")
        .attr("class", "gridCircle")
        // transition USA circle here
        .attr("r", function(d, i){return radius/cfg.levels*d;})
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles)
        .style("filter" , "url(#glow)")
        
    var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    // axis.append("line")
    //     .attr("x1", 0)
    //     .attr("y1", 0)
    //     .attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
    //     .attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
    //     .attr("class", "line")
    //     .style("stroke", "white")
    //     .style("stroke-width", "2px");

    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "13px")
        .style("fill", "white")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
        .text(function(d){return d})

    var radarLine = d3.lineRadial()
        .radius(function(d) { return rScale(d.value); })
        .angle(function(d,i) {	return i*angleSlice; });
        
    if(cfg.roundStrokes) {
        radarLine.curve(d3.curveCardinalClosed)
    }
                	
    var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");

    blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function(d,i) { return radarLine(d); })
        .style("fill", function(d,i) { return cfg.color(i); })
        .style("fill-opacity", cfg.opacityArea)

    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .transition().duration(900)
        .attr("d", function(d,i) { return radarLine(d); })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", function(d,i) { return cfg.color(i); })
        .style("fill", "none")
        .style("filter" , "url(#glow)");		

    blobWrapper.selectAll(".radarCircle")
        .data(function(d,i) { return d; })
        .enter().append("circle")
        .attr("fill", "none")
        .attr("class", "radarCircle")
        .style("fill-opacity", 0.0)
        .attr("r", cfg.dotRadius)
        // .transition().duration(900)
        // .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
        // .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
        // .style("fill", function(d,i) { /*console.log(`I == ${i} == ${String(cfg.color(i))}`); */ return cfg.color(i); })
        // .style("fill-opacity", 0.7);

    Array.from(document.getElementsByClassName('rcl'), function(el){
        el.classList.remove('no-evt', 'dim')
    })

    } catch (err) {}
    
}//RadarChart