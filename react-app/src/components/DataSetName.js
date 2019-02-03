import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import http from '../utils/http'
import PropTypes from 'prop-types'
import React from 'react'

const DataSetName = observer(class extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    dataSetId: PropTypes.string,
  }

  constructor(props) {
    super(props)
    extendObservable(this, {
      dataSetId: props.dataSetId,
      isLoading: false,
      error: null,
      dataSet: null,
    })
  }

  componentDidMount() {
    this.refresh()
  }

  refresh() {
    action(() => {
      if (!this.dataSetId) {
        this.dataSet = null
      } else {
        this.isLoading = true
        const fetchingDataSetId = this.dataSetId
        http.jsonRequest(`/api/datasets/${fetchingDataSetId}`)
          .then(action((response) => {
            // due to the asynchronous nature of http requests, we check to see that this response is
            // regarding the one requested, otherwise we ignore it
            if (fetchingDataSetId === this.props.dataSetId) {
              this.dataSet = response.bodyJson
            }
          }))
          .catch(action((error) => {
            console.error('Error fetching DataSet', fetchingDataSetId, error)
            this.error = error
          }))
          .then(action(() => {
            this.isLoading = false
          }))
      }
    })()
  }

  componentDidUpdate() {
    action(() => {
      if (this.dataSetId !== this.props.dataSetId) {
        this.dataSetId = this.props.dataSetId
        this.refresh()
      }
    })()
  }

  render() {
    return (
      <span>
        {this.isLoading && <span>Loading...</span>}

        {this.dataSetId ?
          <span>{this.dataSet && this.dataSet.name}</span>
          :
          <strong>{this.props.label}</strong>}
      </span>
    )
  }
})

export default DataSetName
