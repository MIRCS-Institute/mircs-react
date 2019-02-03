import { action } from 'mobx'
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import MenuItem from '@material-ui/core/MenuItem'
import React from 'react'
import TextField from '@material-ui/core/TextField'
import UiStore from '../states/UiStore'

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
  });

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
  });

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
            if (i===0) {
              return (
                <Chip
                  key={data}
                  label={labelValue}
                  onDelete={() => this.handleSearchDelete(data)}
                  className={classes.chip0}
                  color='primary'
                />
              )
            } else if (i===1) {
              return (
                <Chip
                  key={data}
                  label={labelValue}
                  onDelete={() => this.handleSearchDelete(data)}
                  className={classes.chip1}
                />
              )
            } else if (i===2) {
              return (
                <Chip
                  key={data}
                  label={labelValue}
                  onDelete={() => this.handleSearchDelete(data)}
                  className={classes.chip2}
                />
              )
            } else if (i===3) {
              return (
                <Chip
                  key={data}
                  label={labelValue}
                  onDelete={() => this.handleSearchDelete(data)}
                  className={classes.chip3}
                  color='primary'
                />
              )
            } else if (i===4) {
              return (
                <Chip
                  key={data}
                  label={labelValue}
                  onDelete={() => this.handleSearchDelete(data)}
                  className={classes.chip4}
                  color='primary'
                />
              )
            } else if (i===5) {
              return (
                <Chip
                  key={data}
                  label={labelValue}
                  onDelete={() => this.handleSearchDelete(data)}
                  className={classes.chip5}
                />
              )
            } else if (i===6) {
              return (
                <Chip
                  key={data}
                  label={labelValue}
                  onDelete={() => this.handleSearchDelete(data)}
                  className={classes.chip6}
                  color='primary'
                />
              )
            }
            return (
              <Chip
                key={data}
                label={labelValue}
                onDelete={() => this.handleSearchDelete(data)}
                className={classes.chipx}
                color='primary'
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
  chip0: {
    margin: 5,
    backgroundColor: 'darkred',
  },
  chip1: {
    margin: 5,
    backgroundColor: 'orange',
  },
  chip2: {
    margin: 5,
    backgroundColor: 'yellow',
  },
  chip3: {
    margin: 5,
    backgroundColor: 'chartreuse',
  },
  chip4: {
    margin: 5,
    backgroundColor: 'green',
  },
  chip5: {
    margin: 5,
    backgroundColor: 'deepskyblue',
  },
  chip6: {
    margin: 5,
    backgroundColor: 'darkorchid',
  },
  chipx: {
    margin: 5,
  },
}

export default withStyles(styles)(MapFilter)
