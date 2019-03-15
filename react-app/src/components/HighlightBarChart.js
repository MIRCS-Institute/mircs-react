import { action, extendObservable } from 'mobx'
import { HorizontalBar } from 'react-chartjs-2'
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/core'
import _ from 'lodash'
import Layout from '../utils/Layout'
import MenuItem from '@material-ui/core/MenuItem'
import PropTypes from 'prop-types'
import React from 'react'
import TextField from '@material-ui/core/TextField'

const HighlightBarChart = observer(class extends React.Component {

  static propTypes = {
    theme: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  }

  constructor() {
    super()
    extendObservable(this, {
      highlightSecondaryText: 'none',
      highlightSecondaryIndex: 0,
      highlightSecondaryField: 'none',
    })
  }

  countFieldValue = (valueCounts, thisValue) => {
    // Used for incrementing our count of a given value.
    if (thisValue) { // We have a value
      let counter = _.find(valueCounts, function(o) { return o.value === thisValue }) // See if we have a counter object already for this field value
      if (counter) {
        counter.count++
      } else {
        counter = { value: thisValue, count: 1 }
        valueCounts.push(counter)
      }
    }
  }

  /**
   * Generates a barchart based on the current highlightField in the map.
   * @returns a barchart corresponding to the highlightField counts for different values.
   */
  getBarChart = () => {
    if (this.props.store.highlightField !== 'none') {
      const barChartLabels = []
      const barChartData = []

      let shownBarCount = this.props.store.foundRecords.length
      if (shownBarCount > 7)
        shownBarCount = 7
      let highlightField = ''
      for (let i = 0; i < shownBarCount; i++) {
        const searchString = this.props.store.searchStrings[i]
        const separatorLocation = searchString.indexOf(':')
        highlightField = searchString.substring(0, separatorLocation)
        const highlightValue = searchString.substring(separatorLocation + 2)
        barChartLabels.push(highlightValue)
        barChartData.push(this.props.store.foundRecords[i].length)
      }
      /*
      if (this.props.store.getOtherCount.get()>0) {
        barChartLabels.push('Other')
        barChartData.push(this.props.store.getOtherCount.get())
      }
      */

      const data = {
        labels: barChartLabels,
        datasets: [{
          label: '',
          backgroundColor: Layout.colours,
          borderColor: 'rgb(255, 99, 132)',
          data: barChartData,
        }],
      }

      const options = {
        legend: {
          display: false,
        },
        onClick: action((event, elements) => {
          if (elements[0]) {
            this.highlightSecondaryText = elements[0]._model.label
            this.highlightSecondaryIndex = elements[0]._index
          }
        }),
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true,
            },
          }],
        },
        title: {
          display: true,
          text: highlightField,
        },
      }

      return <HorizontalBar data={data} options={options}/>
    } else {
      return ''
    }
  }

  getSecondSelectBox = () => {

    if (this.props.store.highlightField !== 'none') {

      const { classes } = this.props

      return (
        <div>
          <TextField
            id='secondary-select-field'
            select
            label='Secondary Field'
            value={this.highlightSecondaryField}
            onChange={this.handleFieldNameHighlighting}
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            margin='normal'
            variant='outlined'
            style={{ marginLeft: 10, width: 200 }}
          >
            <MenuItem key='none' value='none' name='none'>
              None
            </MenuItem>
            {this.props.store.fieldNames.map((data, i) => {
              return (
                <MenuItem key={i} value={data} name={data}>
                  {data}
                </MenuItem>
              )
            })}
          </TextField>
        </div>
      )
    } else {
      return ''
    }
  }

  /**
   * Generates a secondary barchart showing details of the clicked bar in the first bar chart.
   * @returns the jsx tag for the barchart if applicable.
   */
  getSecondBarChart = () => {

    console.log(this.props.store.highlightField)
    console.log(this.highlightSecondaryText)
    console.log(this.highlightSecondaryIndex)
    console.log(this.highlightSecondaryField)

    if (this.props.store.highlightField !== 'none' && this.highlightSecondaryField !== 'none' && this.highlightSecondaryIndex>0) {

      const barChartLabels = []
      const barChartData = []

      // Here we have to get the counts of the values grouped by the second highlight field.
      let valueCounts = [] // An array of objects used to keep a count of each of all of the values of this field, eg {value:'foo',count:7}
      let thisValue

      const secondaryHighlightField = this.highlightSecondaryField //'Occupation'

      if (this.props.store.foundRecords.length >= this.highlightSecondaryIndex) {
        this.props.store.foundRecords[this.highlightSecondaryIndex].forEach((record) => {
          thisValue = _.get(record, secondaryHighlightField) // Try to find the value of the requested field in the current card
          this.countFieldValue(valueCounts, thisValue)
        })
      }

      valueCounts = _.sortBy(valueCounts, (o) => -o.count)
      const secondaryStrings = []
      for (let i=0; i<valueCounts.length; i++) {
        if (valueCounts[i]) {
          secondaryStrings.push(secondaryHighlightField + ': ' + valueCounts[i].value)
        }
      }


      let shownBarCount = valueCounts.length
      if (shownBarCount>7)
        shownBarCount = 7
      let highlightField = ''
      for (let i=0; i<shownBarCount; i++) {
        const searchString = secondaryStrings[i]
        const separatorLocation = searchString.indexOf(':')
        highlightField = searchString.substring(0, separatorLocation)
        const highlightValue = searchString.substring(separatorLocation + 2)
        barChartLabels.push(highlightValue)
        barChartData.push(valueCounts[i].count)
      }

      const data = {
        labels: barChartLabels,
        datasets: [{
          label: '',
          backgroundColor: Layout.colours[this.highlightSecondaryIndex],
          borderColor: 'rgb(255, 99, 132)',
          data: barChartData,
        }],
      }

      const options = {
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true,
            },
          }],
        },
        title: {
          display: true,
          text: highlightField,
        },
      }

      return (
        <HorizontalBar data={data} options={options} />
      )
    } else {
      return ''
    }
  }

  handleFieldNameHighlighting = action( (event) => {
    this.highlightSecondaryField = event.target.value
  })

  render() {

    return (
      <div>
        {this.getBarChart()}
        {this.getSecondSelectBox()}
        {this.getSecondBarChart()}
      </div>
    )
  }
})

const styles = {}

export default withStyles(styles)(HighlightBarChart)
