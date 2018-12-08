import _ from 'lodash'
import {action, autorun, extendObservable} from 'mobx'
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import {observer} from 'mobx-react'
import http from 'utils/http'
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Layout from 'utils/Layout'
import PropTypes from 'prop-types'
import React from 'react'
import Select from '@material-ui/core/Select'
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
    this.setupTileLayer()
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
    this.fetchDataSet(`/api/datasets/${dataSetId}/records`, 'bodyJson.list')
  }

  fetchRelationshipDataForMap = (relationshipId) => {
    this.refreshMap()
    this.fetchDataSet(`/api/relationships/${relationshipId}/join`, 'bodyJson.records')
  }

  refreshMap = action(() => {
    this.stopMap()
    this.startMap()
  })

  createPoints = action((records) => {
    const icon = L.icon({ iconUrl: 'house.svg' })
    const points = []
    const hiddenFields = ['_id','_updatedAt','_createdAt'];

    _.each(records, (record) => {
      const point = [record.Y || record.y || record.latitude, record.X || record.x || record.longitude]
      if (point[0]) {
        points.push(point)
        L.marker(point, { icon })
          .addTo(this.map)
          .bindPopup(action(() => {
            return _.map( _.omit( _.pickBy(record), hiddenFields), (value, field) => (
                    `<strong>${field}:</strong> <span>${value}</span>`
                  )).join('<br>')
          }))
      }
    })

    // position map
    const multiPoint = turf.multiPoint(points)
    const bbox = turf.bbox(multiPoint)
    this.map.fitBounds([[bbox[0], bbox[1]], [ bbox[2], bbox[3]]])

    this.points = points
  });

  fetchDataSet = action((recordId, where) => {
    http.jsonRequest(recordId)
      .then(action((response) => {
        this.records = _.get(response, where)
        this.createPoints(this.records)
      }))
      .catch(action((error) => {
        this.error = error
      }))
  })

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
          attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributor' +
              's, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imager' +
              'y © <a href="https://mapbox.com">Mapbox</a>',
          id: 'mapbox.streets',
          accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriIS' +
              'LbB6B5aw'
        })
        break

      case 'OpenStreetMap':
      default:
        this.tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'})
        break
    }

    this.tileLayer.addTo(this.map)
  })

  handleTileLayerNameChange = action((event) => {
    this.tileLayerName = event.target.value
  })

  render() {
    return (
      <div style={{ ...Layout.column, flex: 1 }}>

        <form autoComplete='off'>
          <FormControl>
            <InputLabel htmlFor='tile-layer-input'>Tile Layer</InputLabel>
            <Select
              value={this.tileLayerName}
              onChange={this.handleTileLayerNameChange}
              input={< Input id = 'tile-layer-input' />}>
              <MenuItem value='OpenStreetMap'>OpenStreetMap</MenuItem>
              <MenuItem value='Mapbox'>Mapbox</MenuItem>
            </Select>
          </FormControl>
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
}

export default Map
