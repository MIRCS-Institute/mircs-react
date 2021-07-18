import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import { slice } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { Button } from '@material-ui/core'
import Layout from '../utils/Layout'

const PAGE_SIZE = 25

const PageControl = observer(class extends React.Component {
  static propTypes = {
    pageSize: PropTypes.number,
    items: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]).isRequired,
    renderItem: PropTypes.func.isRequired,
  }

  constructor() {
    super()
    extendObservable(this, {
      maxItems: PAGE_SIZE,
    })
  }

  componentDidMount() {
    action(() => {
      this.maxItems = this.props.pageSize || PAGE_SIZE
    })()
  }

  render() {
    const hasMore = this.maxItems < this.props.items.length

    return (<>
      {slice(this.props.items, 0, this.maxItems).map(this.props.renderItem)}
      {hasMore &&
        <div style={{ ...Layout.column, ...Layout.align('start', 'center') }}>
          <div>
            Showing {this.maxItems} of {this.props.items.length}
          </div>
          <div>
            <Button onClick={action(() => this.maxItems += this.props.pageSize || PAGE_SIZE)}>Load More</Button>
          </div>
        </div>
      }
    </>)
  }
})

export default PageControl
