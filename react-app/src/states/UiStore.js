import {extendObservable} from 'mobx'

class UiStore {
  constructor() {
    extendObservable(this, {
      tileLayerName: 'Mapbox', // The name of the tile layer to use.
      searchStrings: [], // An array of strings that are being searched for
      records: [], // An array of records, basically the raw data returned from the server.
      foundRecords: [], // An array of arrays of records, each corresponding to the searchString at the same index
      points: [], // An array of points, each of which is a two value array of lat/long coordinates. ie [ [45, 126], [47, 123] ]
      selected: {}, // An object containing the point and array of selected records: { point: [123,45], records: [...] }
    })
  }
}

export default new UiStore()
