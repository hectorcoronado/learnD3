const d3 = window.d3
// const birthData = window.birthData
let width = 600
let height = 600
let barPadding = 1
let padding = 20

/**
  * create a histogram with data from the first
  * year in the dataset (1967)
  */

// get first year from dataset:
let minYear = d3.min(birthData, d => d.year)
// then filter data that doesn't come from this first year:
let yearData = birthData.filter(d => d.year === minYear)

// get latest/max year from dataset:
let maxYear = d3.max(birthData, d => d.year)

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
                .rangeRound([padding, width - padding])

// histogram of birth counts:
let histogram = d3.histogram()
                  // set 'domain' using xScale's domain:
                  .domain(xScale.domain())
                  .thresholds(xScale.ticks())
                  .value(d => d.births)

let bins = histogram(yearData)

// we can determine how to display the bins/bars:
// let barWidth = width / bins.length - barPadding

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

// range:
d3.select('input')
    .property('min', minYear)
    .property('max', maxYear)
    .property('value', minYear)
    .on('input', () => {
      // get year from range input:
      let year = +d3.event.target.value
      // since bin # may change, use gen update pattern to update the graph:
      // filter data by specific year:
      yearData = birthData.filter(d => d.year === year)
      // update xScale for this new data:
      xScale.domain([0, d3.max(yearData, d => d.births)])
      // update histogram with new xScale
      histogram.domain(xScale.domain())
                // ...then update thresholds/ticks
                .thresholds(xScale.ticks())
      // update bins
      bins = histogram(yearData)
      // update yScale with new bin data:
      yScale.domain([0, d3.max(bins, d => d.length)])
      // begin to update graph's bars:
      bars = d3.select('svg')
                .selectAll('.bar')
                .data(bins)
      // first, remove anything in the exit selection:
      bars
        .exit()
        .remove()

      // for any enter node, append a new group (since you need to append to it twice below, store it in a variable):
      let g = bars
                .enter()
                .append('g')
                  .classed('bar', true)

      // to each new group, append a rectangle and text el:
      g.append('rect')
      g.append('text')

      // finally, merge enter selection with update selection, & update the rectangle and text for each bar:
      g.merge(bars)
          // the attr's that we update are same as ones when we initially created histogram:
          .select('rect')
            .attr('x', (d, i) => xScale(d.x0))
            .attr('y', d => yScale(d.length))
            .attr('height', d => height - yScale(d.length))
            // make sure that 'width' is never a negative value:
            .attr('width', d => {
              let width = xScale(d.x1) - xScale(d.x0) - barPadding
              return width < 0 ? 0 : width
            })
            .attr('fill', 'mediumaquamarine')

      g.merge(bars)
          .select('text')
            .text(d => `${d.x0} - ${d.x1} (bar height: ${d.length})`)
            .attr('transform', 'rotate(-90)')
            .attr('y', d => (xScale(d.x1) + xScale(d.x0)) / 2)
            .attr('x', -height + 10)
            .style('alignment-baseline', 'middle')
    })
