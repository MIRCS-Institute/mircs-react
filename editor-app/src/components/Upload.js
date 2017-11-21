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

const theme = createMuiTheme({
  palette: {
    primary: blue
  }
});

/* this class will fetch all uploaded CSV files the server and display them */

const currentUpload = observer(class extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    extendObservable(this, {
      newDataSet: [],
      error: null,
      isUploaded: false,
    });
  }

  handleChange(newDataSet) {
    const x = csvConversion.convertToJson(newDataSet);
  }

  render() {
    return (
      <div>
        {<header style={styles.header}>CSV File Upload</header>}

        {/* remember to use isUploaded */}
        <Card style={{ marginBottom: 10 }}>
          <CardContent>
            <div>
              <p>Drag and drop a CSV file below to upload data to the MIRCS platform.</p>
              <Dropzone style={styles.dropzone} name={"fileUpload"} onDrop={this.handleChange} />
            </div>
          </CardContent>
        </Card>
        <ErrorSnackbar error={this.error} />
      </div>
    );
  }
});

let header = true; // if the CSV file contains a header at row 0, most usually do
let parsedDocument = {};

/* 
use FileReader and CSV modules to convert CSV to a readable format 
... later we will have it so there is a form... drag and drop for now
*/

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

export default currentUpload;