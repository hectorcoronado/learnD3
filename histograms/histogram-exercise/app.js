const d3 = window.d3
let height = 600
let width = 800
let padding = 50
let barPadding = 1

let ageData = regionData.filter(d => d.medianAge !== null)

let initialBinCount = 16

let svg = d3.select('svg')
              .attr('width', width)
              .attr('height', height)

// fn to create xScale, yScale, bins, & generate histogram
const updateRects = (val) => {
  let xScale = d3.scaleLinear()
                  // set domain to max and min medianAges:
                  .domain(d3.extent(ageData, d => d.medianAge))
                  .rangeRound([padding, width - padding])

  let histogram = d3.histogram()
                    // set domain eq to xScale
                    .domain(xScale.domain())
                    .thresholds(xScale.ticks(val))
                    .value(d => d.medianAge)

  let bins = histogram(ageData)

  let yScale = d3.scaleLinear()
                  .domain([0, d3.max(bins, d => d.length)])
                  .range([height - padding, padding])

  // select y-axis and pass it updated scale:
  d3.select('.y-axis')
      .call(d3.axisLeft(yScale))

  d3.select('.x-axis')
      .call(d3.axisBottom(xScale)
              .ticks(val))
    // on range update, rotate text on x-axis for readability:
    .selectAll('text')
      .attr('y', -3)
      .attr('x', 10)
      .attr('transform', 'rotate(90)')
      .style('text-anchor', 'start')

  // use general update pattern to update rect's:
  let rect = svg.selectAll('rect')
                .data(bins)

  // remove anything in exit selection:
  rect
    .exit()
    .remove()

  // append rect for any node in enter selection & merge w/update selection to set styles:
  rect
    .enter()
      .append('rect')
    .merge(rect)
      // x attr determined by x0 property for each bin:
      .attr('x', d => xScale(d.x0))
      // y attr determined by length of bin:
      .attr('y', d => yScale(d.length))
      .attr('height', d => height - padding - yScale(d.length))
      .attr('width', d => xScale(d.x1) - xScale(d.x0) - barPadding)
      .attr('fill', 'turquoise')
      .attr('stroke', 'tomato')

  // update text in 'p' tag:
  d3.select('.bin-count')
    .text(`no. of bins: ${bins.length}`)
}

// range input:
d3.select('input')
      // default value is length of bins created by histogram:
      .property('value', initialBinCount)
    .on('input', () => {
      updateRects(+d3.event.target.value)
    })

// x-axis:
svg.append('g')
    .attr('transform', `translate(0, ${height - padding})`)
    .classed('x-axis', true)

// y-axis:
svg.append('g')
    .attr('transform', `translate(${padding}, 0)`)
    .classed('y-axis', true)

// x-axis text:
svg.append('text')
    .attr('x', width / 2)
    .attr('y', height)
    .style('text-anchor', 'middle')
    .text('median age')

// y-axis text:
svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', 15)
    .style('text-anchor', 'middle')
    .text('frequency')

updateRects(initialBinCount)

// canvas:
document.addEventListener('touchmove', function (e) {
  e.preventDefault()
})
let c = document.getElementsByTagName('canvas')[0]
let x = c.getContext('2d')
let pr = window.devicePixelRatio || 1
let w = window.innerWidth
let h = window.innerHeight
let f = 90
let q
let m = Math
let r = 0
let u = m.PI * 2
let v = m.cos
let z = m.random

c.width = w * pr
c.height = h * pr
x.scale(pr, pr)
x.globalAlpha = 0.6
function i () {
  x.clearRect(0, 0, w, h)
  q = [{ x: 0, y: h * 0.7 + f }, { x: 0, y: h * 0.7 - f }]
  while (q[1].x < w + f) d(q[0], q[1])
}
function d (i, j) {
  x.beginPath()
  x.moveTo(i.x, i.y)
  x.lineTo(j.x, j.y)
  let k = j.x + (z() * 2 - 0.25) * f
  let n = y(j.y)
  x.lineTo(k, n)
  x.closePath()
  r -= u / -50
  x.fillStyle = '#' + (v(r) * 127 + 128 << 16 | v(r + u / 3) * 127 + 128 << 8 | v(r + u / 3 * 2) * 127 + 128).toString(16)
  x.fill()
  q[0] = q[1]
  q[1] = { x: k, y: n }
}
function y (p) {
  let t = p + (z() * 2 - 1.1) * f
  return (t > h || t < 0) ? y(p) : t
}
document.onclick = i
document.ontouchstart = i
i()
