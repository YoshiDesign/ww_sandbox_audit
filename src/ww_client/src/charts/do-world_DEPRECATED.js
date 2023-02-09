import * as d3 from "d3";

class DoWorld {
    async drawMap() {

        // 1. Access data
      
        const countryShapes = await d3.json("./../../datas/world-geojson.json")
        const dataset = await d3.csv("./../../datas/data_bank_data.csv")
      
        const countryNameAccessor = d => d.properties["NAME"]
        const countryIdAccessor = d => d.properties["ADM0_A3_IS"]
        const metric = "Population growth (annual %)"
        // const metric = "Net migration"
        // const metric = "International tourism, receipts (current US$)"
        // const metric = "Population density (people per sq. km of land area)"
        let metricDataByCountry = {}
        dataset.forEach(d => {
          if (d["Series Name"] != metric) return
          else
          metricDataByCountry[d["Country Code"]] = +d["2017 [YR2017]"] || 0 // read datapoint at d[2017 [yr2017]] as a number
        })
      
        // 2. Create chart dimensions
      
        let dimensions = {
          width: window.innerWidth * 0.9,
          margin: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
        }
        dimensions.boundedWidth = dimensions.width
          - dimensions.margin.left
          - dimensions.margin.right
      
        const sphere = ({type: "Sphere"})                           // Adding non-native type to GeoJSON object. d3-geo adds support for a "Sphere" type
        const projection = d3.geoEqualEarth()
          .fitWidth(dimensions.boundedWidth, sphere)

        const pathGenerator = d3.geoPath(projection)                // .bounds is a getter
        const [[x0, y0], [x1, y1]] = pathGenerator.bounds(sphere)   // This is the reason we are able to determine the map's height.
                                                                    // Each projection has a default size but we want a specific width.
                                                                    // Based on the width, it will give us the proper height for the projection
        
        dimensions.boundedHeight = y1                               // Now we know our height and can complete the parameters for our canvas
        dimensions.height = dimensions.boundedHeight
          + dimensions.margin.top
          + dimensions.margin.bottom
      
        // 3. Draw canvas
      
        const wrapper = d3.select("#world-wrapper")                 // Acquire canvas with dimensions
          .append("svg")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)
      
        const bounds = wrapper.append("g")                          // Add our bounds and affix to proper location
            .style("transform", `translate(${
              dimensions.margin.left
            }px, ${
              dimensions.margin.top
            }px)`)
      
        // 4. Create scales
      
        const metricValues = Object.values(metricDataByCountry)     // All of the csv metrics in a 1D array
        const metricValueExtent = d3.extent(metricValues)           // [Max , min]

        const maxChange = d3.max([-metricValueExtent[0], metricValueExtent[1]]) // Determines max and min as opposite magnitudes
        const colorScale = d3.scaleLinear()
            .domain([-maxChange, 0, maxChange])
            .range(["indigo", "white", "darkgreen"])
      
        // 5. Draw data
      
        const earth = bounds.append("path")                         // Earth is a path because "d" uses the pathGenerator
            .attr("class", "earth")
            .attr("d", pathGenerator(sphere))                       // A huge list of SVG "path" commands from our geoPath(projection) generator
      
        const graticuleJson = d3.geoGraticule10()                   // Generate our gridlines (lat lon)
        const graticule = bounds.append("path")
            .attr("class", "graticule")
            .attr("d", pathGenerator(graticuleJson))                // A huge list of SVG "path" commands based on our geoGraticule()
      
        const countries = bounds.selectAll(".country")
          .data(countryShapes.features)                             // Adds _enter and _exit to the null selection
          .enter().append("path")                                   // Essentially a forEach for our dataset to create our selection
            .attr("class", "country")
            .attr("d", pathGenerator)                               // ("d", pathGenerator) is shorthand for ("d", (d) => pathGenerator(d))
            .attr("fill", d => {                                    // Pretty colors
              const metricValue = metricDataByCountry[countryIdAccessor(d)]
              if (typeof metricValue == "undefined") return "#e2e6e9"
              return colorScale(metricValue)
            })
      
        // 6. Draw peripherals
      
        const legendGroup = wrapper.append("g")
            .attr("transform", `translate(${
              120
            },${
              dimensions.width < 800
              ? dimensions.boundedHeight - 30
              : dimensions.boundedHeight * 0.5
            })`)
      
        const legendTitle = legendGroup.append("text")
            .attr("y", -23)
            .attr("class", "legend-title")
            .text("Population growth")
      
        const legendByline = legendGroup.append("text")
            .attr("y", -9)
            .attr("class", "legend-byline")
            .text("Percent change in 2017")
      
        const defs = wrapper.append("defs")
        const legendGradientId = "legend-gradient"
        const gradient = defs.append("linearGradient")
            .attr("id", legendGradientId)
          .selectAll("stop")
          .data(colorScale.range())
          .enter().append("stop")
            .attr("stop-color", d => d)
            .attr("offset", (d, i) => `${
              i * 100 / 2 // 2 is one less than our array's length
            }%`)
      
        const legendWidth = 120
        const legendHeight = 16
        const legendGradient = legendGroup.append("rect")
            .attr("x", -legendWidth / 2)
            .attr("height", legendHeight)
            .attr("width", legendWidth)
            .style("fill", `url(#${legendGradientId})`)
      
        const legendValueRight = legendGroup.append("text")
            .attr("class", "legend-value")
            .attr("x", legendWidth / 2 + 10)
            .attr("y", legendHeight / 2)
            .text(`${d3.format(".1f")(maxChange)}%`)
      
        const legendValueLeft = legendGroup.append("text")
            .attr("class", "legend-value")
            .attr("x", -legendWidth / 2 - 10)
            .attr("y", legendHeight / 2)
            .text(`${d3.format(".1f")(-maxChange)}%`)
            .style("text-anchor", "end")
      
        navigator.geolocation.getCurrentPosition(myPosition => {
          const [x, y] = projection([
            myPosition.coords.longitude,
            myPosition.coords.latitude
          ])
          const myLocation = bounds.append("circle")
              .attr("class", "my-location")
              .attr("cx", x)
              .attr("cy", y)
              .attr("r", 0)
              .transition().duration(500)
              .attr("r", 10)
        })
      
        // 7. Set up interactions
      
        countries.on("mouseenter", onMouseEnter)
            .on("mouseleave", onMouseLeave)
      
        const tooltip = d3.select("#world-tooltip")
        function onMouseEnter(datum) {
          tooltip.style("opacity", 1)
      
          const metricValue = metricDataByCountry[countryIdAccessor(datum)]
      
          tooltip.select("#country")
              .text(countryNameAccessor(datum))
      
          tooltip.select("#world-value")
              .text(`${d3.format(",.2f")(metricValue || 0)}%`)
      
          const [centerX, centerY] = pathGenerator.centroid(datum)
          
          console.log(datum)
          const x = centerX + dimensions.margin.left;
          const y = centerY + dimensions.margin.top;
          
          tooltip.style('transform', `translate(`
            + `calc( -50% + ${x}px),`
            + `calc( -100% + ${y}px)`
            + `)`)
        }

        function onMouseLeave() {
          tooltip.style("opacity", 0)
        }
      }
}

export default DoWorld;