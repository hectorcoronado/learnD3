const d3 = window.d3

let width = 500
let height = 500
let padding = 40

// let yMax = d3.max(birthData2011, d => d.lifeExpectancy)
// let yMin = d3.min(birthData2011, d => d.lifeExpectancy)

let yScale = d3.scaleLinear()
                .domain(d3.extent(
                  birthData2011,
                  d => d.lifeExpectancy
                ))
                .range([height - padding, padding])

let xScale = d3.scaleLinear()
                .domain(d3.extent(
                  birthData2011,
                  d => d.births / d.population
                ))
                .range([padding, width - padding])

let xAxis = d3.axisBottom(xScale)
              .tickSize(-height + 2 * padding)
              .tickSizeOuter(0)

let yAxis = d3.axisLeft(yScale)
              .tickSize(-width + 2 * padding)
              .tickSizeOuter(0)

// 'fill' set based on population density (its population divided by its area -- lo density is green, hi density black)
let colorScale = d3.scaleLinear()
                    .domain(d3.extent(
                      birthData2011,
                      d => d.population / d.area
                    ))
                    .range(['lightgreen', 'black'])

// 'r' set on number of births, not births per capita
let radiusScale = d3.scaleLinear()
                    .domain(d3.extent(
                      birthData2011,
                      d => d.births
                    ))
                    .range([2, 40])

/** our scatterplot allows us to visualize the relationship
  * between 4 variables in any given region:
  *
  * 1. no. of births per capita along x-axis
  * 2. life expectancy along y-axis
  * 3. population density according to 'fill' shading
  * 4. no. of births according to radius
  */

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
  .data(birthData2011)
  .enter()
  .append('circle')
    .attr('cx', d => xScale(d.births / d.population))
    .attr('cy', d => yScale(d.lifeExpectancy))
    .attr('fill', d => colorScale(d.population / d.area))
    .attr('r', d => radiusScale(d.births))

// svg label:
d3.select('svg')
  .append('text')
    .attr('x', width / 2)
    .attr('y', padding)
    .style('text-anchor', 'middle')
    .style('font-size', '1.5em')
    .text('data on births by country in 2011')

// y-axis label:
d3.select('svg')
  .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', padding - 10)
    .attr('dy', '-1.1em')
    .style('text-anchor', 'middle')
    .text('life expectancy')

// x-axis label:
d3.select('svg')
  .append('text')
    .attr('x', width / 2)
    .attr('y', height - padding + 5)
    .attr('dy', '1.5em')
    .style('text-anchor', 'middle')
    .text('births per capita')
