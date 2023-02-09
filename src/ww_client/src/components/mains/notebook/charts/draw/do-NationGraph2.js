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

// const fills = ["#03071e", "#370617", "#6a040f", "#9d0208", "#d00000", "#dc2f02", "#e85d04", "#f48c06", "#faa307", "#ffba08"]
// const strokes = ["#54478c", "#2c699a", "#048ba8", "#0db39e", "#16db93", "#83e377", "#b9e769", "#efea5a", "#f1c453", "#f29e4c"]
const strokes = ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#f72585", "#f3722c", "#38b000", "#4cc9f0", "#b5179e"]
const fills = ["#ff595e7d", "#ffca3a7d", "#8ac9267d", "#1982c47d", "#6a4c937d", "#f725857d", "#f3722c7d", "#38b0007d", "#4cc9f07d", "#b5179e7d"]
// const fills = ["#54478c7d", "#2c699a7d", "#048ba87d", "#0db39e7d", "#16db937d", "#83e3777d", "#b9e7697d", "#efea5a7d", "#f1c4537d", "#f29e4c7d"]
// const strokes = ["#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000"]

const parseDate = d3.timeParse("%m/%d/%Y"),
    formatDate = d3.timeFormat("%b %d"),
    formatMonth = d3.timeFormat("%b");

export default class NationGraph2 {

    constructor(data, _enum){
        console.log('Data', data)
        this.graphData = data
        this._enum = _enum
        this.dimensions = {
            width: window.innerWidth * 0.5,
            height: 150,
            margin: {
                top: 15,
                right: 15,
                bottom: 40,
                left: 60
            }
        }

        this.dimensions.boundedWidth = this.dimensions.width - this.dimensions.margin.left
        this.dimensions.boundedHeight = this.dimensions.height - this.dimensions.margin.top - this.dimensions.margin.bottom

        this.svg = null
        this.max_graphs = 9 // TODO make this variable more apparent
        // Used when data needs to be omitted
        this.lastValue = 0

        this.dParse = d3.timeParse("%Y")
        this.xAccessor = d => this.dParse(d.x)
        this.yAccessor = d => d.y

        this.xScale = null
        this.yScale = null
        
        this.area = d3
            .area()
            .x((d) => { return this.xScale(this.xAccessor(d)); })
            .y0(this.dimensions.height)
            .y1((d) => { return this.yScale(this.yAccessor(d)); })
            .curve(d3.curveCardinal);
    
        this.valueline = d3
            .line()
            .x((d) => { return this.xScale(this.xAccessor(d)); })
            .y((d) => { return this.yScale(this.yAccessor(d)); })
            .curve(d3.curveCardinal);

        this.areaPath = null
        this.linePath = null
        this.pathLength = null

        // TODO
        this.dataType = ""
        this.datas = []
        this.cleanData()
        this.draw()
    }

    draw() {

        Array.from(document.getElementsByClassName('x-axis')).forEach( el => {
            el.classList.add('hide-me')
        })

        this.xScale = d3.scaleTime().domain(d3.extent(this.datas, this.xAccessor)).range([0, this.dimensions.width])
        this.yScale = d3.scaleLinear().domain(d3.extent(this.datas, this.yAccessor)).range([this.dimensions.height, 0]);

        this.svg = d3.select("#graph-ts-wrapper")
        .append("svg")
        .attr("style", `position:absolute; left:0; top:${String(this._enum * 40)}px`)
        .attr(
        "viewBox",
            `0 0 ${this.dimensions.width + this.dimensions.margin.left + this.dimensions.margin.right} ${
                this.dimensions.height + this.dimensions.margin.top + this.dimensions.margin.bottom}`)
        .append("g")
            .attr("transform", "translate(20," + this.dimensions.margin.top + ")");

        // X Axis
        const xAxisGenerator = d3.axisBottom().scale(this.xScale)
        this.svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + this.dimensions.height + ")")
        .call(xAxisGenerator) // ???

        // // Y Axis
        // this.svg.append("g").attr("class", "y-axis").call(d3.axisLeft(this.yScale));

        // this.svg.append("text")
        //     .attr("transform", "rotate(-90)")
        //     .attr("y", 0 - this.dimensions.margin.left)
        //     .attr("x", 0 - this.dimensions.height / 2)
        //     .attr("dy", "1em")
        //     .style("text-anchor", "middle")

        // .text("YAXIS");

        this.appendData()

    }

    appendData() {

        this.svg
            .select(".x-axis") // set the x-axis
            .attr("fill", "transparent")
            .transition()
            .duration(750)
            .attr("fill", strokes[this._enum % this.max_graphs])

            // .call(d3.axisBottom(this.xScale))

        // this.svg
        //     .select(".y-axis") // set the y-axis
        //     .transition()
        //     .duration(750)
        //     .call(d3.axisLeft(this.yScale));
        
        this.areaPath = this.svg
            .append("path")
            .data([this.datas])
            .attr("fill", "transparent")
            .attr("d", this.area)
            //.attr("transform", "translate(0,300)")
            .transition()
            .duration(500)
            //.attr("transform", "translate(0,0)")
            .attr("fill", fills[this._enum % this.max_graphs])   

        this.linePath = this.svg
            .append("path")
            .data(Array(this.datas))
            .attr("class", "ng-line")
            .attr("d", this.valueline)
            .attr('fill', 'transparent')
        
        this.pathLength = this.linePath.node().getTotalLength();

        console.log("Path Length: ", this.pathLength)
        
        this.linePath
            // .attr("stroke-dasharray", this.pathLength)
            // .attr("stroke-dashoffset", this.pathLength)
            .attr("stroke-width", 3)
            .transition()
            .duration(1000)
            .attr("stroke-width", 2)
            .attr("stroke", strokes[this._enum % this.max_graphs])
            // .attr("stroke-dashoffset", 0);

        this.svg
            .append("text")
            .attr("class", "title")
            .attr("x", this.dimensions.width / 2)
            .attr("y", this.dimensions.margin.top)
            .attr("text-anchor", "middle")

    }


    /**
     * TODO - Audit this function or the need for it
     * @returns 
     */
    cleanData() {

        let cleaned_data = []
        Object.values(this.graphData).forEach( (el, i) => {

            if (el == "" || !el) {
                
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

        if (years.length != cleaned_data.length) {
            console.error("Runtime Error: NationGraph failed to render.")
            return 0
        }
        for (let i in years) {
            let next = {
                x: years[i],
                y: cleaned_data[i]
            }
            this.datas.push(next)
        }

        console.log('Datas:', this.datas)

    }

}