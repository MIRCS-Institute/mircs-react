import Input, {InputLabel} from 'material-ui/Input';
import React from 'react';
import Select from 'material-ui/Select';
import {FormControl} from 'material-ui/Form';
import {MenuItem} from 'material-ui/Menu';
import DataSetCardMap from 'components/DataSetCardMap'
import http from 'utils/http'
import {action, extendObservable} from 'mobx'
import {observer} from 'mobx-react'
import _ from 'lodash'

const L = window.L;

const Maps = observer(class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tileLayerName: 'OpenStreetMap'
    };
    extendObservable(this, {
      dataSets: [],
      records: []
    });
  }

  componentDidMount() {
    this.fetchDataSet();
    this.fetchDataSetRecords();
    this.startMap();
  }

  listMappableDatSets() {
    
  }

  componentWillUnmount() {
    this.stopMap();
  }
  // create the Leaflet map object
  startMap = action(() => {
    this.map = L.map(this.refs.mapNode, {
      center: [
        44.6458, -63.5778
      ],
      zoomControl: false,
      zoom: 13,
      maxZoom: 18,
      minZoom: 9,
      scrollwheel: true,
      legends: false,
      infoControl: false,
      attributionControl: true
    });
    
    this.setupTileLayer();
    
    L
      .control
      .zoom({position: 'bottomleft'})
      .addTo(this.map);
    L
      .control
      .scale({position: 'bottomleft'})
      .addTo(this.map);
  })

  // loop through the records to map each set of data
  createPoints = action((records) => {
    for (let i = 0; i < records.length; i++) {
      L
        .marker([records[i].Y, records[i].X])
        .addTo(this.map)
        .bindPopup(records[i].Address_Number + " \n " + records[i].Street);
    }
  })

  // later, take in a dataset... for now we hard code one
  fetchDataSet = action(() => {
    http
      .jsonRequest('/api/datasets/5a206969d9b6a9df1efa1ad4/records')
      .then(action((response) => {
        this.records = _.get(response, 'bodyJson.list');
        this.createPoints(this.records.slice());
      }))
      .catch(action((error) => {
        this.error = error;
      }));
  })

  // use this to list all of the datasets on the left
  fetchDataSetRecords = action(() => {
    // use the http.jsonRequest to create a response object from a URL
    http
      .jsonRequest('/api/datasets')
      .then(action((response) => {
        this.dataSets = _.get(response, 'bodyJson.list');
      }))
      .catch(action((error) => {
        this.error = error;
      }));
  })

  stopMap = action(() => {
    // destroy the Leaflet map object & related event listeners
    this
      .map
      .remove();
    this.map = null;
  })

  setupTileLayer = action(() => {
    if (this.tileLayer) {
      this
        .tileLayer
        .remove();
    }

    switch (this.state.tileLayerName) {
      case 'Mapbox':
        this.tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          minZoom: 8,
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributor' +
              's, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imager' +
              'y © <a href="http://mapbox.com">Mapbox</a>',
          id: 'mapbox.streets',
          accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriIS' +
              'LbB6B5aw'
        });
        break;

      case 'OpenStreetMap':
      default:
        this.tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'});
        break;
    }

    this
      .tileLayer
      .addTo(this.map);
  })

  componentDidUpdate(prevProps, prevState) {
    this.setupTileLayer();
  }

  handleTileLayerNameChange = event => {
    this.setState({tileLayerName: event.target.value});
  };

  render() {
    return (
      <div>
        <div ref='mapNode' style={styles.map}></div>
        <div
          style={{
          height: '700px',
          width: '30%',
          overflow: 'scroll'
        }}>
          {this
            .dataSets
            .map((dataSet) => (<DataSetCardMap key={dataSet._id} dataSet={dataSet}/>))}
        </div>
        <form autoComplete='off'>

          {/* <FormControl>
            <InputLabel htmlFor='tile-layer-input'>Tile Layer</InputLabel>
            <Select
              value={this.state.tileLayerName}
              onChange={this.handleTileLayerNameChange}
              input={< Input id = 'tile-layer-input' />}>
              <MenuItem value='OpenStreetMap'>OpenStreetMap</MenuItem>
              <MenuItem value='Mapbox'>Mapbox</MenuItem>
            </Select>
          </FormControl> */}
        </form>
      </div>
    );
  }
});

const styles = {
  map: {
    position: 'relative',
    height: '700px',
    width: '70%',
    float: "right"
  }
};

export default Maps;