import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { /* mount */ mountPage } from '../page-mounter'
import * as css from './index.css'

import Page from 'components/Page'

const Home = () => (
  <Page>
    <h1 className={css.header}>Hi there!</h1>
  </Page>
)

const App = () => (
  <Router>
    <Route exact path="/" component={Home} />
  </Router>
)

mountPage(module, App)
