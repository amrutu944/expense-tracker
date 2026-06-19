const fs = require('fs')
const http = require('http')
const path = require('path')

const root = path.join(__dirname, 'dist')
const port = Number(process.env.PORT || 5173)

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0])
  const requestedPath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '')
  const filePath = path.join(root, urlPath === '/' ? 'index.html' : requestedPath)
  const resolvedPath = filePath.startsWith(root) && fs.existsSync(filePath)
    ? filePath
    : path.join(root, 'index.html')

  fs.readFile(resolvedPath, (error, content) => {
    if (error) {
      res.writeHead(500)
      res.end('Unable to read frontend build.')
      return
    }

    res.writeHead(200, {
      'Content-Type': contentTypes[path.extname(resolvedPath)] || 'application/octet-stream',
    })
    res.end(content)
  })
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Frontend running at http://127.0.0.1:${port}/`)
})
