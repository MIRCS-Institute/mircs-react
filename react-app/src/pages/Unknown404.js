import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import { Path } from '../app/App'
import PageSkeleton from '../components/PageSkeleton'
import React from 'react'
import Typography from '@material-ui/core/Typography'

const Unknown404 = observer(class extends React.Component {
  render() {
    return (
      <PageSkeleton>
        <Typography variant='h6'>Page Not Found</Typography>
        <Typography>
          Unknown URL: if this is a broken link please inform the referrer.
        </Typography>
        <ul>
          <li><Link to={Path.home()}>Return to known ground</Link></li>
        </ul>
      </PageSkeleton>
    )
  }
})

export default Unknown404
