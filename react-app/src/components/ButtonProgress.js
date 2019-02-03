import CircularProgress from '@material-ui/core/CircularProgress'
import React from 'react'

const ButtonProgress = () => (
  <CircularProgress size={24} style={styles.buttonProgress}/>
)

const styles = {
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}

export default ButtonProgress
