import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { /* mount */ mountPage } from 'lib/page-mounter'
import * as css from './index.css'

import { Nav } from 'components/Nav'
import Page from 'components/Page'

const homeMatcher = x => x === '/'

const Home = () => (
  <div>
    <Page>
      <Nav isInternal={homeMatcher} />
      <Route exact path="/">
        <div>
          <h1 className={css.header}>Single page app!</h1>
        </div>
      </Route>
    </Page>
  </div>
)

export default Home

mountPage(module, Home)
