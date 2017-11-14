import React, {Component} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


let config = {};
//Configuration for user interaction and displays
config.params = {
  center: [40.655769,-73.938503],
  zoomControl: false,
  zoom: 13,
  maxZoom: 18,
  minZoom: 8,
  scrollwheel: true,
  legends: false,
  infoControl: false,
  attributionControl: true
};

//This is where we get the map from, as well as some additonal info
config.tileLayer = {
  uri: 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
  params: {
    minZoom: 8,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
					'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
					'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
	
  }
};



class Maps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      tileLayer: null,
    };
    this._mapNode = null;
  }

  componentDidMount() {
    // create the Leaflet map object
    if (!this.state.map) this.init(this._mapNode);
  }

  componentWillUnmount() {
    // this destroys the Leaflet map object & related event listeners
    this.state.map.remove();
  }

  // this function creates the Leaflet map object and is called after the Map component mounts
  init(id) {
    if (this.state.map) return;
    
    let map = L.map(id, config.params);
    L.control.zoom({ position: "bottomleft"}).addTo(map);
    L.control.scale({ position: "bottomleft"}).addTo(map);

    // a TileLayer is used as the "basemap"
    const tileLayer = L.tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(map);

    // set our state to include the tile layer
    this.setState({ map, tileLayer });
  }

  render() {
    return (
      <div id="mapUI">
        <div ref={(node) => this._mapNode = node} id="map" />
      </div>
    );
  }
}

export default Maps;