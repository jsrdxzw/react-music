import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {Provider} from 'mobx-react'
import stores from './stores'
import {HashRouter as Router} from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(<Provider {...stores}><Router><App/></Router></Provider>, document.getElementById('root'))
registerServiceWorker()
