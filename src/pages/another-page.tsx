import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { match as RouteMatch, Route } from 'react-router-dom'

import { Nav } from 'components/Nav'
import Page from 'components/Page'
import { mount } from 'lib/page-mounter'
import * as css from './index.css'

const matcher = x => x.match(/^\/another-page\/(\w+\/?)?$/) != null

interface SelectionProps {
  id?: string
}

const Selection: React.SFC<SelectionProps> = ({ id }) => {
  if (id == null) { return null }
  return <strong>You have selected {id}.</strong>
}

interface InsideProps {
  match?: RouteMatch<{ id: string }>
}

const Inside: React.SFC<InsideProps> = ({ match }) => (
  <div>
    <h1 className={css.header}>This is a different single-page app.</h1>
    <Selection id={match.params.id} />
  </div>
)

const AnotherPage: React.SFC<{}> = mount(module)(() => (
  <Page>
    <Nav isInternal={matcher} />
    <Route exact path="/another-page/" component={Inside} />
    <Route path="/another-page/:id" component={Inside} />
  </Page>
))

export default AnotherPage
