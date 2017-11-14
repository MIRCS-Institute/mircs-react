import blue from 'material-ui/colors/blue'
import FileUploadIcon from 'material-ui-icons/FileUpload'
import Grid from 'material-ui/Grid'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import React from 'react';
import Button from 'material-ui/Button';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import csv from 'csv';
import Dropzone from 'react-dropzone';
import http from '../utils/http'
import _ from 'lodash'
import Card, { CardContent, CardHeader } from 'material-ui/Card'
import ErrorSnackbar from './ErrorSnackbar'
import LoadingSpinner from './LoadingSpinner'
import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'

const theme = createMuiTheme({
  palette: {
    primary: blue
  }
});

/* this class will fetch all uploaded CSV files the server and display them */

const currentUpload = observer(class extends React.Component {
  constructor() {
    super();
    extendObservable(this, {
      collection: [],
      error: null,
      isUploaded: false
    });
  }

  render() {
    return (
      <div>
        {/* remember to use isUploaded */}
        <Card style={{ marginBottom: 10 }}>
          <CardHeader title={"CSV File Upload"} />
          <CardContent>
            <div>
              <p>Drag and drop a CSV file below to upload data to the MIRCS platform.</p>
              <Dropzone style={styles.dropzone} multiple="false" name={"fileUpload"} onDrop={uploadCSV} />
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

/* use FileReader and CSV modules to convert CSV to a readable format */
let uploadCSV = uploadCSV = (e) => {
  const reader = new FileReader();
  reader.onload = () => {
    csv.parse(reader.result, (err, data) => {
      // from here we want to take this data and
      // then we want to send it to the database
      parsedDocument.information = JSON.stringify(data);

      let x = http.jsonRequest('/api/routes/upload-document');
      console.log(x);

      // ok so once we figure this out and we properly make a json object
      // then we should be able to connect to mongo and send it
      console.log(parsedDocument.information);
    });
  };
  reader.readAsBinaryString(e[0]);
}

const styles = {
  header: {
    padding: '17px'
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