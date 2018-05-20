import _ from 'lodash'
import {action, extendObservable} from 'mobx'
import {observer} from 'mobx-react'
import Button from 'material-ui/Button'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Card, {CardContent, CardHeader} from 'material-ui/Card'
import http from 'utils/http'
import React from 'react'

const Home = observer(class extends React.Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      dataSets: [],
      relationships: [],
      selected: {},
      error: null,
    })
  }

  componentDidMount() {
    this.fetchDataSetRecords()
    this.fetchRelationshipRecords()
  }

  fetchDataSetRecords = action(() => {
    http.jsonRequest('/api/datasets')
      .then(action((response) => {
        this.dataSets = _.get(response, 'bodyJson.list')
      }))
      .catch(action((error) => {
        this.error = error
      }))
  })

  fetchRelationshipRecords = action(() => {
    http.jsonRequest('/api/relationships')
      .then(action((response) => {
        this.relationships = _.get(response, 'bodyJson.list')
      }))
      .catch(action((error) => {
        this.error = error
      }))
  })

  render() {
    return (
      <Grid container spacing={16}>
        {this.dataSets.map((dataSet) => (
          <Grid key={dataSet._id} item xs={6} md={4}>
            <Card style={styles.card}>
              <CardContent>
                <Typography gutterBottom variant="headline">
                  {dataSet.name}
                </Typography>
                {dataSet.description && <Typography>
                  {dataSet.description}
                </Typography>}
                <div style={{
                  textAlign: "center"
                }}>
                <Button
                  style={styles.button}
                  value={dataSet._id}
                  variant='raised'
                  color='primary'
                  href={`#/datasets/${dataSet._id}/map`}
                >
                  Map
                </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {this.relationships.map((relation) => (
          <Grid key={relation._id} item xs={6} md={4}>
            <Card style={styles.card}>
              <CardHeader title={relation.name}/>
              <CardContent>
                {relation.description && <div>
                  {relation.description}
                </div>}
                <div style={{
                  textAlign: "center"
                }}>
                  <Button
                    style={styles.button}
                    variant='raised'
                    color='primary'
                    href={`#/relationships/${relation._id}/map`}
                  >
                    Map
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
  }
})

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

export default Home
