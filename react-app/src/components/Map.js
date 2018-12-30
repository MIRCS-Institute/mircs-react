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
        this.setupTileLayer(this.props.store.tileLayerName.get());
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

    L.control.scale({position: 'bottomleft'}).addTo(this.map)

    this.setupTileLayer(this.props.store.tileLayerName.get())
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

  mapPoints = () => {
    // Had to go with two SVG's to get the opacity to work.  CSS wouldn't do that part, just the colour.
    const svgx = '<svg width="18px" height="18px" viewBox="0 0 1024 1024"><polygon points="512,9 0,521 128,521 128,905 448,905 448,649 576,649 576,905 896,905 896,521 1024,521 " fill-opacity="0.5"/></svg>';
    const svg = '<svg width="18px" height="18px" viewBox="0 0 1024 1024"><polygon points="512,9 0,521 128,521 128,905 448,905 448,649 576,649 576,905 896,905 896,521 1024,521 "/></svg>';

    // Set up different icons for each search term
    const icon0 = L.divIcon({
      html: svg,
      className: 'searcha'
    });
    const icon1 = L.divIcon({
      html: svg,
      className: 'search1'
    });
    const icon2 = L.divIcon({
      html: svg,
      className: 'search2'
    });
    const icon3 = L.divIcon({
      html: svg,
      className: 'search3'
    });
    const iconx = L.divIcon({
      html: svgx,
      className: 'searchx'
    });

    const points = []

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

        // Look for search terms, and use appropriate marker if term found
        if (this.props.store.searchStrings.length > 0 && JSON.stringify(record).toLowerCase().includes(this.props.store.searchStrings[0].toLowerCase())) {
          L.marker(point, {icon: icon0, zIndexOffset: 1000})
            .bindPopup(this.buildPopupHTML(record))
            .addTo(this.markers);

        } else if (this.props.store.searchStrings.length > 1 && JSON.stringify(record).toLowerCase().includes(this.props.store.searchStrings[1].toLowerCase())) {
          L.marker(point, {icon: icon1, zIndexOffset: 900})
            .bindPopup(this.buildPopupHTML(record))
            .addTo(this.markers);

        } else if (this.props.store.searchStrings.length > 2 && JSON.stringify(record).toLowerCase().includes(this.props.store.searchStrings[2].toLowerCase())) {
          L.marker(point, {icon: icon2, zIndexOffset: 800})
            .bindPopup(this.buildPopupHTML(record))
            .addTo(this.markers);

        } else if (this.props.store.searchStrings.length > 3 && JSON.stringify(record).toLowerCase().includes(this.props.store.searchStrings[3].toLowerCase())) {
          L.marker(point, {icon: icon3, zIndexOffset: 700})
            .bindPopup(this.buildPopupHTML(record))
            .addTo(this.markers);

        } else {
          L.marker(point, {icon: iconx})
            .bindPopup(this.buildPopupHTML(record))
            .addTo(this.markers);
        }

      }
    })
    this.markers.addTo(this.map);

    this.centerMapOnPoints(points)
    this.updatePoints(points);
  }

  updatePoints = action((points) => {
    this.props.store.points.replace(points);
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
