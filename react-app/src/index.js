import * as mobx from 'mobx'
import App from './app/App'
import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'

mobx.useStrict(true)

ReactDOM.render(<App/>, document.getElementById('root'))

// disable the service worker for the time being - it adds cache complexity that can make it occasionally hard to debug
// import registerServiceWorker from './registerServiceWorker';
// registerServiceWorker()
