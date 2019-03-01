import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/core'
import _ from 'lodash'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Layout from '../utils/Layout'
import Paper from '@material-ui/core/Paper'
import PieChart from 'react-simple-pie-chart'
import PropTypes from 'prop-types'
import React from 'react'
import StreetviewCard from './StreetviewCard'
import Typography from '@material-ui/core/Typography'
import UiStore from '../states/UiStore'

const MapDrawer = observer(class extends React.Component {

  static propTypes = {
    theme: PropTypes.object.isRequired,
  }

  state = {
    open: true,
  }

  handleDrawerOpen = () => {
    this.setState({ open: true })
  }

  handleDrawerClose = () => {
    this.setState({ open: false })
  }

  render() {
    const { classes } = this.props
    const { open } = this.state

    let pieChart = null

    if (UiStore.highlightField !== 'none') {
      const pieChartData = []
      for (let i=0; i<UiStore.foundRecords.length; i++) {
        pieChartData.push({ color: Layout.colours[i], value: UiStore.foundRecords[i].length })
      }
      pieChart = <div>
        <Typography variant='h5' align='center'>{UiStore.highlightField}</Typography>
        <PieChart
          slices={pieChartData}
        />
      </div>
    }


    if (UiStore.selected.records && UiStore.selected.records.length > 0) {
      return (
        <Paper
          anchor='left'
          open={open}
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper,
          }}
          square={true}
        >
          {pieChart}

          <Typography variant='h6' align='center'>{UiStore.selected.records.length} records at selected location.</Typography>

          {UiStore.selected.records.map((record, i) => (
            <Card className={classes.card} key={i}>
              <CardContent>
                {_.map(record.properties || record, (value, field) => {
                  if (field[0] === '_' || !value) {
                    return null
                  }

                  // highlight any search terms within the card
                  let __html = value
                  UiStore.searchStrings.forEach((s, i) => {
                    let searchString = UiStore.searchStrings[i]
                    if (searchString.includes(':')) {
                      const separatorLocation = searchString.indexOf(':')
                      const highlightField = searchString.substring(0, separatorLocation)
                      const highlightValue = searchString.substring(separatorLocation + 2)
                      if (field === highlightField && (''+value).toLowerCase() === (''+highlightValue).toLowerCase()) {
                        __html = '<span class="search' + i + '">' + value + '</span>'
                      }
                    } else {
                      const regex = new RegExp(UiStore.searchStrings[i], 'giy')
                      while (regex.test(__html)) {
                        __html = __html.substring(0, regex.lastIndex - RegExp.lastMatch.length)
                          + '<span class="search' + i + '">' + RegExp.lastMatch + '</span>'
                          + __html.substring(regex.lastIndex)
                      }
                    }
                  })

                  return <Typography key={field}>
                    <strong>{field}:</strong>
                    <span dangerouslySetInnerHTML={{ __html }}/>
                  </Typography>
                })}
              </CardContent>
            </Card>
          ))}

          <StreetviewCard/>

        </Paper>
      )
    } else {
      return (
        <Paper
          anchor='left'
          open={open}
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper,
          }}
          square={true}
        >
          {pieChart}
          <Typography component='i' variant='h6' align='center'>
            Select a location for more detail.
          </Typography>
        </Paper>
      )

    }
  }
})

const styles = () => ({
  root: {
    display: 'flex',
  },
  card: {
    margin: 8,
  },
  drawer: {
    backgroundColor: '#f8f8f8',
    width: 350,
    overflowY: 'auto',
  },
})

export default withStyles(styles, { withTheme: true })(MapDrawer)
