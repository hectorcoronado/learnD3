const d3 = window.d3

console.log(d3)

let height = 700
let width = 1000
let padding = 40

// yScale relates to subscribersPer100
let yScale = d3.scaleLinear()
                .domain(d3.extent(
                  regionData,
                  d => d.subscribersPer100
                ))
                .range([height - padding, padding])

// xScale relates to adultLiteracyRate
let xScale = d3.scaleLinear()
                .domain(d3.extent(
                  regionData,
                  d => d.adultLiteracyRate
                ))
                .range([padding, width - padding])

let yAxis = d3.axisLeft(yScale)
              .tickSize(-width + 2 * padding)
              .tickSizeOuter(0)

let xAxis = d3.axisBottom(xScale)
              .tickSize(-height + 2 * padding)
              .tickSizeOuter(0)

// colorScale/'fill' relates to extremePovertyRate
let colorScale = d3.scaleLinear()
                    .domain(d3.extent(
                      regionData,
                      d => d.extremePovertyRate
                    ))
                    .range(['lightcyan', 'indigo'])

// radiusScale relates to growthRate
let radiusScale = d3.scaleLinear()
                    .domain(d3.extent(
                      regionData,
                      d => d.subscribersPer100
                    ))
                    .range([1, 25])

d3.select('svg')
  .append('g')
    .attr(
      'transform',
      `translate(0, ${height - padding})`
    )
    .call(xAxis)

d3.select('svg')
  .append('g')
    .attr(
      'transform',
      `translate(${padding}, 0)`
    )
    .call(yAxis)

d3.select('svg')
    .attr('width', width)
    .attr('height', height)
  .selectAll('circle')
  .data(regionData)
  .enter()
  .append('circle')
    .attr('cx', d => xScale(d.adultLiteracyRate))
    .attr('cy', d => yScale(d.subscribersPer100))
    .attr('fill', d => colorScale(d.extremePovertyRate))
    .attr('r', d => radiusScale(d.subscribersPer100))

// svg label:
d3.select('svg')
  .append('text')
    .attr('x', width / 2) // center the text
    .attr('y', padding)
    .style('text-anchor', 'middle')
    .style('font-size', '1.5em')
    .text("data on regions' literacy/cell subscribers")

// y-axis label:
d3.select('svg')
  .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', padding - 28)
    // dy indicates shift along y-axis on pos of el or its content
    .attr('dy', '1-1em')
    .style('text-anchor', 'middle')
    .text('cellular subscribers per 100')

// x-axis label:
d3.select('svg')
  .append('text')
    .attr('x', width / 2)
    .attr('y', height - padding + 5)
    .attr('dy', '1.5em')
    .style('text-anchor', 'middle')
    .text('adult literacy rate')
