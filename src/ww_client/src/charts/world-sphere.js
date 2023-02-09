import * as d3 from "d3";
import * as topojson from "topojson-client";

//
// Configuration
//

// ms to wait after dragging before auto-rotating
var rotationDelay = 3000
var rotation
var diff, lastTime
// scale of the globe (not the canvas element)
var scaleFactor = 0.9
// autorotation speed
var degPerSec = 6
// start angles
var angles = { x: -20, y: 40, z: 0}
// colors
// var colorWater = 'red'
var colorLand = ''
var colorGraticule = '#ccc6'
var colorLandStroke = '#fff9'
var colorCountry = '#a00'

var degPerMs = degPerSec / 1000

//
// Variables
//

// Heading
// var current = d3.select('#current')

// var water = {type: 'Sphere'}
var projection = d3.geoOrthographic().precision(0.1)
var graticule = d3.geoGraticule10()

//var v0 // Mouse position in Cartesian coordinates at start of drag gesture.
//var r0 // Projection rotation as Euler angles at start.
//var q0 // Projection rotation as versor at start.

class WorldSphere {

  constructor ()
  {
    lastTime = d3.now()
    this.canvas = d3.create("canvas");
    this.canvas.attr('id', "globe-canvas")

    this.context = this.canvas.node().getContext("2d");
    this.context.canvas.style.maxWidth = "100%";
    this.context.canvas.style.margin = "auto";
    this.context.canvas.style.display = "flex";
    this.context.canvas.value = this.context;

    this.path = d3.geoPath(projection).context(this.context)
    this.land = null
    this.countryList = null
    this.autorotate = null
    this.now  = null
    this.diff = null
    this.width = null
    this.height = null
    this.countries = null
    this.current = document.getElementById('current_country')
    this.currentCountry = null

    this.setAngles()
    
    //this.canvas
    // .call(d3.drag()
    //     .on('start', this.dragstarted)
    //     .on('drag', this.dragged)
    //     .on('end', this.dragended)
    //     )
    //  .on('mousemove', this.mousemove)

  }

  setAngles() {
    var rotation = projection.rotate()
    rotation[0] = angles.y
    rotation[1] = angles.x
    rotation[2] = angles.z
    projection.rotate(rotation)
  }

  scale() {
    this.width = document.getElementById('globe-wrapper').getBoundingClientRect().width
    this.height = document.getElementById('globe-wrapper').getBoundingClientRect().height
    this.canvas.attr('width', this.width).attr('height', this.height)
    projection
      .scale((scaleFactor * Math.min(this.width, this.height)) / 2)
      .translate([this.width / 2, this.height / 2])
    this.render()
  }

  // startRotation(delay) {
  //   this.autorotate.restart(this.rotate, delay || 0)
  // }

  // stopRotation() {
  //   this.autorotate.stop()
  // }

  // enter = (country) => {

  //   let id = String(parseInt(country.id))
  //   let cname = this.countryList[id]

  //   document.getElementById('current_country').textContent = cname
  // }

  // leave = (country) => {
  //   document.getElementById('current_country').textContent = ''
  // }

  render = () => {
    // console.log("RENDERING")
    this.context.clearRect(0, 0, this.width, this.height)
    // this.fill(water, colorWater)
    this.stroke(graticule, colorGraticule)
    this.stroke(this.land, colorLandStroke)
    // this.fill(this.land, colorLand)
    if (this.currentCountry) {
      this.fill(this.currentCountry, colorCountry)
    }
  }

  fill(obj, color) {
    this.context.beginPath()
    this.path(obj)
    this.context.fillStyle = color
    this.context.fill()
  }

  stroke(obj, color) {
    this.context.beginPath()
    this.path(obj)
    this.context.strokeStyle = color
    this.context.stroke()
  }

  rotate = (elapsed) => {

    var now = d3.now()
    diff = now - lastTime
    if (diff < elapsed) {
      rotation = projection.rotate()
      rotation[0] += diff * degPerMs
      projection.rotate(rotation)
      this.render()
    }
    lastTime = now

  }

  loadData(_world /*, cList */) {

    try {
        let world = JSON.parse(_world)
    
        this.land = topojson.feature(world, world.objects.land)
        this.countries = topojson.feature(world, world.objects.countries)
        // this.countryList = JSON.parse(cList) // This was the list of countries from Redis
        this.scale()
        this.autorotate = d3.timer(this.rotate)

        document.getElementById('globe-wrapper').appendChild(this.context.canvas)

    } catch (err) {
        console.error(err)
    }
    
  }

  // Events
  // mousemove = () => {

  //   // var c = getCountry(d3.event, this)
  //   // if (!c) {
  //   //   if (this.currentCountry) {
  //   //     // this.leave(this.currentCountry)
  //   //     // this.currentCountry = undefined
  //   //     this.render()
  //   //   }
      
  //   //   return

  //   // }
  //   // if (c === this.currentCountry) {
  //   //   return
  //   // }

  //   // this.currentCountry = c
  //   this.render()
  //   // this.enter(c)
  // }
  
  // dragstarted = () => {
  //   v0 = d3.event.versor.cartesian(projection.invert(d3.mouse(this)))
  //   r0 = projection.rotate()
  //   q0 = this.versor(r0)
  //   this.stopRotation()
  // }
  
  // dragged = () => {
  //   var v1 = this.versor.cartesian(projection.rotate(r0).invert(d3.mouse(this)))
  //   var q1 = this.versor.multiply(q0, this.versor.delta(v0, v1))
  //   var r1 = this.versor.rotation(q1)
  //   projection.rotate(r1)
  //   this.render()  
  // }
  
  // dragended = () => {
  //   this.startRotation(rotationDelay)
  // }

}

// https://github.com/d3/d3-polygon
// function polygonContains(polygon, point) {
//   var n = polygon.length
//   var p = polygon[n - 1]
//   var x = point[0], y = point[1]
//   var x0 = p[0], y0 = p[1]
//   var x1, y1
//   var inside = false
//   for (var i = 0; i < n; ++i) {
//     p = polygon[i] 
//     x1 = p[0]
//     y1 = p[1]
//     if (((y1 > y) !== (y0 > y)) && (x < (x0 - x1) * (y - y1) / (y0 - y1) + x1)) inside = !inside
//     x0 = x1
//     y0 = y1
//   }
//   return inside
// }


// function getCountry(event, wrld) {

//   // Globe coordinates of mouse
//   var pos = projection.invert(d3.mouse(event.target))

//   return wrld.countries.features.find(function(f) {
//     return f.geometry.coordinates.find(function(c1) {
//       return polygonContains(c1, pos) || c1.find(function(c2) {
//         return polygonContains(c2, pos)
//       })
//     })
//   })
// }
export default WorldSphere