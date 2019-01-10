import _ from 'lodash'
import {action, autorun} from 'mobx'
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/core/styles';
import http from 'utils/http'
import Layout from 'utils/Layout'
import PropTypes from 'prop-types'
import React from 'react'
import turf from 'turf'

const L = window.L

const Map = observer(class extends React.Component {

  static propTypes = {
    selected: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.startMap()
    this.autorunDisposer = autorun(() => {
      if (this.props.store) {
        this.setupTileLayer(this.props.store.tileLayerName);
      }
    })
    this.autorunDisposer2 = autorun(() => {
      if (this.props.selected && this.props.selected.dataSetId) {
        this.fetchDataSetForMap(this.props.selected.dataSetId)
      }
    })
    this.autorunDisposer3 = autorun(() => {
      if (this.props.selected && this.props.selected.relationshipId) {
        this.fetchRelationshipDataForMap(this.props.selected.relationshipId)
      }
    })
    this.autorunDisposer4 = autorun(() => {
      if (this.props.store.records.length > 0) {
        this.mapPoints();
      }
    })
  }

  componentWillUnmount() {
    this.stopMap()
    this.autorunDisposer()
    this.autorunDisposer2();
    this.autorunDisposer3();
    this.autorunDisposer4();
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

    this.map.on('click', action(() => {
      this.props.store.selected = []
    }))

    L.control.scale({position: 'bottomleft'}).addTo(this.map)

    this.setupTileLayer(this.props.store.tileLayerName)
  }

  fetchDataSetForMap = (dataSetId) => {
    this.refreshMap()
    http.jsonRequest(`/api/datasets/${dataSetId}/records`)
      .then(action((response) => {
        this.props.store.records.replace(_.get(response, 'bodyJson.list'))
        this.mapPoints();
      }))
      .catch(action((error) => {
        this.error = error
      }))
  }

  fetchRelationshipDataForMap = (relationshipId) => {
    this.refreshMap()
    http.jsonRequest(`/api/relationships/${relationshipId}/join`)
      .then(action((response) => {
        this.props.store.records.replace(_.get(response, 'bodyJson.list'));
        this.mapPoints();
      }))
      .catch(action((error) => {
        this.error = error
      }))
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

  mapPoints = () => {

    // Set up different icons for each search term, colouring is through CSS where it is also used for text and chips
    const icons = []
    icons[0] = L.divIcon({
      html: this.getIcon(1, 34),
      className: 'search0',
      iconAnchor: [17, 17]
    })
    icons[1] = L.divIcon({
      html: this.getIcon(1, 30),
      className: 'search1',
      iconAnchor: [15, 15]
    })
    icons[2] = L.divIcon({
      html: this.getIcon(0.9, 26),
      className: 'search2',
      iconAnchor: [13, 13]
    })
    icons[3] = L.divIcon({
      html: this.getIcon(0.85, 22),
      className: 'search3',
      iconAnchor: [11, 11]
    });
    icons[4] = L.divIcon({
      html: this.getIcon(0.8, 22),
      className: 'search4',
      iconAnchor: [11, 11]
    })
    icons[5] = L.divIcon({
      html: this.getIcon(0.75, 22),
      className: 'search5',
      iconAnchor: [11, 11]
    })
    icons[6] = L.divIcon({
      html: this.getIcon(0.7, 22),
      className: 'search6',
      iconAnchor: [11, 11]
    })
    icons[7] = L.divIcon({
      html: this.getIcon(0.65, 22),
      className: 'searchN',
      iconAnchor: [11, 11]
    });
    // standard icon
    const iconX = L.divIcon({
      html: this.getIcon(0.4),
      className: 'searchX',
      iconAnchor: [9, 9]
    });

    const points = []
    const foundPoints = []

    // Clear any existing markers
    if (this.markers) {
      this.markers.clearLayers();
    }
    this.markers = L.layerGroup();

    _.each(this.props.store.records, (record) => {
      // use one side of the join or the other, at this point we don't know which has the geocoordinate
      const point = this.makePoint(record)
      if (point) {
        points.push(point)
        let found = false

        // Look for search terms, and use appropriate marker if term found
        if (this.props.store.searchStrings.length > 0) {
          this.props.store.searchStrings.forEach((element, index) => {
            if (JSON.stringify(record).toLowerCase().includes(element.toLowerCase())) {
              L.marker(point, {icon: icons[index < 7 ? index : 7], zIndexOffset: (index * 100) + 500})
                //.bindPopup(this.buildPopupHTML(record))
                .addTo(this.markers)
                .on('click', function(){ window.updateSelected(record); })
              found = true
            }
          })
        }

        if (!found) {
          L.marker(point, {icon: iconX})
            //.bindPopup(this.buildPopupHTML(record))
            .addTo(this.markers)
            .on('click', function(){ window.updateSelected(record); })
        }

        if (found)
          foundPoints.push(point)

      }
    })

    this.markers.addTo(this.map)

    if (foundPoints.length > 0)
      this.centerMapOnPoints(foundPoints)
    else
      this.centerMapOnPoints(points)
    this.updatePoints(points)
  }

  updatePoints = action((points) => {
    this.props.store.points = points
  });

  makePoint = (record) => {
    // first try to make a point through the relationships
    if (record.data) {
      const point = this.makePoint(record.data[0][0]);
      if (point) {
        return point;
      } else {
        return this.makePoint(record.data[1][0]);
      }
    }
    // Make a point using the coordinates
    const latitude = record.Y || record.y || record.latitude
    const longitude = record.X || record.x || record.longitude
    if (latitude && longitude) {
      return [latitude, longitude]
    }
  }

  select = (record) => {
    this.props.store.selected = []
    if (record.data) { // This is a relationship record
      this.props.store.selected[0] = record.data[0][0]
      this.props.store.selected[1] = record.data[0][1]
    } else {
      this.props.store.selected[0] = record
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

  setupTileLayer = (newLayerName) => {
    if (this.tileLayer) {
      this.tileLayer.remove()
      this.tileLayer = null
    }

    switch (newLayerName) {
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
  }

  render() {
    return (
      <div style={{ ...Layout.column, flex: 1 }}>

        <div ref='mapNode' style={styles.map}></div>

      </div>
    )
  }
})

const styles = {
  map: {
    position: 'relative',
    flex: 1,
  }
}

export default withStyles(styles)(Map)
