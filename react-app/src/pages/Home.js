import {action, extendObservable} from 'mobx'
import { goToPath, Path } from '../app/App'
import {observer} from 'mobx-react'
import { showSnackbarMessage } from '../components/SnackbarMessages'
import _ from 'lodash'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Grid from '@material-ui/core/Grid'
import PageSkeleton from '../components/PageSkeleton'
import React from 'react'
import ServerHttpApi from '../api/net/ServerHttpApi'
import Typography from '@material-ui/core/Typography'

const Home = observer(class extends React.Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      dataSets: [],
      relationships: [],
      selected: {},
    })
  }

  componentDidMount() {
    this.fetchDataSetRecords()
    this.fetchRelationshipRecords()
  }

  fetchDataSetRecords = action(() => {
    ServerHttpApi.jsonGet('/api/datasets')
      .then(action((response) => {
        this.dataSets = _.get(response, 'bodyJson.list')
      }))
      .catch(showSnackbarMessage)
  })

  fetchRelationshipRecords = action(() => {
    ServerHttpApi.jsonGet('/api/relationships')
      .then(action((response) => {
        this.relationships = _.get(response, 'bodyJson.list')
      }))
      .catch(showSnackbarMessage)
  })

  render() {
    return (<PageSkeleton>
      <Grid container spacing={16}>
        {this.dataSets.map((dataSet) => (
          <Grid key={dataSet._id} item xs={6} md={4}>
            <Card style={styles.card}>
              <CardContent>
                <Typography gutterBottom variant='headline'>
                  {dataSet.name}
                </Typography>
                {dataSet.description && <Typography>
                  {dataSet.description}
                </Typography>}
                <div style={{
                  textAlign: 'center',
                }}>
                  <Button
                    style={styles.button}
                    value={dataSet._id}
                    variant='contained'
                    color='primary'
                    onClick={() => goToPath(Path.dataSetMap({ dataSetId: dataSet._id }))}
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
                  textAlign: 'center',
                }}>
                  <Button
                    style={styles.button}
                    variant='contained'
                    color='primary'
                    onClick={() => goToPath(Path.relationshipMap({ relationshipId: relation._id }))}
                  >
                    Map
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageSkeleton>)
  }
})

const styles = {
  button: {
    margin: 'auto',
    marginTop: '10px',
    width: '50%',
  },
  card: {
    margin: '10px',
  },
}

export default Home
