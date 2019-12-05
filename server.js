const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const child_process = require('child_process');
const wpaConfigurator = require('./helper/wpa-configurator');
const wpaSupplicant = require('./helper/wpa-supplicant');
const wpa_cli = require('wireless-tools/wpa_cli');
const wpaCli = require('./helper/wpa-cli');
const globalConfig = require('dotenv').config().parsed;
let networks = require('./data/networks');

app
  .prepare()
  .then(async () => {
    const server = express();
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));
    const wpaSupplicantConfig = await wpaSupplicant.parseFile(globalConfig.WPA_SUPPLICANT_PATH);
    const wpaConfig = await wpaConfigurator.getConfiguration();
    console.log('wpaConfig', wpaConfig);
    await wpaConfigurator.proceed(true);

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

    server.get('/api/wlan/config', (req, res) => {
      res.json({ config: wpaConfig, wpaSupplicantConfig: wpaSupplicantConfig });
    })

    server.post('/api/wlan/config', async (req, res) => {
      const config = req.body;
      wpaConfigurator.setConfiguration(config);
      networks.currentNetwork = config.network;
      wpaConfigurator.proceed().then(() => res.json({ success: true }));
    });

    server.post('/api/wlan/connect', (req, res) => {
      const body = req.body;
      wpaConfigurator.connect(body);
      res.json({ success: true });
    })

    server.get('/api/wlan/scan', async (req, res) => {
      await wpaCli.scan_networks('wlan0');
      res.json(networks.scanResults);      
    })

    server.get('/api/wlan/status', (req, res) => {
      wpa_cli.status('wlan0', function (err, status) {
        res.json(status);
      });
    });    

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(3000, err => {
      if (err) throw err
      console.log(`> Ready on localhost:3000`);
    })
  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })