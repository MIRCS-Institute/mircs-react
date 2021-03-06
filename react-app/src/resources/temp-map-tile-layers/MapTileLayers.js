const L = window.L

const layers = {
  LightMap: {
    name: 'Light Map',
    global: true,
    makeTileLayer: () => L.tileLayer(
      'https://api.mapbox.com/styles/v1/mr-mircs/cjt812k9z34ib1fo0yamtm33h/tiles/256/{z}/{x}/{y}?access_token={accessToken}',
      {
        accessToken: 'pk.eyJ1Ijoic2hhdW5qb2hhbnNlbiIsImEiOiJjamg1OWRmZXIxMmp1MzFtampiZjJoNDV4In0.PgQiDqLUli_GaxB1jmrI2A',
        maxZoom: 22,
      },
    ),
  },
  Mapbox: {
    name: 'Mapbox',
    global: true,
    makeTileLayer: () => L.tileLayer(
      'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
      {
        attribution:
          'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
        maxZoom: 22,
      },
    ),
  },
  MapboxLight: {
    name: 'Mapbox Light',
    global: true,
    makeTileLayer: () => L.tileLayer(
      'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
      {
        attribution:
          'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>',
        id: 'mapbox.light',
        accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
        maxZoom: 22,
      },
    ),
  },
  OpenStreetMap: {
    name: 'Open Street Map',
    global: true,
    makeTileLayer: () => L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 21,
    }),
  },
  StyleizedMap: {
    name: 'Styleized Map',
    global: true,
    makeTileLayer: () => L.tileLayer(
      'https://api.mapbox.com/styles/v1/mr-mircs/cjt813r2c03qb1fldgqggk3dw/tiles/256/{z}/{x}/{y}?access_token={accessToken}',
      {
        accessToken: 'pk.eyJ1Ijoic2hhdW5qb2hhbnNlbiIsImEiOiJjamg1OWRmZXIxMmp1MzFtampiZjJoNDV4In0.PgQiDqLUli_GaxB1jmrI2A',
        maxZoom: 22,
      },
    ),
  },
  CamsMap: {
    name: 'Cam\'s Map',
    global: false,
    makeTileLayer: () => L.tileLayer(
      'https://api.mapbox.com/styles/v1/shaunjohansen/cjhichsvu67fe2rnt7z72id2e/tiles/256/{z}/{x}/{y}',
      {
        accessToken: 'pk.eyJ1Ijoic2hhdW5qb2hhbnNlbiIsImEiOiJjamg1OWRmZXIxMmp1MzFtampiZjJoNDV4In0.PgQiDqLUli_GaxB1jmrI2A',
        maxZoom: 22,
      },
    ),
  },
  Heatherton: {
    name: 'Heatherton',
    global: false,
    makeTileLayer: () => L.tileLayer(
      'https://api.mapbox.com/styles/v1/mr-mircs/cjs68f2j02ag81fl3i6ag5c4q/tiles/256/{z}/{x}/{y}?access_token={accessToken}',
      {
        accessToken: 'pk.eyJ1Ijoic2hhdW5qb2hhbnNlbiIsImEiOiJjamg1OWRmZXIxMmp1MzFtampiZjJoNDV4In0.PgQiDqLUli_GaxB1jmrI2A',
        maxZoom: 22,
      },
    ),
  },
  HeathertonSatellite: {
    name: 'Heatherton Satellite',
    global: false,
    makeTileLayer: () => L.tileLayer(
      'https://api.mapbox.com/styles/v1/mr-mircs/cjt80vl9o1qg11flhmy9dqtz0/tiles/256/{z}/{x}/{y}?access_token={accessToken}',
      {
        accessToken: 'pk.eyJ1Ijoic2hhdW5qb2hhbnNlbiIsImEiOiJjamg1OWRmZXIxMmp1MzFtampiZjJoNDV4In0.PgQiDqLUli_GaxB1jmrI2A',
        maxZoom: 22,
      },
    ),
  },
  DurhamWestRiverSatellite: {
    name: 'Durham/West River Satellite',
    global: false,
    makeTileLayer: () => L.tileLayer(
      'https://api.mapbox.com/styles/v1/mr-mircs/cjt80yuzk1vn61fqmm5xiqvdw/tiles/256/{z}/{x}/{y}?access_token={accessToken}',
      {
        accessToken: 'pk.eyJ1Ijoic2hhdW5qb2hhbnNlbiIsImEiOiJjamg1OWRmZXIxMmp1MzFtampiZjJoNDV4In0.PgQiDqLUli_GaxB1jmrI2A',
        maxZoom: 22,
      },
    ),
  },
  HalifaxSatellite: {
    name: 'Halifax Satellite',
    global: false,
    makeTileLayer: () => L.tileLayer(
      'https://api.mapbox.com/styles/v1/mr-mircs/cjt80zw556zux1gqi5tbeg0ey/tiles/256/{z}/{x}/{y}?access_token={accessToken}',
      {
        accessToken: 'pk.eyJ1Ijoic2hhdW5qb2hhbnNlbiIsImEiOiJjamg1OWRmZXIxMmp1MzFtampiZjJoNDV4In0.PgQiDqLUli_GaxB1jmrI2A',
        maxZoom: 22,
      },
    ),
  },
  NewRossSatellite: {
    name: 'New Ross Satellite',
    global: false,
    makeTileLayer: () => L.tileLayer(
      'https://api.mapbox.com/styles/v1/mr-mircs/cjt8110fw12sl1fqu25gutz5x/tiles/256/{z}/{x}/{y}?access_token={accessToken}',
      {
        accessToken: 'pk.eyJ1Ijoic2hhdW5qb2hhbnNlbiIsImEiOiJjamg1OWRmZXIxMmp1MzFtampiZjJoNDV4In0.PgQiDqLUli_GaxB1jmrI2A',
        maxZoom: 22,
      },
    ),
  },
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  layers,
  defaultLayer: layers.OpenStreetMap,
  defaultLayerId: 'OpenStreetMap',
}
