import _ from 'lodash'
import {action, extendObservable} from 'mobx'
import {observer} from 'mobx-react'
import Button from 'material-ui/Button'
import Card, {CardContent, CardHeader} from 'material-ui/Card'
import http from 'utils/http'
import Layout from 'utils/Layout'
import Map from 'components/Map'
import React from 'react'

const Maps = observer(class extends React.Component {
  constructor(props) {
    super(props);
    extendObservable(this, {
      dataSets: [],
      relationships: [],
      selected: {},
    });
  }

  componentDidMount() {
    this.fetchDataSetRecords();
    this.fetchRelationshipRecords();
  }

  // use this to list all of the datasets on the left
  // TODO make sure we only request "mappable" datasets
  fetchDataSetRecords = action(() => {
    http.jsonRequest('/api/datasets')
      .then(action((response) => {
        this.dataSets = _.get(response, 'bodyJson.list');
      }))
      .catch(action((error) => {
        this.error = error;
      }));
  })

  fetchRelationshipRecords = action(() => {
    http.jsonRequest('/api/relationships')
      .then(action((response) => {
        this.relationships = _.get(response, 'bodyJson.list');
      }))
      .catch(action((error) => {
        this.error = error;
      }));
  })

  render() {
    return (
      <div style={{ ...Layout.absoluteFill, ...Layout.row }}>
        <div style={{ width: '30%', overflow: 'scroll' }}>

          {/* dataSets */}
          <h2>Data Sets</h2>
          {this.dataSets.map((dataSet) => (
              <div key={dataSet._id}>
                <Card style={styles.card}>
                  <CardHeader title={dataSet.name}/>
                  <CardContent>
                    <div>
                      <strong>Name:
                      </strong>
                      {dataSet.name}
                    </div>
                    {dataSet.description && <div>
                      <strong>Description:
                      </strong>
                      {dataSet.description}
                    </div>}
                    {dataSet.stats && <div>
                      <strong>Stats:
                      </strong>
                      {_.map(this.stats, (value, key) => (
                        <div
                          key={key}
                          style={{
                          marginLeft: 10
                        }}>{key}: {value}</div>
                      ))}
                    </div>}
                    <div style={{
                      textAlign: "center"
                    }}>
                      <Button
                        style={styles.button}
                        value={dataSet._id}
                        variant='raised'
                        color='primary'
                        onClick={action(() => {
                          this.selected = { dataSetId: dataSet._id }
                        })}>Map Data</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}

          {/* relationships */}
          <h2>Relationships</h2>
          {this.relationships.map((relation) => (
              <div key={relation._id}>
                <Card style={styles.card}>
                  <CardHeader title={relation.name}/>
                  <CardContent>
                    <div>
                      <strong>Name:
                      </strong>
                      {relation.name}
                    </div>
                    {relation.description && <div>
                      <strong>Description:
                      </strong>
                      {relation.description}
                    </div>}
                    {relation.stats && <div>
                      <strong>Stats:
                      </strong>
                      {_.map(this.stats, (value, key) => (
                        <div
                          key={key}
                          style={{
                          marginLeft: 10
                        }}>{key}: {value}</div>
                      ))}
                    </div>}
                    <div style={{
                      textAlign: "center"
                    }}>
                      <Button
                        style={styles.button}
                        value={relation._id}
                        variant='raised'
                        color='primary'
                        onClick={action(() => {
                          this.selected = { relationId: relation._id }
                        })}>Map Data</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}

        </div>

        <Map selected={this.selected}/>

      </div>
    );
  }
});
const styles = {
  button: {
    margin: "auto",
    marginTop: "10px",
    width: '50%'
  },
  card: {
    margin: "10px"
  },
}

export default Maps;