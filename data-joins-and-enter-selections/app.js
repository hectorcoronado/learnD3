var quotes = [
  {
    quote: "I see dead people.",
    movie: "The Sixth Sense",
    year: 1999,
    rating: "PG-13"
  }, {
    quote: "May the force be with you.",
    movie: "Star Wars: Episode IV - A New Hope",
    year: 1977,
    rating: "PG"
  }, {
    quote: "You've got to ask yourself one question: 'Do I feel lucky?' Well, do ya, punk?",
    movie: "Dirty Harry",
    year: 1971,
    rating: "R"
  }, {
    quote: "You had me at 'hello.'",
    movie: "Jerry Maguire",
    year: 1996,
    rating: "R"
  }, {
    quote: "Just keep swimming. Just keep swimming. Swimming, swimming, swiming.",
    movie: "Finding Nemo",
    year: 2003,
    rating: "G"
  }
];

const colors = {
  'G': '#3cff00',
  'PG': '#f9ff00',
  'PG-13': '#ff9000',
  'R': '#ff0000'
}

// select unordered list
d3.select('#quotes')
    // restyle it a bit
    .style('list-style', 'none')
  // select all list items *inside* of the list (returns a selection w/o nodes)
  .selectAll('li')
  // want to take a piece of data from quotes obj and attach to an html el
  .data(quotes)
  // creates d3 selection w/'enter nodes' that are like placeholders of data not yet on html
  .enter()
  // place our enter nodes as 'li's in the html
  .append('li')
    // pass data (d) to the text() method
    .text(d => `"${d.quote}" - ${d.movie} (${d.year})`)
    .style('margin', '20px')
    .style('padding', '10px')
    .style('font-size', d => d.quote.length < 25 ? '1.2em' : '1em')
    .style('background-color', d => colors[d.rating])
    .style('border-radius', '4px')
