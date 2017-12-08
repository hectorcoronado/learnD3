const d3 = window.d3

console.log(d3)

let height = 700
let width = 1000
let padding = 15 // TODO: check padding

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
                    .range(['lightcyan', 'navy'])

// radiusScale relates to growthRate
let radiusScale = d3.scaleLinear()
                    .domain(d3.extent(
                      regionData,
                      d => d.growthRate
                    ))
                    .range([1, 15])

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
    .attr('r', d => radiusScale(d.growthRate))
