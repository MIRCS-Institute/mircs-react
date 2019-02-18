import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import { showSnackbarMessage } from '../../components/SnackbarMessages'
import PropTypes from 'prop-types'
import React from 'react'
import ServerHttpApi from '../../api/net/ServerHttpApi'

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
        ServerHttpApi.jsonGet(`/api/datasets/${fetchingDataSetId}`)
          .then(action((response) => {
            // due to the asynchronous nature of http requests, we check to see that this response is
            // regarding the one requested, otherwise we ignore it
            if (fetchingDataSetId === this.props.dataSetId) {
              this.dataSet = response.bodyJson
            }
          }))
          .catch(action((error) => {
            console.error('Error fetching DataSet', fetchingDataSetId, error)
            showSnackbarMessage(error)
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
