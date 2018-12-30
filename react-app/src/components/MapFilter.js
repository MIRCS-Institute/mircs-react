import { action } from 'mobx'
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types'
import React from 'react'
import TextField from '@material-ui/core/TextField';

const MapFilter = observer(class extends React.Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
  };

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidUpdate(prevProps, prevState) {
  }

  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.handleSearchSubmit(event);
    }
  };

  handleTileLayerNameChange = action((event) => {
    this.props.store.tileLayerName.set(event.target.value);
  });

  handleSearchSubmit = action( (event) => {
    if (event.target.value) {
      if (this.props.store.searchStrings) {
        if (!this.props.store.searchStrings.includes(event.target.value)) {
          this.props.store.searchStrings.push(event.target.value);
        }
        event.target.value = '';
      }
    }
  });

  handleSearchDelete =
    action(
      (data) => {
        if (this.props.store.searchStrings) {
          this.props.store.searchStrings.splice(this.props.store.searchStrings.indexOf(data), 1);
        }
      });

  render() {
    const { classes } = this.props;
    const store = this.props.store;

    return (
      <form className={classes.container} noValidate autoComplete="off">

        <TextField
          id="standard-select-currency"
          select
          label="Tile Layer"
          className={classes.mapOptions}
          value={store.tileLayerName.get()}
          onChange={this.handleTileLayerNameChange}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          /* helperText="Please choose the mapping base layer..." */
          margin="normal"
          variant="outlined"
          style={{ marginLeft: 10 }}
        >
          <MenuItem value="CamsMap">
            Cam's Map
          </MenuItem>
          <MenuItem value="OpenStreetMap">
            OpenStreetMap
          </MenuItem>
          <MenuItem value="Mapbox">
            Mapbox
          </MenuItem>
        </TextField>

        <TextField
          id="searchTerm"
          label="Search"
          type="search"
          className={classes.mapOptions}
          margin="normal"
          variant="outlined"
          onBlur={this.handleSearchSubmit}
          onSubmit={this.handleSearchSubmit}
          onKeyDown={this.handleKeyDown}
        />

        <div className={classes.root}>
          {store.searchStrings.map( (data, i) => {
            if (i===0) {
              return (
                <Chip
                  key={data}
                  label={data}
                  onDelete={() => this.handleSearchDelete(data)}
                  className={classes.chip0}
                  color="primary"
                />
              );
            } else if (i===1) {
              return (
                <Chip
                  key={data}
                  label={data}
                  onDelete={() => this.handleSearchDelete(data)}
                  className={classes.chip1}
                  color="primary"
                />
              );
            } else if (i===2) {
              return (
                <Chip
                  key={data}
                  label={data}
                  onDelete={() => this.handleSearchDelete(data)}
                  className={classes.chip2}
                  color="primary"
                />
              );
            } else if (i===3) {
              return (
                <Chip
                  key={data}
                  label={data}
                  onDelete={() => this.handleSearchDelete(data)}
                  className={classes.chip3}
                />
              );
            }
            return (
              <Chip
                key={data}
                label={data}
                onDelete={() => this.handleSearchDelete(data)}
                className={classes.chipx}
              />
            );
          })}
        </div>
      </form>
    )
  }
});

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
    backgroundColor: 'green',
  },
  chip2: {
    margin: 5,
    backgroundColor: 'deepskyblue',
  },
  chip3: {
    margin: 5,
    backgroundColor: 'orange',
  },
  chipx: {
    margin: 5,
  },
};

export default withStyles(styles)(MapFilter)
