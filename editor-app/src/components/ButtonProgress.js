import React from 'react'
import { CircularProgress } from 'material-ui/Progress'

const ButtonProgress = () => (
  <CircularProgress size={24} style={styles.buttonProgress}/>
);

const styles = {
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
};

export default ButtonProgress;