/*
fn that returns arr of {}, where each obj stores the char and its count as values, like this:
[{character: 'e', count: 2}, {character: 'j', count: 1}]
*/
const d3 = window.d3

let width = 800
let height = 400
let barPadding = 10

let svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height)

d3.select('#reset')
  .on('click', () => {
    d3.selectAll('.letter')
      .remove()

    d3.select('#phrase')
      .text('')

    d3.select('#count')
      .text('')
  })

d3.select('form')
  .on('submit', () => {
    d3.event.preventDefault()
    let input = d3.select('input')
    let text = input.property('value')
    let data = getFrequency(text)
    var barWidth = width / data.length - barPadding
    // update selection (saved to variable 'letters'):
    const letters = svg
                      .selectAll('.letter')
                      // pass data() a keyFn, set text based on char, not index:
                      .data(data, d => d.character)

    // exit selection (remove 'new' class from any existing el's in update):
    letters
        .classed('new', false)
      .exit()
      .remove()

    // enter selection:
    let letterEnter = letters
      .enter()
      .append('g')
        // for each bar rendered (i), move the x-coord over by 25:
        .classed('letter', true)
        .classed('new', true)

    letterEnter.append('rect')
    letterEnter.append('text')

    // merge enter & update selections to apply styles to both:
    letterEnter.merge(letters)
      .select('rect')
        .style('width', barWidth)
        .style('height', (d) => { return d.count * 20 })
        .attr('x', (d, i) => {
          return (barWidth + barPadding) * i
        })
        .attr('y', (d) => {
          return height - d.count * 20
        })

    letterEnter.merge(letters)
      .select('text')
        .attr('x', (d, i) => {
          return (barWidth + barPadding) * i + barWidth / 2
        })
        .attr('text-anchor', 'middle')
        .attr('y', (d) => {
          return height - d.count * 20 - 10
        })
        .text(d => d.character)

    d3.select('#phrase')
      .text(`analisys of: "${text}"`)

    d3.select('#count')
      .text(`new characters: ${letters.enter().nodes().length}`)

    input.property('value', '')
  })

const getFrequency = (str) => {
  const sorted = str.split('').sort()
  const data = []

  for (let i = 0; i < sorted.length; i++) {
    let last = data[data.length - 1]
    if (last && last.character === sorted[i]) {
      last.count ++
    } else {
      data.push({
        character: sorted[i],
        count: 1
      })
    }
  }
  return data
}
