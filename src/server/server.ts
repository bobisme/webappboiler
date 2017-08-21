import * as fs from 'fs'
import * as http from 'http'
import * as path from 'path'

import * as finalhandler from 'finalhandler'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import * as staticServer from 'serve-static'

// import App from '../App'

const PORT = 3002

const log = (...args) => { process.stdout.write(args.toString() + '\n') }

let indexHtml = fs.readFileSync(path.join(__dirname, 'index.html')).toString()

function handlePage(req, res) {
  // let reactHtml = ReactDOMServer.renderToString(App())
  let reactHtml = ReactDOMServer.renderToString(React.createElement('div'))
  let pageHtml = fs.readFileSync(
    path.resolve(__dirname, 'index.html')).toString()
  pageHtml = indexHtml.replace(
    '<div id="app">', `<div id="app">${reactHtml}`)

  res.setHeader('Content-Type', 'text/html')
  res.end(pageHtml)
}

let statics = staticServer(__dirname)

http.createServer((req, res) => {
  if (req.url === '/') {
    handlePage(req, res)
  } else if (req.url.match(/\.(css|js|svg|png|jpg|map|ico)$/i)) {
    let done = finalhandler(req, res)
    statics(req, res, done)
  } else {
    res.setHeader('Content-Type', 'text/plain')
    res.statusCode = 404
    res.end('Not Found')
  }

  log(`${req.method} ${req.url} ${res.statusCode}`)
}).listen(PORT, () => {
  log(`Listening on ${PORT}...`)
})
