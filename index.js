const MersenneTwister = require('mersenne-twister');
const { JSDOM } = require('jsdom');
const paperGen = require('./paper')
const colors = require('./colors')
const shapeCount = 4
const svgns = 'http://www.w3.org/2000/svg'

const dom = new JSDOM();
global.document = dom.window.document;

module.exports = generateIdenticon

let generator
function generateIdenticon(diameter, seed) {
  generator = new MersenneTwister(seed);
  var remainingColors = colors.slice()

  var elements = paperGen(diameter, genColor(remainingColors))
  var container = elements.container

  var svg = document.createElementNS(svgns, 'svg')
  svg.setAttributeNS(null, 'x', '0')
  svg.setAttributeNS(null, 'y', '0')
  svg.setAttributeNS(null, 'width', diameter)
  svg.setAttributeNS(null, 'height', diameter)

  // Create circular clipping path
  var defs = document.createElementNS(svgns, 'defs')
  var clipPath = document.createElementNS(svgns, 'clipPath')
  clipPath.setAttributeNS(null, 'id', 'circleClip')
  
  var circle = document.createElementNS(svgns, 'circle')
  circle.setAttributeNS(null, 'cx', diameter/2)
  circle.setAttributeNS(null, 'cy', diameter/2)
  circle.setAttributeNS(null, 'r', diameter/2)
  
  clipPath.appendChild(circle)
  defs.appendChild(clipPath)
  svg.appendChild(defs)

  // Create a group with the clip-path applied
  var group = document.createElementNS(svgns, 'g')
  group.setAttributeNS(null, 'clip-path', 'url(#circleClip)')
  svg.appendChild(group)

  container.appendChild(svg)

  // 4 color version
  // for(var i = 0; i < shapeCount; i++) {
  //   genShape(remainingColors, diameter, i, shapeCount, group)
  // }

  // 3 color version
  for(var i = 0; i < shapeCount - 1; i++) {
    genShape(remainingColors, diameter, i, shapeCount - 1, group)
  }

  return container
}

function genShape(remainingColors, diameter, i, total, parentGroup) {
  var center = diameter / 2

  var shape = document.createElementNS(svgns, 'rect')
  shape.setAttributeNS(null, 'x', '0')
  shape.setAttributeNS(null, 'y', '0')
  shape.setAttributeNS(null, 'width', diameter)
  shape.setAttributeNS(null, 'height', diameter)

  var firstRot = generator.random()
  var angle = Math.PI * 2 * firstRot
  
  // Only apply translation if it's not the first shape
  var tx = 0
  var ty = 0
  if (i > 0) {
    var velocity = diameter / total * generator.random() + (i * diameter / total)
    tx = (Math.cos(angle) * velocity)
    ty = (Math.sin(angle) * velocity)
  }

  var translate = 'translate(' + tx + ' ' +  ty + ')'

  // Third random is a shape rotation on top of all of that.
  var secondRot = generator.random()
  var rot = (firstRot * 360) + secondRot * 180
  var rotate = 'rotate(' + rot.toFixed(1) + ' ' + center + ' ' + center + ')'
  var transform = translate + ' ' + rotate
  shape.setAttributeNS(null, 'transform', transform)
  var fill = genColor(remainingColors)
  shape.setAttributeNS(null, 'fill', fill)

  parentGroup.appendChild(shape)
}

function genColor(colors) {
  var rand = generator.random()
  var idx = Math.floor(colors.length * generator.random())
  var color = colors.splice(idx,1)[0]
  return color
}

