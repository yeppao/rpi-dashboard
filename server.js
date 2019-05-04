const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const wpa_cli = require('wireless-tools/wpa_cli');

app
  .prepare()
  .then(() => {
    const server = express()

    server.get('/docker/:id', (req, res) => {
        const actualPage = '/docker'
        const queryParams = { title: req.params.id }
        app.render(req, res, actualPage, queryParams)
    });

    server.get('/docker', (req, res) => {
        const actualPage = '/docker'
        const queryParams = { title: req.params.id }
        app.render(req, res, actualPage, queryParams)
    });

    server.get('/api/scan', (req, res) => {
        wpa_cli.scan('wlan0', function(err, data){
            wpa_cli.scan_results('wlan0', function(err, data) {
               // returns the results of the BSS scan once it completes
               res.json(data);
            })
        });
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(3000, err => {
      if (err) throw err
      console.log('> Ready on http://localhost:3000')
    })
  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })