const d3 = window.d3
let width = 600
let height = 600
let barPadding = 1

/**
  * create a histogram with data from the first
  * year in the dataset (1967)
  */

// get first year from dataset:
let minYear = d3.min(birthData, d => d.year)
// then filter data that doesn't come from this first year:
let yearData = birthData.filter(d => d.year === minYear)

/** xScale: once we have this scale we can avoid calculating the barWidth,
  * instead we can use the x0 and x1 properties of each bin to calculate
  * the appropriate width -- we can pass x0 into the scale to
  * figure out where the 'x' coordinate of each bar should be. As for the
  * width, it should be the difference between the scaled value of x1 and
  * the scaled value of x0 minus the barPadding.
  */
let xScale = d3.scaleLinear()
                // set 'domain'from 0 to the largest figure in dataset:
                .domain([0, d3.max(yearData, d => d.births)])
                // set 'rangeRound' from 0 to svg's width, 'rangeRound'
                // is very similar to 'range,' except it rounds values to
                // nearest whole number:
                .rangeRound([0, width])

// histogram of birth counts:
let histogram = d3.histogram()
                  // set 'domain' using xScale's domain:
                  .domain(xScale.domain())
                  .thresholds(xScale.ticks())
                  .value(d => d.births)

let bins = histogram(yearData)

// we can determine how to display the bins/bars:
let barWidth = width / bins.length - barPadding

let yScale = d3.scaleLinear()
                // 'domain' from 0 to the length of the largest bin
                .domain([0, d3.max(bins, d => d.length)])
                // 'range' from svg height to 0
                .range([height, 0])

let bars = d3.select('svg')
                .attr('width', width)
                .attr('height', height)
              .selectAll('bar')
              .data(bins)
              .enter(0)
              .append('g')
                .classed('bar', true)

bars
  .append('rect')
    .attr('x', (d, i) => xScale(d.x0))
    .attr('y', d => yScale(d.length))
    .attr('height', d => height - yScale(d.length))
    .attr('width', d => xScale(d.x1) - xScale(d.x0) - barPadding)
    .attr('fill', 'mediumaquamarine')

// set labels for bars:
bars
  .append('text')
    // .text(d => d.x0 + ' - ' + d.x1 + ' (bar height: ' + d.length + ')')
    .text(d => `${d.x0} - ${d.x1} (bar height: ${d.length})`)
    .attr('transform', 'rotate(-90)')
    .attr('y', d => (xScale(d.x1) + xScale(d.x0)) / 2)
    .attr('x', -height + 10)
    .style('alignment-baseline', 'middle')

/* bars set without using xScale
bars
  .append('rect')
    // set 'x' so that it's offset by barWidth & barPadding
    .attr('x', (d, i) => (barWidth + barPadding) * i)
    // set 'y' using scaled values
    .attr('y', d => yScale(d.length))
    // set 'height' to svg's height minus the scaled 'y' value
    .attr('height', d => height - yScale(d.length))
    // set 'width' to barWidth
    .attr('width', barWidth)
    .attr('fill', 'mediumaquamarine')
*/
