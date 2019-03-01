import { action } from 'mobx'
import { CurrentDataSetRecords } from '../api/DataSetRecords'
import { CurrentRelationshipJoin } from '../api/RelationshipJoin'
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/core/styles'
import _ from 'lodash'
import Chip from '@material-ui/core/Chip'
import Layout from '../utils/Layout'
import MenuItem from '@material-ui/core/MenuItem'
import React from 'react'
import TextField from '@material-ui/core/TextField'
import UiStore from '../states/UiStore'
import {CurrentRelationshipRecords} from '../api/RelationshipRecords'

const MapFilter = observer(class extends React.Component {
  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      this.handleSearchSubmit(event)
    }
  };

  handleTileLayerNameChange = action((event) => {
    UiStore.tileLayerName = event.target.value
  })

  handleFieldNameHighlighting = action( (event) => {
    // This counts the distinct values in the selected field, then sorts by the most common values.
    UiStore.highlightField = event.target.value
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

    const linkMap = CurrentRelationshipRecords.res.linkMap
    _.each(linkMap, (value, key) => {
      _.each(value, (card) => {
        thisValue = _.get(card, event.target.value) // Try to find the value of the requested field in the current card
        this.countFieldValue(valueCounts, thisValue)
      })
    })

    valueCounts = _.sortBy(valueCounts, (o) => -o.count)
    UiStore.searchStrings = []
    for (let i=0; i<7; i++) {
      if (valueCounts[i]) {
        UiStore.searchStrings.push(event.target.value + ': ' + valueCounts[i].value)
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
      if (UiStore.searchStrings) {
        if (!UiStore.searchStrings.includes(event.target.value)) {
          UiStore.searchStrings.push(event.target.value)
          UiStore.foundRecords.push([])
        }
        event.target.value = ''
      }
    }
  })

  handleSearchDelete =
    action(
      (data) => {
        if (UiStore.searchStrings) {
          const deletedIndex = UiStore.searchStrings.indexOf(data)
          UiStore.searchStrings.splice(deletedIndex, 1)
          UiStore.foundRecords.splice(deletedIndex, 1)
        }
      });

  render() {
    const { classes } = this.props
    const store = UiStore

    return (
      <form className={classes.container} noValidate autoComplete='off'>

        <TextField
          id='standard-select-currency'
          select
          label='Tile Layer'
          className={classes.mapOptions}
          value={store.tileLayerName}
          onChange={this.handleTileLayerNameChange}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          /* helperText="Please choose the mapping base layer..." */
          margin='normal'
          variant='outlined'
          style={{ marginLeft: 10 }}
        >
          <MenuItem value='CamsMap'>
            Cam's Map
          </MenuItem>
          <MenuItem value='OpenStreetMap'>
            OpenStreetMap
          </MenuItem>
          <MenuItem value='Mapbox'>
            Mapbox
          </MenuItem>
        </TextField>

        <TextField
          id='standard-select-field'
          select
          label='Highligh Fields'
          className={classes.mapOptions}
          value={store.highlightField}
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
          {store.fieldNames.map((data, i) => {
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
          {store.searchStrings.map( (data, i) => {
            const labelValue = data + ' (' + UiStore.foundRecords[i].length + ')'
            const divStyle = {
              margin: 5,
              backgroundColor: Layout.colours[i],
            }
            let colour = 'primary'
            if ([1,2,5].indexOf(i) > -1)
              colour = 'default'
            return (
              <Chip
                key={data}
                label={labelValue}
                onDelete={() => this.handleSearchDelete(data)}
                style={divStyle}
                color={colour}
              />
            )
          })}
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
