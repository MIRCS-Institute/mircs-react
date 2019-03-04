import { goToPath, Path } from '../../app/App'
import {observer} from 'mobx-react'
import Button from '@material-ui/core/Button'
import Layout from '../../utils/Layout'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import Typography from '@material-ui/core/Typography'

const ViewCard = observer(class extends React.Component {
  static propTypes = {
    view: PropTypes.object,
  }

  render() {
    const { view } = this.props
    const viewId = view._id

    return (
      <Paper style={{ ...Layout.column, width: 300, margin: 12, padding: 12 }}>
        <Typography gutterBottom variant='h5' component='h2'>
          {view.name}
        </Typography>
        <Typography component='p'>
          {view.description}
        </Typography>
        <div style={{ flex: 1 }}/>
        <Button size='small' color='primary' onClick={() => goToPath(Path.view({ viewId }))}>
          View
        </Button>
      </Paper>
    )
  }
})

export default ViewCard
