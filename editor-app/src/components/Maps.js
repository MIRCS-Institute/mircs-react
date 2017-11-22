import blue from 'material-ui/colors/blue'
import React from 'react';
import { createMuiTheme } from 'material-ui/styles'
import Dropzone from 'react-dropzone';
import http from '../utils/http'
import Card, { CardContent } from 'material-ui/Card'
import ErrorSnackbar from './ErrorSnackbar'
import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import _ from 'lodash'
import csvConversion from '../utils/convertCSVtoJSON'
import axios from 'axios'
import Button from 'material-ui/Button'

const theme = createMuiTheme({
  palette: {
    primary: blue
  }
});


/* IGNORE THIS PAGE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
too lazy to figure out how to call MongoUtil from the backend */

const mapperTool = observer(class extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    extendObservable(this, {
      newDataSet: [],
      error: null,
      isUploaded: false,
    });
  }

  handleChange() {
    let x = 5;
    axios.post('/api/relationships', {
      file: x
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        {<header style={styles.header}>CSV File Upload</header>}

        {/* remember to use isUploaded */}
        <Card style={{ marginBottom: 10 }}>
          <CardContent>
            <div>
              <Button name={"button"} onClick={this.handleChange}> Clicckk </Button>
            </div>
          </CardContent>
        </Card>
        <ErrorSnackbar error={this.error} />
      </div >
    );
  }
});

const styles = {
  header: {
    fontSize: '30px',
    marginBottom: '20px'
  },
  logo: {
    height: '50px',
    width: '50px'
  },
  appTitle: {
    fontSize: '1.4em',
    paddingLeft: '15px',
    lineHeight: '2',
    verticalAlign: 'top'
  },
  sideMenuLink: {
    textDecoration: 'none'
  },
  content: {
    padding: '5px'
  },
  dropzone: {
    height: '200px',
    borderWidth: '2px',
    borderStyle: 'dashed',
    borderRadius: '5px'
  }
};

export default mapperTool;