import blue from 'material-ui/colors/blue'
import BugReportIcon from 'material-ui-icons/BugReport'
import FileUploadIcon from 'material-ui-icons/FileUpload'
import CollectionsIcon from 'material-ui-icons/Collections'
import HomeIcon from 'material-ui-icons/Home'
import MapIcon from 'material-ui-icons/Map'
import Grid from 'material-ui/Grid'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import React from 'react';
import Button from 'material-ui/Button';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import csv from 'csv';
import Dropzone from 'react-dropzone';

const theme = createMuiTheme({
  palette: {
    primary: blue
  }
});

// use FileReader and csv modules to parse CSV to JSON on client
let onDrop = onDrop = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
        csv.parse(reader.result, (err, data) => {
            // parsed CSV data
            console.log(data);
        });
    };

    reader.readAsBinaryString(e[0]);
}

const Upload = () => (
  <MuiThemeProvider theme={theme}>
    <div style={styles.content}>
      <Grid container spacing={16} direction='row' justify='space-between'>
        <Grid item xs={12} sm={12}>
        <h3>Drag and drop a CSV file to upload data to the MIRCS platform.</h3>
        <Dropzone name={"here"} onDrop={onDrop} />
        {/* <form method="post" enctype="multipart/form-data" action="/">
          <input type="file" name="filename"></input>
          <input type="submit" value="Upload"></input>
        </form> */}
        </Grid>
      </Grid>
    </div>
  </MuiThemeProvider>
);

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
};

export default Upload;