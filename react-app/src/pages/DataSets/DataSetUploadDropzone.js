import { action } from 'mobx'
import { observer } from 'mobx-react'
import _ from 'lodash'
import Dropzone from 'react-dropzone'
import papa from 'papaparse'
import PropTypes from 'prop-types'
import React from 'react'
import ServerHttpApi from '../../api/net/ServerHttpApi'

const DataSetUploadDropzone = observer(class extends React.Component {
  static propTypes = {
    dataSet: PropTypes.object.isRequired,
    onDataSetUpdated: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
  }

  handleDrop = action((acceptedFiles) => {
    if (!acceptedFiles.length) {
      return
    }

    const file = acceptedFiles[0]
    papa.parse(file, {
      dynamicTyping: true,
      complete: (results) => {
        this.handleCsvLoaded(results.data)
      },
      error: (error) => {
        console.error('error parsing csv:', error)
        return this.props.onError(error)
      },
    })
  })

  handleCsvLoaded = (data) => {
    const headers = data[0]
    const illegalHeaders = []
    _.each(headers, (header, index) => {
      if (!header || header[0] === '$' || header.indexOf('.') >= 0) {
        illegalHeaders.push(header || index)
      }
    })
    if (illegalHeaders.length) {
      return this.props.onError(new Error('Headers cannot contain dots (i.e. .) or null characters, and they must not start with a dollar sign (i.e. $). Illegal headers: ' + illegalHeaders.join(', ')))
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

    ServerHttpApi.jsonPost(`/api/datasets/${this.props.dataSet._id}/records`, { records })
      .then(action(() => {
        this.props.onDataSetUpdated()
      }))
      .catch(action((error) => {
        this.props.onError(error)
      }))
  }

  render() {
    return (
      <Dropzone onDrop={this.handleDrop} accept='text/csv'
        activeStyle={{ backgroundColor: 'lightgray' }}
        rejectStyle={{ backgroundColor: 'red', cursor: 'no-drop' }}
      >
        {this.props.children}
      </Dropzone>
    )
  }
})


export default DataSetUploadDropzone
