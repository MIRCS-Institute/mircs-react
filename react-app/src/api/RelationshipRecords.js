import { CurrentDataSetRecords, getDataSetRecordsRes } from './DataSetRecords'
import { getCurrentDataSetId } from './DataSet'
import { getRelationshipsRes } from './Relationships'
import _ from 'lodash'
import CurrentResource from './resources/CurrentResource'
import UiStore from '../states/UiStore'

class CurrentRelationshipRecordsClass extends CurrentResource {

  // linkMap is used to lookup related records.  The key is the database record id of the main table (field name tableName._id)
  // and the value is an array of related records.
  linkMap = {}

  constructor() {
    super([])
  }

  createCurrentResourceInstance() {

    // Get all relationships
    const dataSetRecords = CurrentDataSetRecords.res.get('list')
    if (dataSetRecords) {

      const relationships = getRelationshipsRes().get('list', [])
      const relatedSets = []

      // Loop through the relationships and look for any that include our current dataset.
      relationships.forEach((relationship) => {
        const dataSetId = getCurrentDataSetId()
        if (relationship.dataSets[0] === dataSetId) {
          relatedSets.push({'dataSetId': relationship.dataSets[1], 'joinElements': relationship.joinElements})
        } else if (relationship.dataSets[1] === dataSetId) {
          // flip the join elements because we assume that current is at index 0 later.
          relatedSets.push({
            'dataSetId': relationship.dataSets[0],
            'joinElements': this.reverseJoinElements(relationship.joinElements),
          })
        }
      })

      // Now loop through our related sets and add related records to our linkMap
      relatedSets.forEach((relatedSet) => {
        const relatedSetRecords = getDataSetRecordsRes(relatedSet.dataSetId).get('list', [])
        this.handleJoin(dataSetRecords, relatedSetRecords, relatedSet.joinElements, this.linkMap)
        UiStore.addFieldNames(relatedSetRecords[0])
      })

      return {linkMap: this.linkMap}

    } else {
      return { linkMap: {} }
    }

  }

  reverseJoinElements(original) {
    const result = []
    original.forEach((element) => {
      result.push([element[1],element[0]])
    })
    return result
  }

  // join the columns of the datasets determined by the key parameters described in the Relationship
  handleJoin(leftRecords, rightRecords, joinElements, linkMap) {

    // idMap is a map of key values and record _id's.  The gui map will refer to a location by _id as different relationships
    // may use different fields for their joins.  So we will use idMap to corelate the join key value to an _id.
    const leftIdMap = {}
    leftRecords.forEach( (leftRecord) => {
      const leftKey = this.getJoinKey(leftRecord, joinElements, 0)
      // If we were able to build a relevant key, add it to the map
      if (!_.isNull(leftKey)) {
        leftIdMap[leftKey] = leftRecord._id
      }
    })

    // Now loop through the related data and add any records to the linkMap when they have a relationship
    rightRecords.forEach( (rightRecord) => {
      const rightKey = this.getJoinKey(rightRecord, joinElements, 1)
      const leftRecordId = leftIdMap[rightKey]
      let properties = rightRecord
      if (typeof rightRecord.properties === 'object') {
        // GeoJSON object, look to the properties
        properties = rightRecord.properties
      }
      // Add any matching records to our linkMap
      if (leftRecordId) {
        if (!linkMap[leftRecordId]) {
          linkMap[leftRecordId] = []
        }
        linkMap[leftRecordId].push(properties)
      }
    })
  }

  getJoinKey(record, joinElements, tableIndex) {
    let key = ''
    let exclude = false
    // Build a single join value including multifield joins concatenated with _.  eg. either value1 or value1_value2
    joinElements.forEach( (joinElement) => {
      let properties = record
      if (typeof record.properties === 'object') {
        // GeoJSON object, look to the properties
        properties = record.properties
      }
      const keyValue = properties[joinElement[tableIndex]]
      if (_.isUndefined(keyValue) || _.isNull(keyValue)) {
        exclude = true
      } else {
        if (key.length > 0) {
          key += '_'
        }
        key += keyValue
      }
    })
    if (exclude) {
      return null
    } else {
      return key
    }
  }

}

export const CurrentRelationshipRecords = new CurrentRelationshipRecordsClass()
