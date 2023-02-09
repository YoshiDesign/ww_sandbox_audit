import * as d3 from "d3";
import { zip } from "d3";
import {colors} from "../../utils/utils"

const x_labels = ["60","61","62","63","64","65","66","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20"]
const yMax = d => Math.max(Object.values(d))
const yMin = 0


const years = [
1960,
1961,
1962,
1963,
1964,
1965,
1966,
1967,
1968,
1969,
1970,
1971,
1972,
1973,
1974,
1975,
1976,
1977,
1978,
1979,
1980,
1981,
1982,
1983,
1984,
1985,
1986,
1987,
1988,
1989,
1990,
1991,
1992,
1993,
1994,
1995,
1996,
1997,
1998,
1999,
2000,
2001,
2002,
2003,
2004,
2005,
2006,
2007,
2008,
2009,
2010,
2011,
2012,
2013,
2014,
2015,
2016,
2017,
2018,
2019,
2020]

export default class NationGraph {

    constructor(data) {
        console.log('Data', data)
        this.graphData = data
        this.dimensions = {
            width: window.innerWidth * 0.5,
            height: window.innerHeight - 100,
            margin: {
                top: 15,
                right: 15,
                bottom: 40,
                left: 60
            }
        }
        this.dimensions.boundedWidth = this.dimensions.width - this.dimensions.margin.left
        this.dimensions.boundedHeight = this.dimensions.height - this.dimensions.margin.top - this.dimensions.margin.bottom
        this.sets = {
            // label : {range: 100, }
        }
        // Used to access corresponding data points after data has been cleaned and aggregated
        this.xAccessor = d => Number(d.x)
        this.yAccessor = d => Number(d.y)

        // Used to flatline the graph when there's no data
        this.lastValue = 0

        this.draw()

    }

    draw() {

        const wrapper = d3.select("#graph-ts-wrapper")
        document.getElementById("graph-ts-wrapper").innerHTML = ""

        const svg = wrapper.append("svg")
            .attr("id", "nat-graph")
            .attr("width", this.dimensions.width)
            .attr("height", this.dimensions.height)

        const bounds = svg.append("g")
            .style("transform", `
                translate(${this.dimensions.margin.left}px, ${this.dimensions.margin.top}px)
            `)

        let num = 0
        
        for (let i = 0; i < Object.keys(this.graphData).length; i++) {

            var height = Object.keys(this.graphData).length * 120

            // Clean the incoming data. Remove NaN's and whatnot. TODO - Clean this data before it's stored in the database
            let cleaned_data = []
            Object.values(this.graphData[Object.keys(this.graphData)[i]]).forEach( (el, i) => {

                if (el == "" || !el) {
                    console.log(i)
                    
                    if (this.lastValue)
                        cleaned_data.push(this.lastValue)
                    else // This should only happen at the beginning of a graph where there's no data
                        cleaned_data.push(0)
                }
                else {
                    this.lastValue = el
                    cleaned_data.push(Number(el))
                }

            })

            // Combine the data with our x-values. IMPORTANT: For a dataset to be rendered it must have the exact number of indexes as the X values (years)
            var datas = []
            if (years.length != cleaned_data.length) {
                console.error("Runtime Error: NationGraph failed to render.")
                return 0
            }
            for (let i in years) {
                let next = {
                    x: years[i],
                    y: cleaned_data[i]
                }
                datas.push(next)
            }

            console.log('Datas:', datas)
            console.log(d3.extent(datas, this.yAccessor))
            var yScale = d3.scalePoint().domain(Object.keys(this.graphData)).range([this.dimensions.margin.top, height - this.dimensions.margin.bottom])
            var xScale = d3.scaleLinear().domain([1960, 2020]).range([0, this.dimensions.boundedWidth])
            var zScale = d3.scaleLinear()
                .domain([0, d3.extent(datas, this.yAccessor)[1]])
                .range([0, i * yScale.step()])

            let area = d3.area()
            .curve(d3.curveBasis)
            // .defined(d => !isNaN(d))
            .x((d, i) => xScale(this.xAccessor(d)))
            .y0(0)
            .y1(d => zScale(d.y))

            // .x(d => xScale(this.xAccessor(d)))
            // .y0(0)
            // .y1(d => yScale(this.yAccessor(d)))

            // let lineGenerator = d3.line()
            //     .x(d => xScale(this.xAccessor(d)))
            //     .y(d => yScale(this.yAccessor(d)))

            let line = area.lineY1()

            bounds.append("path")
                .attr("d", area(datas))
                .attr("fill", "#3333")

            bounds.append("path")
                .attr("d", line(datas))
                .attr("stroke", colors[num])
                .attr("stroke-width", "2")
                .attr("fill", "#333a")

            num++

        }

    }

    row(d) {
        return {
            x: d.x,
            y: d.y
        }
    }

    update() {

    }

    destroy() {
        console.log("Cleanup Graphs")
    }

}







































































// var round = function round(count) {
//     if (count < 1000) {
//         return (count) + "%";
//     } else if (count < 1000000) {
//         return Math.round(count / 1000) + "K";
//     } else {
//         return Math.round(count / 1000 / 1000) + "M";
//     }
// };

