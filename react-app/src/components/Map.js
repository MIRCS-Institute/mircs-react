import _ from 'lodash'
import {action, autorun, extendObservable} from 'mobx'
import {observer} from 'mobx-react'
import { withStyles } from '@material-ui/core/styles';
import http from 'utils/http'
import Layout from 'utils/Layout'
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types'
import React from 'react'
import TextField from '@material-ui/core/TextField';
import turf from 'turf'

const L = window.L

const Map = observer(class extends React.Component {

  static propTypes = {
    selected: PropTypes.object.isRequired,
  }

  constructor() {
    super()
    extendObservable(this, {
      tileLayerName: 'Mapbox',
      records: [],
      points: [],
    })
  }

  componentDidMount() {
    this.startMap()
    this.autorunDisposer = autorun(() => {
      if (this.props.selected && this.props.selected.dataSetId) {
        this.fetchDataSetForMap(this.props.selected.dataSetId)
      }
      if (this.props.selected && this.props.selected.relationshipId) {
        this.fetchRelationshipDataForMap(this.props.selected.relationshipId)
      }
    })
  }

  componentWillUnmount() {
    this.stopMap()
    this.autorunDisposer()
  }

  componentDidUpdate(prevProps, prevState) {
    // this.setupTileLayer()
  }

  startMap = () => {
    this.map = L.map(this.refs.mapNode, {
      center: [
        44.6458, -63.5778
      ],
      zoom: 13,
    })

    L.control.scale({position: 'bottomleft'}).addTo(this.map)

    this.setupTileLayer()
  }

  fetchDataSetForMap = (dataSetId) => {
    this.refreshMap()
    http.jsonRequest(`/api/datasets/${dataSetId}/records`)
      .then(action((response) => {
        const icon = L.icon({ iconUrl: 'house.svg' })
        const points = []

        _.each(_.get(response, 'bodyJson.list'), (record) => {
          const point = this.makePoint(record)
          if (point) {
            points.push(point)
            L.marker(point, { icon })
              .addTo(this.map)
              .bindPopup(() => {
                return _.map(record, (value, field) => {
                  if (field[0] === '_') {
                    return ''
                  }
                  return `<strong>${field}:</strong> <span>${value}</span><br>`
                }).join('')
              })
          }
        })

        this.centerMapOnPoints(points)
        this.points = points
      }))
      .catch(action((error) => {
        this.error = error
      }))
  }

  fetchRelationshipDataForMap = (relationshipId) => {
    this.refreshMap()
    http.jsonRequest(`/api/relationships/${relationshipId}/join`)
      .then(action((response) => {
        const icon = L.icon({ iconUrl: 'house.svg' })
        const points = []

        _.each(_.get(response, 'bodyJson.list'), (record) => {
          // use one side of the join or the other, at this point we don't know which has the geocoordinate
          const point = this.makePoint(record.data[0][0]) || this.makePoint(record.data[1][0])
          if (point) {
            points.push(point)
            L.marker(point, { icon })
              .addTo(this.map)
              .bindPopup(() => {
                return _.map(record, (value, field) => {
                  if (field[0] === '_') {
                    return ''
                  }
                  return `<strong>${field}:</strong> <span>${value}</span><br>`
                }).join('')
              })
          }
        })

        this.centerMapOnPoints(points)
        this.points = points
      }))
      .catch(action((error) => {
        this.error = error
      }))
  }

  makePoint = (record) => {
    const latitude = record.Y || record.y || record.latitude
    const longitude = record.X || record.x || record.longitude
    if (latitude && longitude) {
      return [latitude, longitude]
    }
  }

  centerMapOnPoints = (points) => {
    const multiPoint = turf.multiPoint(points)
    const bbox = turf.bbox(multiPoint)
    this.map.fitBounds([[bbox[0], bbox[1]], [ bbox[2], bbox[3]]])
  }

  refreshMap = () => {
    this.stopMap()
    this.startMap()
  }

  stopMap = action(() => {
    if (this.map) {
      this.map.remove()
      this.map = null
    }
  })

  setupTileLayer = action(() => {
    if (this.tileLayer) {
      this.tileLayer.remove()
      this.tileLayer = null
    }

    switch (this.tileLayerName) {
      case 'Mapbox':
        this.tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          minZoom: 8,
          attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>',
          id: 'mapbox.streets',
          accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
        })
        break

      case 'OpenStreetMap':
      default:
        this.tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        })
        break

      case 'CamsMap':
        this.tileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/shaunjohansen/cjhichsvu67fe2rnt7z72id2e/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2hhdW5qb2hhbnNlbiIsImEiOiJjamg1OWRmZXIxMmp1MzFtampiZjJoNDV4In0.PgQiDqLUli_GaxB1jmrI2A')
        break
    }

    this.tileLayer.addTo(this.map)
  })

  handleTileLayerNameChange = action((event) => {
    this.tileLayerName = event.target.value
  })

  render() {
    const { classes } = this.props

    return (
      <div style={{ ...Layout.column, flex: 1 }}>

        <form className={classes.container} noValidate autoComplete="off">

          <TextField
            id="standard-select-currency"
            select
            label="Tile Layer"
            className={classes.mapOptions}
            value={this.tileLayerName}
            onChange={this.handleTileLayerNameChange}
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            /* helperText="Please choose the mapping base layer..." */
            margin="normal"
            variant="outlined"
            style={{ marginLeft: 10 }}
          >
            <MenuItem value="CamsMap">
              Cam's Map
            </MenuItem>
            <MenuItem value="OpenStreetMap">
              OpenStreetMap
            </MenuItem>
            <MenuItem value="Mapbox">
              Mapbox
            </MenuItem>
          </TextField>

          <TextField
            id="standard-search"
            label="Search"
            type="search"
            className={classes.mapOptions}
            margin="normal"
            variant="outlined"
          />
        </form>

        <div ref='mapNode' style={styles.map}></div>

        <center>
          {this.points.length} properties
        </center>

      </div>
    )
  }
})

const styles = {
  map: {
    position: 'relative',
    flex: 1,
  },
  mapOptions: {
    marginLeft: 10,
  }
}

export default withStyles(styles)(Map)
