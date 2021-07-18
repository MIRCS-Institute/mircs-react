import {observer} from 'mobx-react'
import _ from 'lodash'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Package from '../../../package.json'
import PageSkeleton from '../../components/PageSkeleton'
import React from 'react'
import Typography from '@material-ui/core/Typography'

const Acknowledgements = observer(class extends React.Component {
  render() {
    return (
      <PageSkeleton title='Acknowledgements'>
        <Typography>
          MIRCS is grateful to the makers of these libraries and their dependent projects:
        </Typography>

        <List component='nav'>
          {_.keys(Package.dependencies).map((dependency) =>
            <ListItem
              key={dependency}
              button
              component='a'
              target='_blank'
              href={`https://www.npmjs.com/package/${dependency}`}
            >
              <ListItemText primary={dependency}/>
            </ListItem>
          )}
        </List>

        <Divider/>
        <center>
          <Typography>
            Version: {Package.version}
          </Typography>
        </center>
      </PageSkeleton>
    )
  }
})

export default Acknowledgements
