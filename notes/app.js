document.addEventListener('DOMContentLoaded', function () {
  const d3 = window.d3
  const input = d3.select('input')
  const preview = d3.select('.preview')

  const removeNotes = d3.select('#remove')
  removeNotes
      .on('click', () => {
        d3.event.preventDefault()
        const allNotes = d3.selectAll('.note')
        allNotes.remove()
      })

  const newNote = d3.select('#new-note')
  newNote
      .on('submit', function () {
        d3.event.preventDefault()
        d3.select('#notes')
          .append('p')
            .classed('note', true)
            .text(input.property('value'))
        input.property('value', '')
        setPreview('')
      })

  const lucky = d3.select('#lucky')
  lucky
      .on('click', () => {
        const randomNumber = () => {
          return Math.floor(Math.random() * 20) + 1
        }
        d3.event.preventDefault()
        const allNotes = d3.selectAll('.note')
        allNotes.style('font-size', () => {
          return `${randomNumber()}px`
        })
      })

  const setPreview = (val) => {
    preview.text(val)
        // class 'hide' will only be applied if val is empty string
        .classed('hide', val === '')
  }

  const previewRender = () => {
    input.on('input', () => {
      let note = d3.event.target.value
      setPreview(note)
    })
  }
  previewRender()
})
