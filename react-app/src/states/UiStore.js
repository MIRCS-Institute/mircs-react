import {extendObservable} from 'mobx'

class UiStore {
  constructor() {
    extendObservable(this, {
      // The name of the tile layer to use.
      tileLayerName: 'Mapbox',

      // An array of strings that are being searched for
      searchStrings: [],

      // An array of the field names returned in the records
      fieldNames: [],

      // The name of the field selected for highlighting
      highlightField: 'none',

      // An array of arrays of records, each corresponding to the searchString at the same index
      foundRecords: [],

      // An array of points, each of which is a two value array of lat/long coordinates. ie [ [45, 126], [47, 123] ]
      points: [],

      // An object containing the point and array of selected records: { point: [123,45], records: [...] }
      selected: {},
    })
  }
}

export default new UiStore()
