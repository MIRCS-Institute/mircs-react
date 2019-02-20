import {action, autorun, toJS} from 'mobx'
import { CurrentDataSetRecords } from '../api/DataSetRecords'
import { CurrentRelationshipJoin } from '../api/RelationshipJoin'
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/core/styles'
import _ from 'lodash'
import Layout from '../utils/Layout'
import PropTypes from 'prop-types'
import React from 'react'
import turf from 'turf'
import UiStore from '../states/UiStore'

const L = window.L

const Map = observer(class extends React.Component {

  static propTypes = {
    selected: PropTypes.object.isRequired,
  }

  constructor() {
    super()
    this.mapNodeRef = React.createRef()
  }

  componentDidMount() {
    this.startMap()
    this.autorunDisposer = autorun(() => {
      this.setupTileLayer(UiStore.tileLayerName)
    })
    this.autorunDisposer2 = autorun(() => {
      if (CurrentDataSetRecords.res.get('list', []).length + CurrentRelationshipJoin.res.get('list', []).length) {
        this.mapPoints()
      }
    })
  }

  componentWillUnmount() {
    this.stopMap()
    this.autorunDisposer()
    this.autorunDisposer2()
  }

  startMap = () => {
    this.map = L.map(this.mapNodeRef.current, {
      center: [
        44.6458, -63.5778,
      ],
      zoom: 13,
    })

    this.map.on('click', action(() => {
      if (this.skipMapClick) {
        this.skipMapClick = false
        return
      }
      UiStore.selected = {}
    }))

    L.control.scale({position: 'bottomleft'}).addTo(this.map)

    this.setupTileLayer(UiStore.tileLayerName)
  }

  stopMap = action(() => {
    if (this.map) {
      this.map.remove()
      this.map = null
    }
  })

  refreshMap = () => {
    this.stopMap()
    this.startMap()
  }

  buildPopupHTML(record) {
    return _.map(record, (value, field) => {
      if (field[0] === '_') {
        return ''
      }
      return `<strong>${field}:</strong> <span>${value}</span><br>`
    }).join('')
  }

  getIcon(opacity, size) {
    return '<svg width="' + ( size ? size : '18' ) + 'px" height="' + ( size ? size : '18' ) + 'px" viewBox="0 0 1024 1024"><polygon points="512,9 0,521 128,521 128,905 448,905 448,649 576,649 576,905 896,905 896,521 1024,521 "' + ( opacity ? 'fill-opacity="' + opacity + '"' : '' ) + '/></svg>'
  }

  // Set up different icons for each search term, colouring is through CSS where it is also used for text and chips
  icons = [
    L.divIcon({
      html: this.getIcon(1, 34),
      className: 'searchIcon0',
      iconAnchor: [17, 17],
    }),
    L.divIcon({
      html: this.getIcon(1, 30),
      className: 'searchIcon1',
      iconAnchor: [15, 15],
    }),
    L.divIcon({
      html: this.getIcon(0.9, 26),
      className: 'searchIcon2',
      iconAnchor: [13, 13],
    }),
    L.divIcon({
      html: this.getIcon(0.85, 22),
      className: 'searchIcon3',
      iconAnchor: [11, 11],
    }),
    L.divIcon({
      html: this.getIcon(0.8, 22),
      className: 'searchIcon4',
      iconAnchor: [11, 11],
    }),
    L.divIcon({
      html: this.getIcon(0.75, 22),
      className: 'searchIcon5',
      iconAnchor: [11, 11],
    }),
    L.divIcon({
      html: this.getIcon(0.7, 22),
      className: 'searchIcon6',
      iconAnchor: [11, 11],
    }),
    L.divIcon({
      html: this.getIcon(0.65, 22),
      className: 'searchIconN',
      iconAnchor: [11, 11],
    }),
  ]
  // standard icon
  iconX = L.divIcon({
    html: this.getIcon(0.4),
    className: 'searchIconX',
    iconAnchor: [9, 9],
  })

  mapPoints = () => {

    const points = []
    const foundPoints = []
    this.resetFoundRecords()

    // Clear any existing markers
    if (this.markers) {
      this.markers.clearLayers()
    }
    this.markers = L.layerGroup()

    const dataSetRecords = CurrentDataSetRecords.res.get('list')
    const relationshipJoin = CurrentRelationshipJoin.res.get('list')
    const records = dataSetRecords || relationshipJoin || []

    const geojsonStyle = {
      color: '#ff7800',
      weight: 5,
      opacity: 0.65,
    }

    records.forEach((record) => {
      if (record.geometry) {
        // This is a geojson element
        const jsRecord = toJS(record)

        L.geoJSON(jsRecord, { style: geojsonStyle })
          .addTo(this.markers)
          .on('click', () => {
            this.skipMapClick = true
            this.updateSelected(null, record)
          })
      } else {
        // This is not a polygon

        // use one side of the join or the other, at this point we don't know which has the geocoordinate
        const point = this.makePoint(record)
        if (point) {
          points.push(point)
          let found = false

          // Look for search terms, and use appropriate marker if term found
          // TODO: get smarter about how we search to improve performance.  Only search for latest search term, and don't reset the existing markers.  etc.
          if (UiStore.searchStrings.length > 0) {
            const recordString = JSON.stringify(record).toLowerCase()
            UiStore.searchStrings.forEach((element, index) => {
              if (element.includes(':')) {
                // This is a specific field/value search such as 'Surname: Smith'
                const highlightField = element.substring(0, element.indexOf(':'))
                const highlightValue = element.substring(element.indexOf(':') + 2)
                if (record.data) {
                  // relationship data
                  _.each(record.data, (leftSideRecords) => {
                    _.each(leftSideRecords, (card) => {
                      if (_.get(card, highlightField) === highlightValue) {
                        this.makeMarker(point, record, index)
                        found = true
                      }
                    })
                  })
                  _.each(record.data, (rightSideRecords) => {
                    _.each(rightSideRecords, (card) => {
                      if (_.get(card, highlightField) === highlightValue) {
                        this.makeMarker(point, record, index)
                        found = true
                      }
                    })
                  })
                } else {
                  // no relationship
                  if (_.get(record, highlightField) === highlightValue) {
                    this.makeMarker(point, record, index)
                    found = true
                  }
                }
              } else {
                if (recordString.includes(element.toLowerCase())) {
                  this.makeMarker(point, record, index)
                  found = true
                }
              }
            })
          }

          if (found) {
            foundPoints.push(point)
          } else {
            L.marker(point, {icon: this.iconX})
              .addTo(this.markers)
              .on('click', () => {
                this.updateSelected(point, record)
              })
          }
        }
      }
    })

    this.markers.addTo(this.map)

    this.fetchFieldNames()

    if (foundPoints.length > 0)
      this.centerMapOnPoints(foundPoints)
    else
      this.centerMapOnPoints(points)
    this.updatePoints(points)
  }

  makeMarker = (point, record, index) => {
    L.marker(point, {icon: this.icons[index < 7 ? index : 7], zIndexOffset: (index * 100) + 500})
      .addTo(this.markers)
      .on('click', () => {
        this.updateSelected(point, record)
      })
    this.addFoundRecord(record, index)
  }

  updateSelected = action((point, record) => {
    const newSelected = {
      point: point,
      records: [],
    }
    if (record.data) { // This is a relationship record
      record.data[0].forEach((d) => {
        newSelected.records.push(d)
      })
      record.data[1].forEach((d) => {
        newSelected.records.push(d)
      })
    } else {
      newSelected.records.push(record)
    }
    UiStore.selected = newSelected
  })

  updatePoints = action((points) => {
    UiStore.points = points
  })

  addFoundRecord = action( (record, index) => {
    UiStore.foundRecords[index].push(record)
  })

  resetFoundRecords = action( () => {
    UiStore.foundRecords = []
    UiStore.searchStrings.forEach(() => {
      UiStore.foundRecords.push([])
    })
  })

  fetchFieldNames = action(() => {
    // Get the fields names in the records. We only check the first record (good enough for now).
    const dataSetRecords = CurrentDataSetRecords.res.get('list', [])
    if (dataSetRecords.length) {
      UiStore.fieldNames = _.keys(dataSetRecords[0])
    }
    const relationshipJoin = CurrentRelationshipJoin.res.get('list', [])
    if (relationshipJoin[0]) {
      UiStore.fieldNames = _.keys(relationshipJoin[0].data[0].values().next().value)
    }
  })

  makePoint = (record) => {
    // first try to make a point through the relationships
    if (record.data) {
      const point = this.makePoint(record.data[0][0])
      if (point) {
        return point
      } else {
        return this.makePoint(record.data[1][0])
      }
    }
    // Make a point using the coordinates
    const latitude = record.Y || record.y || record.latitude
    const longitude = record.X || record.x || record.longitude
    if (latitude && longitude) {
      return [latitude, longitude]
    }
  }

  centerMapOnPoints = (points) => {
    const multiPoint = turf.multiPoint(points)
    const bbox = turf.bbox(multiPoint)
    if (bbox[0]<361) {
      this.map.fitBounds([[bbox[0], bbox[1]], [ bbox[2], bbox[3]]])
    }
  }

  setupTileLayer = (newLayerName) => {
    if (this.tileLayer) {
      this.tileLayer.remove()
      this.tileLayer = null
    }

    switch (newLayerName) {
      case 'Mapbox':
        this.tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          // minZoom: 8,
          attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>',
          id: 'mapbox.streets',
          accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
        })
        break

      case 'OpenStreetMap':
      default:
        this.tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
        })
        break

      case 'CamsMap':
        this.tileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/shaunjohansen/cjhichsvu67fe2rnt7z72id2e/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2hhdW5qb2hhbnNlbiIsImEiOiJjamg1OWRmZXIxMmp1MzFtampiZjJoNDV4In0.PgQiDqLUli_GaxB1jmrI2A')
        break
    }

    this.tileLayer.addTo(this.map)
  }

  render() {
    return (
      <div style={{ ...Layout.column, flex: 1 }}>

        <div ref={this.mapNodeRef} style={styles.map}></div>

      </div>
    )
  }
})

const styles = {
  map: {
    position: 'relative',
    flex: 1,
  },
}

export default withStyles(styles)(Map)
