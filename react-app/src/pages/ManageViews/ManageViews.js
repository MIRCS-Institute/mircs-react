import { action, extendObservable } from 'mobx'
import { getViewsRes } from '../../api/Views'
import { observer } from 'mobx-react'
import Button from '@material-ui/core/Button'
import EditViewDialog from './EditViewDialog'
import LoadingSpinner from '../../components/LoadingSpinner'
import ManageViewCard from './ManageViewCard'
import PageSkeleton from '../../components/PageSkeleton'
import React from 'react'

const ManageViews = observer(class extends React.Component {
  constructor() {
    super()
    extendObservable(this, {
      showCreateDialog: false,
    })
  }

  handleCreateClick = action(() => {
    this.showCreateDialog = true
  })

  handleCreateCancel = action(() => {
    this.showCreateDialog = false
  })

  handleCreateAfterSave = action(() => {
    this.showCreateDialog = false
    getViewsRes().refresh()
  })

  render() {
    const resource = getViewsRes()
    const isLoading = resource.isLoading()
    const views = resource.get('list', [])

    return (<PageSkeleton title='Views'>
      <div style={{ marginTop: 10 }}>
        <Button variant='contained' color='primary' onClick={this.handleCreateClick}>
          Create a View
        </Button>

        {isLoading && <LoadingSpinner title='Loading Views...' />}

        <EditViewDialog
          open={this.showCreateDialog}
          onCancel={this.handleCreateCancel}
          afterSave={this.handleCreateAfterSave}
        />

        {views.map((view) => (
          <ManageViewCard key={view._id} view={view}/>
        ))}
      </div>
    </PageSkeleton>)
  }
})

export default ManageViews
