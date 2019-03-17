import { action, autorun, extendObservable, toJS } from 'mobx'
import { observer } from 'mobx-react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

// Provides a safe copy of the `data` attribute to the wrapped component.
const copyDataPropHOC = (
  WrappedComponent,
  {
    // allows the caller to manipulate the copy before it reaches the wrapped component,
    // for example to ensure it is of the correct shape for use in the component
    processCopy = (copy) => copy,
    // if data is not specified this will be used to construct the data passed to the wrapped component
    defaultValue = {},
  }
) => {
  const getDataCopy = (props) => {
    const data = toJS(props.data || defaultValue)
    const dataCopy = _.cloneDeep(data)
    processCopy(dataCopy)
    return dataCopy
  }

  return observer(class extends React.Component {
    static propTypes = {
      data: PropTypes.object,
    }

    constructor() {
      super()
      extendObservable(this, {
        data: defaultValue,
      })
    }

    componentDidMount() {
      this.unwatch = autorun(() => {
        const dataCopy = getDataCopy(this.props)
        action(() => {
          this.data = dataCopy
        })()
      })
    }

    componentWillUnmount() {
      this.unwatch()
    }

    componentDidUpdate(prevProps) {
      if (this.props.data && !prevProps.data) {
        action(() => {
          this.data = getDataCopy(this.props)
        })()
      }
    }

    render() {
      // eslint-disable-next-line no-unused-vars
      const { data, ...otherProps } = this.props
      return <WrappedComponent {...otherProps} data={this.data}/>
    }
  })
}

export default copyDataPropHOC
