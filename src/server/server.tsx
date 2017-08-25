import * as express from 'express'
import * as fs from 'fs'
import * as http from 'http'
import * as path from 'path'

import * as finalhandler from 'finalhandler'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router'
import * as serveStatic from 'serve-static'

import AnotherPage from 'pages/another-page'
import Index from 'pages/index'

const e = React.createElement

const routes: Array<[string, React.ComponentType]> = [
  ['/another-page/', AnotherPage],
  ['/', Index],
]

const PORT = 3002

function log(...args) { process.stderr.write(args.join(' ') + '\n') }

const app = express()
const server = http.createServer(app)

function handlePage(urlPath, Page) {
  let indexHtml = fs.readFileSync(
    path.join(__dirname, urlPath, 'index.html')).toString()

  app.get(urlPath + '*', (req, res) => {
    let reactHtml = ReactDOMServer.renderToString(
      <StaticRouter location={req.url}>
        <Page />
      </StaticRouter>)
    let pageHtml = indexHtml.replace(
      '<body>', `<body><div id="app">${reactHtml}`)

    res.setHeader('Content-Type', 'text/html')
    res.end(pageHtml)
  })
}

app.get('*', express.static(__dirname))

routes.forEach(route => {
  let [urlPath, component] = route
  handlePage(urlPath, component)
})

//   if (req.url.match(/\.(css|js|svg|png|jpg|map|ico)$/i)) {
//     let done = finalhandler()
//     statics(req, res, done)
//   } else {
//     res.setHeader('Content-Type', 'text/plain')
//     res.statusCode = 404
//     res.end('Not Found')
//   }
//
//   log(`${req.method} ${req.url} ${res.statusCode}`)
// })

app.listen(PORT, () => {
  log(`Listening on ${PORT}...`)
})
