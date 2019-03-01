import {action, extendObservable} from 'mobx'
import _ from 'lodash'

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

  reset = action( () => {
    this.tileLayerName = 'Mapbox'
    this.searchStrings = []
    this.fieldNames = []
    this.highlightField = 'none'
    this.foundRecords = []
    this.points = []
    this.selected = {}
  })

  addFieldNames = action((record) => {
    // Use the provided sample record to gather field names.  Names starting with an underscore are ignored.
    if (record) {
      let properties = record
      // Get the properties from server relationships
      if (record.data)
        properties = record.data[0].values().next().value
      // Get the properties from geojson
      if (record.properties)
        properties = record.properties
      // Add any relevant property names to the list
      _.each(properties, (property, key) => {
        if (!key.startsWith('_') && this.fieldNames.indexOf(key)===-1)
          this.fieldNames.push(key)
      })
    }
  })

}

export default new UiStore()
