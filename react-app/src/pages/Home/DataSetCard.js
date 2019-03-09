import { goToPath, Path } from '../../app/App'
import {observer} from 'mobx-react'
import Button from '@material-ui/core/Button'
import Layout from '../../utils/Layout'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import Typography from '@material-ui/core/Typography'

const DataSetCard = observer(class extends React.Component {
  static propTypes = {
    dataSet: PropTypes.object,
  }

  render() {
    const { dataSet } = this.props
    const dataSetId = dataSet._id

    return (
      <Paper style={{ ...Layout.column, width: 300, margin: 12, padding: 12 }}>
        <Typography gutterBottom variant='h5' component='h2'>
          {dataSet.name}
        </Typography>
        <Typography component='p'>
          {dataSet.description}
        </Typography>
        <div style={{ flex: 1 }}/>
        <Button size='small' color='primary' onClick={() => goToPath(Path.dataSetMap({ dataSetId }))}>
          View
        </Button>
      </Paper>
    )
  }
})

export default DataSetCard
