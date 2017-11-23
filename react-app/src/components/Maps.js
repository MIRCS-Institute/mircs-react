import Input, { InputLabel } from 'material-ui/Input';
import React from 'react';
import Select from 'material-ui/Select';
import { FormControl } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';

const L = window.L;

class Maps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tileLayerName: 'OpenStreetMap'
    };
  }

  componentDidMount() {
    this.startMap();
  }

  componentWillUnmount() {
    this.stopMap();
  }

  // create the Leaflet map object
  startMap() {
    this.map = L.map(this.refs.mapNode, {
      center: [0.0, 0.0],
      zoomControl: false,
      zoom: 13,
      maxZoom: 18,
      minZoom: 3,
      scrollwheel: true,
      legends: false,
      infoControl: false,
      attributionControl: true
    });

    this.setupTileLayer();

    this.createPoints();

    L.control.zoom({ position: 'bottomleft'}).addTo(this.map);
    L.control.scale({ position: 'bottomleft'}).addTo(this.map);
  }

  createPoints() {
	  L.marker([51.5, -0.09]).addTo(this.map)
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();
	  
	  
	  L.marker([44.7, -63.09]).addTo(this.map)
      .bindPopup('Such useful.')
      .openPopup();
	  
	  L.marker([51.9, -0.09]).addTo(this.map)
      .bindPopup('Wow.')
      .openPopup();
  }
  
  stopMap() {
    // this destroys the Leaflet map object & related event listeners
    this.map.remove();
    this.map = null;
  }

  setupTileLayer() {
    if (this.tileLayer) {
      this.tileLayer.remove();
    }

    switch (this.state.tileLayerName) {
      case 'Mapbox':
        this.tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          minZoom: 8,
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
          id: 'mapbox.streets',
          accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
        });
        break;

      case 'OpenStreetMap':
      default:
        this.tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        });
        break;
    }

    this.tileLayer.addTo(this.map);
  }

  componentDidUpdate(prevProps, prevState) {
    this.setupTileLayer();
  }

  handleTileLayerNameChange = event => {
    this.setState({ tileLayerName: event.target.value });
  };

  render() {
    return (
      <form autoComplete='off'>
        <div ref='mapNode' style={{ height: 600 }} />

        <FormControl>
          <InputLabel htmlFor='tile-layer-input'>Tile Layer</InputLabel>
          <Select
            value={this.state.tileLayerName}
            onChange={this.handleTileLayerNameChange}
            input={<Input id='tile-layer-input' />}
          >
            <MenuItem value='OpenStreetMap'>OpenStreetMap</MenuItem>
            <MenuItem value='Mapbox'>Mapbox</MenuItem>
          </Select>
        </FormControl>

      </form>
    );
  }
}

export default Maps;