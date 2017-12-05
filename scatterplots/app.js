const d3 = window.d3

let width = 500
let height = 500
let padding = 20

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
