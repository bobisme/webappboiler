import * as React from 'react'
import * as ReactDOM from 'react-dom'

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

export function mountPage(pageModule, component, id = ROOT_ELEMENT_ID) {
  let element = getAppElement(id)
  ReactDOM.render(React.createElement(component, {}), element)

  if (pageModule.hot) {
    pageModule.hot.accept()
    ReactDOM.render(
      React.createElement(component, {}),
      document.getElementById(id))
  }

  return component
}

// example:
//   @mount(module)
//   export default class Home extends React.Component {
//     ...
export function mount(pageModule, id: string = ROOT_ELEMENT_ID) {
  return component => {
    return mountPage(pageModule, component, id)
  }
}
