import {observer} from 'mobx-react'
import Layout from 'utils/Layout'
import Map from 'components/Map'
import PropTypes from 'prop-types'
import React from 'react'

const RelationshipMap = observer(class extends React.Component {
  static propTypes = {
    relationshipId: PropTypes.string.isRequired,
  }

  render() {
    return (
      <div style={{ ...Layout.absoluteFill, ...Layout.row }}>
        <Map selected={{ relationshipId: this.props.relationshipId }}/>
      </div>
    )
  }
})

export default RelationshipMap
