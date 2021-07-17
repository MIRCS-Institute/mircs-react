import { autorun } from 'mobx'
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import OpenInNew from '@material-ui/icons/OpenInNew'
import PropTypes from 'prop-types'
import React from 'react'
import Typography from '@material-ui/core/Typography'

const StreetviewCard = observer(class extends React.Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  state = {
    loading: false,
  }

  url = 'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + this.props.store.selected.point[0] + ',' + this.props.store.selected.point[1] // undefined

  componentDidMount() {
    this.autorunDisposer = autorun(() => {
      this.getCard()
    })
  }

  componentWillUnmount() {
    this.autorunDisposer()
  }

  getCard = () => {

    /* This no longer works without Billing enabled for the api.  Maybe we can bring it back later.
    this.setState({ loading: true })

    if (this.props.store.selected.point) {
      // Check the google maps api metadata to see if there is street view available for this location
      http.jsonRequest('https://maps.googleapis.com/maps/api/streetview/metadata?location='
        + this.props.store.selected.point[0] + ',' + this.props.store.selected.point[1] + '&key=' + GOOGLE_API_KEY,
      {mode: 'cors', headers: {}})
        .then((response) => {
          // An 'OK' response means that there's something to see, anything else we'll ignore.
          if (_.get(response, 'bodyJson.status') === 'OK') {
            // Build a URL to the street view page for this location:
            this.url = 'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint='
                + this.props.store.selected.point[0] + ',' + this.props.store.selected.point[1]
                + '&key=' + GOOGLE_API_KEY
          } else {
            this.url = undefined
          }
        }
        )
        .catch(showSnackbarMessage)
        .then(() => {
          // Trigger a refresh
          this.setState({ loading: false })
        })
    }
    */
  }

  render() {
    const {classes} = this.props

    if (this.url) {
      return (
        <Card className={classes.card} key='s'>
          <CardContent>
            <Typography component='p'>
              <a href={this.url} target='_blank' rel='noopener noreferrer'>Street view <OpenInNew className={classes.icon} /></a>
            </Typography>
          </CardContent>
        </Card>
      )
    } else {
      return null
    }

  }

})

const styles = () => ({
  card: {
    margin: 8,
  },
})

export default withStyles(styles, { withTheme: true })(StreetviewCard)
