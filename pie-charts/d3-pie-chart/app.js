const d3 = window.d3

let width = 600
let height = 600
let maxYear = d3.max(birthData, d => d.year)
let minYear = d3.min(birthData, d => d.year)

let continents = []

// create arr of continents:
for (let i = 0; i < birthData.length; i++) {
  let continent = birthData[i].continent
  if (continents.indexOf(continent) === -1) {
    continents.push(continent)
  }
}

// use scaleOrdinal to map a discrete set of points to another discrete set of points:
let colorScale = d3.scaleOrdinal()
                    // map array of continents...
                    .domain(continents)
                    // ...to a preset array of d3 colors:
                    .range(d3.schemeCategory10)

// center svg so pie chart isn't @ top-left corner (origin) of svg el:
d3.select('svg')
    .attr('width', width)
    .attr('height', height)
  .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`)
    // and add 'chart' class to access it later:
    .classed('chart', true)

// input:
d3.select('input')
    .property('min', minYear)
    .property('max', maxYear)
    .property('value', minYear)
    .on('input', () => {
      makeGraph(+d3.event.target.value)
    })

const makeGraph = (year) => {
  let yearData = birthData.filter(d => d.year === year)
  let arcs = d3.pie()
                .value(d => d.births)
                // pie() returns a fn, so you can pass an argument to it:
                (yearData)

  let path = d3.arc()
                .outerRadius(width / 2 - 10)
                .innerRadius(width / 4)

  // get update selection and store in variable:
  let update = d3.select('.chart')
                  .selectAll('.arc')
                  .data(arcs)

  // remove unnecessary nodes from exit selection:
  update
    .exit()
    .remove()

  // enter selection:
  update
    .enter()
    .append('path')
      .classed('arc', true)
    .merge(update)
      .attr('fill', d => colorScale(d.data.continent))
      .attr('stroke', 'black')
      .attr('d', path)
}

makeGraph(minYear)
