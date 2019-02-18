import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import React from 'react'

/** styled wrapper around an <input> of type file */
const FileButton = observer(class extends React.Component {
  static propTypes = {
    accept: PropTypes.string,
    multiple: PropTypes.bool,
    onFilesSelected: PropTypes.func.isRequired,
  }

  constructor() {
    super()
    extendObservable(this, {
      hasInput: true,
    })
    this.inputRef = React.createRef()
  }

  handleClick = (event) => {
    event.preventDefault()
    this.inputRef.current && this.inputRef.current.click()
  }

  handleInputChange = action((event) => {
    // briefly hide the input to reset the FileList, allowing a change event to occur when
    // selecting the same file consecutively
    this.hasInput = false

    const files = event.target.files
    this.props.onFilesSelected(files)
  })

  render() {
    const {
      // eslint-disable-next-line no-unused-vars
      onFilesSelected,

      accept,
      multiple,

      ...buttonProps
    } = this.props

    if (!this.hasInput) {
      // asynchronously re-add the input field on next tick
      setTimeout(action(() => {
        this.hasInput = true
      }), 0)
    }

    return <React.Fragment>
      <Button {...buttonProps} onClick={this.handleClick}/>
      <input
        onChange={this.handleInputChange}
        ref={this.inputRef}
        accept={accept}
        multiple={multiple}
        style={{display: 'none'}}
        type='file'
      />
    </React.Fragment>
  }
})

export default FileButton
