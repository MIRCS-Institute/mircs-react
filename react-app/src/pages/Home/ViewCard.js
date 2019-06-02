import { goToPath, Path } from '../../app/App'
import {observer} from 'mobx-react'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'

const ViewCard = observer(class extends React.Component {
  static propTypes = {
    view: PropTypes.object,
  }

  render() {
    const { view } = this.props
    const viewId = view._id

    return (
      <Card style={{ width: 300, margin: 12 }}>
        <CardActionArea>
          {view.image &&
            <CardMedia
              image={view.image.url}
              title={view.image.name}
              style={{ height: 140 }}
            />
          }
          <CardContent>
            <Typography gutterBottom variant='h5' component='h2'>
              {view.name}
            </Typography>
            <Typography component='p'>
              {view.description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size='small' color='primary' onClick={() => goToPath(Path.view({ viewId }))}>
            View
          </Button>
        </CardActions>
      </Card>
    )
  }
})

export default ViewCard
