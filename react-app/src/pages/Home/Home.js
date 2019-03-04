import { getDataSetsRes } from '../../api/DataSets'
import { getViewsRes } from '../../api/Views'
import { NavLink } from 'react-router-dom'
import {observer} from 'mobx-react'
import { Path } from '../../app/App'
import DataSetCard from './DataSetCard'
import Layout from '../../utils/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'
import MircsLogo from '../../resources/mircs_logo-blue_plus_with_web_yellow.jpg'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import ViewCard from './ViewCard'

const Home = observer(class extends React.Component {
  render() {
    const viewsResource = getViewsRes()
    const isLoading = viewsResource.isLoading()
    const views = viewsResource.get('list', [])

    return <div style={{ ...Layout.column, ...Layout.align('start', 'center') }}>
      <div style={{
        ...Layout.column,
        ...Layout.align('center', 'center'),
        maxWidth: 800,
      }}>
        <div style={{ marginTop: 24 }}>
          <img alt='MIRCS Logo' src={MircsLogo}/>
        </div>

        <Typography variant='h3' style={{ textAlign: 'center', maxWidth: 600, marginTop: 12, marginBottom: 36 }}>
          MIRCS Geo-Genealogy Prototype
        </Typography>

        {isLoading && <LoadingSpinner title='Loading...' />}

        <div style={{ ...Layout.row, ...Layout.align('center'), flexWrap: 'wrap' }}>
          {views.map((view) => (
            <ViewCard key={view._id} view={view}/>
          ))}
          {(!isLoading) && views.length === 0 && <AllDataSets/>}
        </div>

        <Typography variant='headline' style={{ marginTop: 48, marginBottom: 6 }}>
          Links
        </Typography>
        <div style={{ ...Layout.row, ...Layout.align('space-evenly'), alignSelf: 'normal' }}>
          <div style={linkColumnStyle}>
            <a href='https://www.mircs.ca' target='blank' style={linkStyle}>
              MIRCS
            </a>
            <a href='https://www.mircs.ca/geo-genealogy/' style={linkStyle}>
              Geo-Genealogy
            </a>
          </div>
          <div style={linkColumnStyle}>
            <NavLink to={Path.manageRoot()} style={linkStyle}>Manage</NavLink>
          </div>
        </div>
      </div>
    </div>
  }
})

const linkColumnStyle = {
  ...Layout.column,
}

const linkStyle = {
  textDecoration: 'none',
  color: '#4B6C96',
  fontWeight: 400,
}

const AllDataSets = observer(() => {
  const dataSets = getDataSetsRes().get('list', [])

  console.log('dataSets', dataSets)

  return <React.Fragment>
    {dataSets.map((dataSet) => (
      <DataSetCard key={dataSet._id} dataSet={dataSet}/>
    ))}
  </React.Fragment>
})

export default Home
