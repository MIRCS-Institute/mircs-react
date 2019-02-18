import { observer } from 'mobx-react'
import FileButton from '../../components/FileButton'
import PropTypes from 'prop-types'
import React from 'react'

const UploadDataSetFileButton = observer(class extends React.Component {
  static propTypes = {
    dataSetId: PropTypes.string.isRequired,
  }

  render() {
    return <FileButton>
      Upload Data Set
    </FileButton>
  }
})

export default UploadDataSetFileButton
