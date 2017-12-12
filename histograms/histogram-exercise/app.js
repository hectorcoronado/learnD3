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
