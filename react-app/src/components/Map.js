import {action, autorun, toJS} from 'mobx'
import { CurrentDataSetRecords } from '../api/DataSetRecords'
import { CurrentRelationshipJoin } from '../api/RelationshipJoin'
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/core/styles'
import _ from 'lodash'
import MapTileLayers from '../resources/temp-map-tile-layers/MapTileLayers'
import Layout from '../utils/Layout'
import PropTypes from 'prop-types'
import React from 'react'
import turf from 'turf'

const L = window.L

const Map = observer(class extends React.Component {

  _foundRecords = []
  _otherRecords = []

  static propTypes = {
    selected: PropTypes.object.isRequired,
    store: PropTypes.object,
  }

  constructor() {
    super()
    this.mapNodeRef = React.createRef()
  }

  componentDidMount() {
    this.startMap()
    this.autorunDisposer = autorun(() => {
      this.setupTileLayer(this.props.store.tileLayerName)
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
        45.25, -63,
      ],
      zoom: 8,
    })

    this.map.on('click', action(() => {
      if (this.skipMapClick) {
        this.skipMapClick = false
        return
      }
      this.props.store.selected = {}
    }))

    L.control.scale({position: 'bottomleft'}).addTo(this.map)
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

    // This is the main set of records for the shapes or markers on the map
    const dataSetRecords = CurrentDataSetRecords.res.get('list')
    // This is the deprecated list of server joined records
    const relationshipJoin = CurrentRelationshipJoin.res.get('list')
    // This is the client side joined records
    const records = dataSetRecords || relationshipJoin || []

    records.forEach((record) => {
      const geojson = getGeoJson(record)
      if (geojson) {
        // This is a geojson element
        const firstPoint = this.getFirstPoint(geojson)
        if (firstPoint)
          points.push(firstPoint)

        L.geoJSON(toJS(geojson), {
          style: this.getPolygonStyle(geojson, foundPoints),
          pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
              radius: 8,
            })
          },
        })
          .addTo(this.markers)
          .on('click', (e) => {
            this.skipMapClick = true
            this.updateSelected(firstPoint, record, e)
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
          if (this.props.store.searchStrings.length > 0) {
            const recordString = JSON.stringify(record).toLowerCase()
            this.props.store.searchStrings.forEach((element, index) => {
              if (element.includes(':')) {
                // This is a specific field/value search such as 'Surname: Smith'
                const separatorLocation = element.indexOf(':')
                const highlightField = element.substring(0, separatorLocation)
                const highlightValue = element.substring(separatorLocation + 2)
                if (record.data) {
                  // relationship data
                  _.each(record.data, (joinRecords) => {
                    _.each(joinRecords, (record) => {
                      // We specifically want non-type safe equality checking
                      // eslint-disable-next-line
                      if (_.get(record, highlightField) == highlightValue) {
                        this.makeFoundMarker(point, record, index)
                        found = true
                      }
                    })
                  })
                } else {
                  // no relationship
                  // eslint-disable-next-line
                  if (_.get(record, highlightField) == highlightValue) {
                    this.makeFoundMarker(point, record, index)
                    found = true
                  }
                }
              } else {
                if (recordString.includes(element.toLowerCase())) {
                  this.makeFoundMarker(point, record, index)
                  found = true
                }
              }
            })
          }

          if (found) {
            foundPoints.push(point)
          } else {
            this._otherRecords.push(record)
            L.marker(point, {icon: this.iconX})
              .addTo(this.markers)
              .on('click', (e) => {
                this.updateSelected(point, record, e)
              })
          }
        }
      }
    })

    this.markers.addTo(this.map)

    if (records[0] && this.props.store.fieldNames.length === 0)
      this.props.store.addFieldNames(records[0])

    if (foundPoints.length > 0) {
      this.centerMapOnPoints(foundPoints)
    } else {
      this.centerMapOnPoints(points)
    }
    this.updatePoints(points)

    this.updateStoreRecords(this._foundRecords, this._otherRecords)

    function getGeoJson(record) {
      let result
      if (record.geometry) {
        result = record
      } else if (record.data) {
        record.data.forEach((dataItems) => {
          if (result) {
            return
          }
          dataItems.forEach((dataItem) => {
            if (dataItem.geometry) {
              result = dataItem
            }
          })
        })
      }
      return result
    }

  }

  // This is used for non-geojson sourced markers, and uses the little house icon.
  makeFoundMarker = (point, record, index) => {
    L.marker(point, {icon: this.icons[index < 7 ? index : 7], zIndexOffset: (index * 100) + 500})
      .addTo(this.markers)
      .on('click', (e) => {
        this.updateSelected(point, record, e)
      })
    this.addFoundRecord(record, index)
  }

  getFirstPoint = (geoJson) => {
    // Sometimes there is a z coordinate so we don't want to do a reverse.  Instead we manually flip just the first and second items in the array.
    if (geoJson.geometry.type === 'Point') {
      const coordinates = geoJson.geometry.coordinates.slice()
      return [ coordinates[1], coordinates[0] ]
    }
    if (geoJson.geometry.type === 'Polygon') {
      const coordinates = geoJson.geometry.coordinates[0][0].slice()
      return [ coordinates[1], coordinates[0] ]
    }
    if (geoJson.geometry.type === 'MultiPolygon') {
      if (geoJson.geometry.coordinates[0])
        if (geoJson.geometry.coordinates[0][0]) {
          const coordinates = geoJson.geometry.coordinates[0][0][0].slice()
          return [ coordinates[1], coordinates[0] ]
        }
    }
    return null
  }

  // This is used for geojson sourced markers or polygons.
  getPolygonStyle = (geojson, foundPoints) => {
    // Default colours
    let color = '#E6A224'
    let fillColor = Layout.colours[7]
    let fillOpacity = 0.7
    if (_.get(geojson.geometry, 'type') === 'Point') {
      color = Layout.colours[7]
      fillColor = '#E6A224'
    }

    // Basic properties of geojson
    let geojsonFound = false
    const records = [ geojson.properties ]
    if (geojson._id) {
      // Grab the records related to this geojson object.
      _.each(this.props.store.linkMap[geojson._id], (linkRecord) => {
        records.push(linkRecord)
      })
    }

    // When there is no related data and we're searching for something, go with transparent fill.
    if (records.length < 2 && this.props.store.searchStrings.length > 0) {
      fillOpacity = 0
    }

    // Search for any search terms to apply special highlighting
    if (this.props.store.searchStrings.length > 0) {
      // Look in each record related to this geojson
      _.each(records, (record) => {
        let recordFound = false
        // Check for every search term in this record
        this.props.store.searchStrings.forEach((element, index) => {
          // Only search for up to the first seven search terms.  The rest get tossed into 'Other'.
          if (index < 7) {
            if (element.includes(':')) {
              // This is a specific field/value search such as 'Surname: Smith'
              const separatorLocation = element.indexOf(':')
              const highlightField = element.substring(0, separatorLocation)
              const highlightValue = element.substring(separatorLocation + 2)
              // eslint-disable-next-line
              if (_.get(record, highlightField) == highlightValue) {
                recordFound = true
                geojsonFound = true
                fillColor = Layout.colours[index]
                this.addFoundRecord(record, index)
              }
            } else {
              // This is a regular search.
              if (JSON.stringify(record).toLowerCase().includes(element.toLowerCase())) {
                recordFound = true
                geojsonFound = true
                fillColor = Layout.colours[index]
                this.addFoundRecord(record, index)
              }
            }
          }
        })
        // If none of the search terms were found, add this record to otherRecords
        if (!recordFound) {
          this._otherRecords.push(record)
        }
      })
    }

    // Grab any point off the geojson to use for the map centering.
    if (geojsonFound) {
      foundPoints.push(this.getFirstPoint(geojson))
    } else if (this.props.store.searchStrings.length !== 0) {
      // If none of the records in this geojson match none of the search string and we are searching, then hide.
      fillOpacity = 0
      color = '#E6A224'
    }

    // Return our styling
    return {
      color,
      fillColor,
      weight: 1,
      opacity: 0.7,
      fillOpacity,
    }
  }

  updateSelected = action((point, record, marker) => {
    const newSelected = {
      point: point,
      records: [],
      marker: marker,
    }

    // De-emphasize previously selected marker if there was one.
    const previousMarker = this.props.store.selected.marker
    if (previousMarker) {
      previousMarker.layer._path.style.stroke = ''
      previousMarker.layer._path.style.strokeOpacity = ''
      previousMarker.layer._path.style.strokeWidth = ''
    }

    // Emphasize newly selected marker
    if (marker.layer) {
      // This is a geojson marker
      marker.layer._path.style.stroke = '#F00'
      marker.layer._path.style.strokeOpacity = 1
      marker.layer._path.style.strokeWidth = 4
    } else {
      // TODO: Highlight old house style markers.
    }

    // Gather up records related to selection
    if (record.data) { // This is a server based relationship record
      record.data[0].forEach((d) => {
        newSelected.records.push(d)
      })
      record.data[1].forEach((d) => {
        newSelected.records.push(d)
      })
    } else {
      newSelected.records.push(record)
      // Also check for local relationship records
      if (record._id) {
        _.each(this.props.store.linkMap[record._id], (linkRecord) => {
          newSelected.records.push(linkRecord)
        })
      }
    }
    this.props.store.selected = newSelected
  })

  updatePoints = action((points) => {
    this.props.store.points = points
  })

  updateStoreRecords = action( (newFoundRecords, newOtherRecords) => {
    this.props.store.foundRecords = newFoundRecords
    this.props.store.otherRecords = newOtherRecords
  })

  addFoundRecord = (record, index) => {
    this._foundRecords[index].push(record)
  }

  resetFoundRecords = () => {
    this._foundRecords = []
    this._otherRecords = []
    this.props.store.searchStrings.forEach(() => {
      this._foundRecords.push([])
    })
  }

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

    this.tileLayer = (MapTileLayers.layers[newLayerName] || MapTileLayers.defaultLayer).makeTileLayer()
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
