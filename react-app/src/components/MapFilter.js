import { action } from 'mobx'
import { CurrentDataSetRecords } from '../api/DataSetRecords'
import { CurrentRelationshipJoin } from '../api/RelationshipJoin'
import { CurrentView } from '../api/View'
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/core/styles'
import _ from 'lodash'
import Chip from '@material-ui/core/Chip'
import Layout from '../utils/Layout'
import MapTileLayers from '../resources/temp-map-tile-layers/MapTileLayers'
import MenuItem from '@material-ui/core/MenuItem'
import PropTypes from 'prop-types'
import React from 'react'
import TextField from '@material-ui/core/TextField'

const MapFilter = observer(class extends React.Component {

  static propTypes = {
    store: PropTypes.object,
  }

  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      this.handleSearchSubmit(event)
    }
  };

  handleTileLayerNameChange = action((event) => {
    this.props.store.tileLayerName = event.target.value
  })

  handleFieldNameHighlighting = action( (event) => {
    // This counts the distinct values in the selected field, then sorts by the most common values.
    this.props.store.highlightField = event.target.value
    let valueCounts = [] // An array of objects used to keep a count of each of all of the values of this field, eg {value:'foo',count:7}
    let thisValue

    CurrentDataSetRecords.res.get('list', []).forEach((record) => {
      thisValue = _.get(record, event.target.value) // Try to find the value of the requested field in the current card
      this.countFieldValue(valueCounts, thisValue)
    })

    CurrentRelationshipJoin.res.get('list', []).forEach((record) => {
      _.each(record.data, (card) => { // Loop through all the records found in the relationship
        thisValue = _.get(card.values().next().value, event.target.value) // Try to find the value of the requested field in the current card
        this.countFieldValue(valueCounts, thisValue)
      })
    })

    const linkMap = this.props.store.linkMap
    _.each(linkMap, (value) => {
      _.each(value, (card) => {
        thisValue = _.get(card, event.target.value) // Try to find the value of the requested field in the current card
        this.countFieldValue(valueCounts, thisValue)
      })
    })

    valueCounts = _.sortBy(valueCounts, (o) => -o.count)
    this.props.store.searchStrings = []
    for (let i=0; i<valueCounts.length; i++) {
      if (valueCounts[i]) {
        this.props.store.searchStrings.push(event.target.value + ': ' + valueCounts[i].value)
      }
    }
  })

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

  handleSearchSubmit = action( (event) => {
    if (event.target.value) {
      if (this.props.store.searchStrings) {
        if (!this.props.store.searchStrings.includes(event.target.value)) {
          this.props.store.searchStrings.push(event.target.value)
          this.props.store.foundRecords.push([])
        }
        event.target.value = ''
      }
    }
  })

  handleSearchDelete = action( (data) => {
    if (this.props.store.searchStrings) {
      const deletedIndex = this.props.store.searchStrings.indexOf(data)
      this.props.store.searchStrings.splice(deletedIndex, 1)
    }
  });

  render() {
    const { classes } = this.props

    let otherChip = ''
    if (this.props.store.searchStrings.length>0) {
      const otherChipStyle = {
        margin: 5,
        backgroundColor: Layout.colours[7],
      }
      const otherLabel = 'Other: ' + this.props.store.getOtherCount
      otherChip = <Chip
        key='Other'
        label={otherLabel}
        style={otherChipStyle}
        color='default'
      />
    }

    // Set up the list of layers that will be displayed.  We want to only show the layer that this view is configured
    // to use as well as the global layers.
    let layers = {}
    let viewLayer = CurrentView.res.get('tileLayerName')
    if (viewLayer && viewLayer.length > 0)
      layers[viewLayer] = viewLayer
    for (let [key, value] of Object.entries(MapTileLayers.layers)) {
      if (value.global) {
        layers[key] = key
      }
    }

    return (
      <form className={classes.container} noValidate autoComplete='off'>

        <TextField
          id='standard-select-currency'
          select
          label='Map Background'
          className={classes.mapOptions}
          value={this.props.store.tileLayerName}
          onChange={this.handleTileLayerNameChange}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          helperText='Select a map background to display with this data...'
          margin='normal'
          variant='outlined'
          style={{ marginLeft: 10 }}
        >
          {Object.keys(layers).map((key) =>
            <MenuItem key={key} value={key}>
              {MapTileLayers.layers[key].name}
            </MenuItem>
          )}
        </TextField>

        <TextField
          id='standard-select-field'
          select
          label='Highlight Fields'
          className={classes.mapOptions}
          value={this.props.store.highlightField}
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

        <TextField
          id='searchTerm'
          label='Search'
          type='search'
          className={classes.mapOptions}
          margin='normal'
          variant='outlined'
          onBlur={this.handleSearchSubmit}
          onSubmit={this.handleSearchSubmit}
          onKeyDown={this.handleKeyDown}
        />

        <div className={classes.root}>
          {this.props.store.searchStrings.map( (data, i) => {
            let labelValue = data + ' (' + this.props.store.foundRecords[i].length + ')'
            if (data.startsWith('Other')) {
              labelValue = data
            }
            const divStyle = {
              margin: 5,
              backgroundColor: Layout.colours[i],
            }
            let colour = 'primary'
            if ([1,3,4].indexOf(i) > -1)
              colour = 'default'
            if (i<7) {
              return (
                <Chip
                  key={i}
                  label={labelValue}
                  onDelete={() => this.handleSearchDelete(data)}
                  style={divStyle}
                  color={colour}
                />
              )
            } else {
              return ''
            }
          })}
          {otherChip}
        </div>
      </form>
    )
  }
})

const styles = {
  mapOptions: {
    marginLeft: 10,
  },
  root: {
    display: 'inline-flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: 5,
    marginTop: 16,
    marginLeft: 5,
  },
}

export default withStyles(styles)(MapFilter)
