import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

const ROOT_ELEMENT_ID = 'app'

function getAppElement(id = ROOT_ELEMENT_ID) {
  let element = document.getElementById(id)
  if (element == null) {
    element = document.createElement(id)
    element.id = id
    document.body.appendChild(element)
  }
  return element
}

function render(Component, element) {
  ReactDOM.render(
    <BrowserRouter>
      <Component />
    </BrowserRouter>,
    element,
  )
}

export function mountPage(pageModule, Component, id = ROOT_ELEMENT_ID) {
  // If there is no document, we're in node, so just pass through.
  if (typeof document === 'undefined') { return Component }

  render(Component, getAppElement(id))

  if (pageModule.hot) {
    pageModule.hot.accept()
    render(Component, getAppElement(id))
  }

  return Component
}

// example:
//   @mount(module)
//   export default class Home extends React.Component {
//     ...
export function mount(pageModule, id: string = ROOT_ELEMENT_ID) {
  return component => mountPage(pageModule, component, id)
}
