import { action } from 'mobx'
import { observer } from 'mobx-react'
import { showSnackbarMessage } from '../../components/SnackbarMessages'
import _ from 'lodash'
import FileButton from '../../components/FileButton'
import papa from 'papaparse'
import PropTypes from 'prop-types'
import React from 'react'
import ServerHttpApi from '../../api/net/ServerHttpApi'

const UploadDataSetFileButton = observer(class extends React.Component {
  static propTypes = {
    dataSetId: PropTypes.string.isRequired,
    onDataSetUpdated: PropTypes.func.isRequired,
  }

  handleFilesSelected = (files) => {
    const file = files[0]
    if (file.name.endsWith('json')) {
      // parse json file
      const reader = new FileReader()
      reader.onload = (event) => {
        let obj = JSON.parse(event.target.result)
        this.handleJsonLoaded(obj)
      }
      reader.readAsText(file)
    } else {
      // default to csv file
      papa.parse(file, {
        dynamicTyping: true,
        complete: (results) => {
          this.handleCsvLoaded(results.data)
        },
        error: showSnackbarMessage,
      })
    }
  }

  handleCsvLoaded = (data) => {
    const headers = data[0]
    const illegalHeaders = []
    _.each(headers, (header, index) => {
      if (!header || header[0] === '$' || header.indexOf('.') >= 0) {
        illegalHeaders.push(header || index)
      }
    })
    if (illegalHeaders.length) {
      return showSnackbarMessage(new Error('Headers cannot contain dots (i.e. .) or null characters, and they must not start with a dollar sign (i.e. $). Illegal headers: ' + illegalHeaders.join(', ')))
    }

    const records = []
    _.each(data, (row, index) => {
      if (index > 0) { // skip header row
        const record = {}
        _.each(row, (value, rowValueIndex) => {
          const key = headers[rowValueIndex]
          record[key] = value
        })
        records.push(record)
      }
    })

    this.uploadData(records)
  }

  handleJsonLoaded = (data) => {
    if (data.features) {
      // This looks like a geojson file, pull the data out of the features field
      this.uploadData(data.features)
    } else {
      // Assuming generic array of objects
      this.uploadData(data)
    }
  }

  /**
   * Uploads records to add to the current dataset.
   * @param records A JSON formatted object or array of objects.
   */
  uploadData = (records) => {
    ServerHttpApi.jsonPost(`/api/datasets/${this.props.dataSetId}/records`, { records })
      .then(action(() => {
        this.props.onDataSetUpdated()
      }))
      .catch(showSnackbarMessage)
  }

  render() {
    return <FileButton variant='contained' onFilesSelected={this.handleFilesSelected}>
      Upload Data Set
    </FileButton>
  }
})

export default UploadDataSetFileButton
