const Layout = {}

/**
 * Layout child elements in rows
 */
Layout.row = {
  display: 'flex',
  flexDirection: 'row',
}

/**
 * Layout child elements in columns
 */
Layout.column = {
  display: 'flex',
  flexDirection: 'column',
}

/**
 * Layout this component so it fills the nearest
 * parents who has display:(relative|absolute)
 */
Layout.absoluteFill = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
}

Layout.listContainer = {
  overflowX: 'hidden',
  overflowY: 'auto',
}

/**
 * Shorthand for setting flex justifyContent and alignItems
 * on an items children. Modeled after angular's fxLayout
 */
Layout.align = (main, cross) => {
  function sanitize(term) {
    if (term === 'start') {
      term = 'flex-start'
    }
    if (term === 'end') {
      term = 'flex-end'
    }
    return term
  }
  main = sanitize(main)
  cross = sanitize(cross)
  return {
    justifyContent: main,
    alignItems: cross,
  }
}

Layout.colours = [
  'darkred',
  'orange',
  'yellow',
  'chartreuse',
  'green',
  'deepskyblue',
  'darkorchid'
]

export default Layout