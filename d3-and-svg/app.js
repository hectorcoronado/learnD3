import birthData from './birthData'
const d3 = window.d3

let minYear = d3.min(birthData, (d) => d.year)
let maxYear = d3.max(birthData, (d) => d.year)
let width = 600
let height = 600
let barPadding = 10
let numBars = 12
let barWidth = width / numBars - barPadding // sets barWidth to width of SVG
let maxBirths = d3.max(birthData, (d) => d.births)
// 'height' and 'maxBirths' get mapped to 0, bc y vals increase as you go UP
let yScale = d3.scaleLinear()
                .domain([0, maxBirths])
                .range([height, 0])

d3.select('input')
    .property('min', minYear)
    .property('max', maxYear)
    .property('value', minYear)

d3.select('svg')
    .attr('width', width)
    .attr('height', height)
  .selectAll('rect')
  .data(birthData.filter(d => d.year === minYear)) // only 1st year
  .enter()
  .append('rect')
    .attr('width', barWidth)
    .attr('height', (d) => height - yScale(d.births))
    // y coord is SVG height - bar height:
    .attr('y', (d) => yScale(d.births))
    // for each bar rendered (i), move the x-coord over by 25:
    .attr('x', (d, i) => {
      return (barWidth + barPadding) * i
    })
    .attr('fill', 'purple')

d3.select('input')
    .on('input', () => {
      let year = +d3.event.target.value
      d3.selectAll('rect')
        .data(birthData.filter((d) => d.year === year))
          .attr('height', (d) => height - yScale(d.births))
          .attr('y', (d) => yScale(d.births))
    })
