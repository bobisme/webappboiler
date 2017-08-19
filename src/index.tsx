import * as React from 'react'
import * as ReactDOM from 'react-dom'

// import * as css from './index.css'
import App from './App'

let app = document.createElement('app')
app.id = 'app'
document.body.appendChild(app)
ReactDOM.render(<App />, app)

if (module.hot) {
  module.hot.accept('./App.tsx', () => {
    const NextRootContainer = require('./App.tsx').default
    ReactDOM.render(<NextRootContainer />, document.getElementById('app'))
  })
}
