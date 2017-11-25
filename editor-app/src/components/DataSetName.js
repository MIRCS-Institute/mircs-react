import http from '../utils/http'
import PropTypes from 'prop-types'
import React from 'react'
import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'

const DataSetName = observer(class extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    dataSetId: PropTypes.string,
  }

  constructor(props) {
    super(props);
    extendObservable(this, {
      dataSetId: props.dataSetId,
      isLoading: false,
      error: null,
      dataSet: null,
    });
  }

  componentWillMount() {
    this.refresh();
  }

  refresh() {
    if (!this.dataSetId) {
      this.dataSet = null;
    } else {
      this.isLoading = true;
      http.jsonRequest(`/api/datasets/${this.dataSetId}`)
        .then(action((response) => {
          if (this.props.dataSetId) {
            this.dataSet = response.bodyJson;
          }
        }))
        .catch(action((error) => {
          console.error('Error fetching DataSet', this.dataSetId, error);
          this.error = error;
        }))
        .then(action(() => {
          this.isLoading = false;
        }));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.dataSetId !== nextProps.dataSetId) {
      action(() => {
        this.dataSetId = nextProps.dataSetId;
        this.refresh();
      })();
    }
  }

  render() {
    return (
      <span>
        {this.isLoading && <span>'Loading...'</span>}

        {this.dataSetId ?
          <span>{this.dataSet && this.dataSet.name}</span>
          :
          <strong>{this.props.label}</strong>}
      </span>
    );
  }
})

export default DataSetName;