// /*
// * @param {Array} this.state.data - Arrar of arrays. ex. [["01/31/2016", 200], ["02/07/2016", 350]]
// */
// var chart = function chart(data) {
//     var chartWidth = 617;
//     var chartHeight = 300;
//     var margin = { top: 20, right: 30, bottom: 30, left: 60 };

//     // define axis ranges
//     var xExtents = d3.extent(data, function (d) {
//         return new Date(d[0]);
//     });
//     var yExtents = d3.extent(data, function (d) {
//         return d[1];
//     });

//     // scale for x axis. this will also be used to convert data.dates to their appropriate svg coordinate
//     var x = d3.time.scale().domain([xExtents[0], xExtents[1]]).rangeRound([0, chartWidth - margin.left - margin.right]);

//     // scale for y axis. this will also be used to convert data.values to their appropriate svg coordinate
//     var y = d3.scale.linear().domain([yExtents[0], Math.ceil(yExtents[0]) * 2]).range([chartHeight - margin.top - margin.bottom, 0]);

//     // define the x axis
//     var xAxis = d3.svg.axis().scale(x).orient('bottom').innerTickSize(-chartHeight - margin.top - margin.bottom).outerTickSize(0).ticks(data.length).tickFormat(d3.time.format('%m/%y')).tickPadding(20);

//     // define the y axis
//     var yAxis = d3.svg.axis().scale(y).orient('left').ticks(5).tickSize(0).tickFormat(round).tickPadding(10);

//     // graph line definition
//     var line = d3.svg.line().x(function (d) {
//         return x(new Date(d[0]));
//     }).y(function (d) {
//         return y(d[1]);
//     });

//     // define the svg
//     $('#chart').empty();
//     var chart = d3.select('#chart').append('svg').attr('class', 'line-chart').attr('width', chartWidth).attr('height', chartHeight).append('g').attr('class', 'main').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

//     // draw x axis
//     chart.append('g').attr('class', 'x-axis').attr('transform', 'translate(0, ' + (chartHeight - margin.top - margin.bottom) + ')').call(xAxis);

//     // draw y axis
//     chart.append('g').attr('class', 'y-axis').attr('transform', 'translate(0,0)').call(yAxis);

//     // add lines to the graph
//     chart.append('g').attr('class', 'line').selectAll('path').data([data]).enter().append('path').attr('d', line);

//     // tooltip
//     var tooltip = d3.select('#chart').append('div').attr('class', 'line-chart tooltip').style('opacity', 0);

//     // hover dot
//     chart.selectAll('circle').data(data).enter().append('circle').attr('id', function (d, i) {
//         return 'dot-' + i;
//     }).attr('cx', function (d, i) {
//         return x(new Date(d[0]));
//     }).attr('cy', function (d, i) {
//         return y(d[1]);
//     }).attr('r', 4).style('opacity', 0);

//     var barWidth = chartWidth / data.length;

//     // rects for hover reference
//     chart.selectAll('rect.hover-line').data(data).enter().append('rect').style('opacity', 0).attr('width', 2).attr('class', 'line-chart hover-line').attr('id', function (d, i) {
//         return 'line-' + i;
//     }).attr('height', function (d) {
//         return chartHeight - y(d[1]) - margin.top - margin.bottom;
//     }).attr('x', function (d, i) {
//         return x(new Date(d[0])) - 2 / 2;
//     }).attr('y', function (d, i) {
//         return y(d[1]) + 3;
//     }); // add height of dot to prevent overlap

//     chart.selectAll('rect.hover-box').data(data).enter().append('rect').style('opacity', 0).attr('class', 'line-chart hover-box').attr('width', barWidth).attr('height', function (d) {
//         return chartHeight - y(d[1]) - margin.top - margin.bottom;
//     }).attr('x', function (d, i) {
//         return x(new Date(d[0])) - barWidth / 2;
//     }).attr('y', function (d, i) {
//         return y(d[1]);
//     }).on('mouseover', function (d, i) {
//         var offset = $('#chart').offset(); // { left: 0, top: 0 }
//         var xtranslate = x(new Date(d[0]));

//         var chartFormat = d3.time.format("");
//         tooltip.style('opacity', 1).style('left', function () {
//             return x(new Date(d[0])) - 2 / 2 + margin.left + 25 + 'px';
//         }).style('top', d3.event.pageY - offset.top + 20 + 'px').html(chartFormat + (d[1]) + '%' );

//         // hover line
//         var currentLine = '#line-' + i;
//         d3.select(currentLine).style('opacity', 1);

//         // hover dot
//         var currentDot = '#dot-' + i;
//         d3.select(currentDot).style('opacity', 1);

//         // hover date
//         d3.selectAll('g[transform = "translate(' + xtranslate + ',0)"]').select('text').style('opacity', 1);
//     }).on('mouseout', function (d, i) {
//         var xtranslate = x(new Date(d[0]));

//         tooltip.style('opacity', 0);

//         // hover line
//         var currentLine = '#line-' + i;
//         d3.select(currentLine).style('opacity', 0);

//         // hover dot
//         var currentDot = '#dot-' + i;
//         d3.select(currentDot).style('opacity', 0);

//         // hover date
//         d3.selectAll('g[transform = "translate(' + xtranslate + ',0)"]').select('text[style = "text-anchor: middle; opacity: 1;"]').style('opacity', '0');
//     });
// };

// chart();