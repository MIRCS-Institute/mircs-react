import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/core'
import Layout from '../utils/Layout'
import PieChart from 'react-simple-pie-chart'
import PropTypes from 'prop-types'
import React from 'react'
import Typography from '@material-ui/core/Typography'

const HighlightPieChart = observer(class extends React.Component {

  static propTypes = {
    theme: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  }

  render() {

    let pieChart = null

    if (this.props.store.highlightField !== 'none') {
      const pieChartData = []
      let shownSliceCount = this.props.store.foundRecords.length
      if (shownSliceCount>7)
        shownSliceCount = 7
      for (let i=0; i<shownSliceCount; i++) {
        pieChartData.push({ color: Layout.colours[i], value: this.props.store.foundRecords[i].length })
      }
      pieChartData.push({ color: Layout.colours[7], value: this.props.store.getOtherCount.get() })
      pieChart = <div>
        <Typography variant='h5' align='center'>{this.props.store.highlightField}</Typography>
        <PieChart
          slices={pieChartData}
        />
      </div>
    }


    return (
      <div>
        {pieChart}
      </div>
    )
  }
})

const styles = () => ({})

export default withStyles(styles, { withTheme: true })(HighlightPieChart)
