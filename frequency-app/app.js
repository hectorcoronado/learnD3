/*
fn that returns arr of {}, where each obj stores the char and its count as values, like this:
[{character: 'e', count: 2}, {character: 'j', count: 1}]
*/
const d3 = window.d3

d3.select('form')
  .on('submit', () => {
    d3.event.preventDefault()
    let input = d3.select('input')
    let text = input.property('value')

    // update selection (saved to variable 'letters'):
    const letters = d3.select('#letters')
                      .selectAll('.letter')
                      // pass data() a keyFn, set text based on char, not index:
                      .data(getFrequency(text), d => d.character)

    // exit selection (remove 'new' class from any existing el's in update):
    letters
        .classed('new', false)
      .exit()
      .remove()

    // enter selection:
    letters
      .enter()
      .append('div')
        .classed('letter', true)
        .classed('new', true)
      // merge enter & update selections to apply styles to both:
      .merge(letters)
        .style('width', '20px')
        .style('line-height', '20px')
        .style('margin-right', '5px')
        .style('height', (d) => {
          return `${d.count * 20}px`
        })
        .text(d => d.character)

    d3.select('#phrase')
      .text(`analisys of: "${text}"`)

    d3.select('#count')
      .text(`new characters: ${letters.enter().nodes().length}`)

    input.property('value', '')
  })

d3.select('#reset')
  .on('click', () => {
    d3.selectAll('.letter')
      .remove()

    d3.select('#phrase')
      .text('')

    d3.select('#count')
      .text('')
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
