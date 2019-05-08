const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const wpa_cli = require('wireless-tools/wpa_cli');
const wpa_supplicant = require('wireless-tools/wpa_supplicant');
const wpaSupplicantHelper = require('./helper/wpa-supplicant');
const hostapd = require('wireless-tools/hostapd');

const config = require('dotenv').config().parsed;

app
  .prepare()
  .then(async () => {
    const server = express();
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));
    const wpaSupplicantConfig = await wpaSupplicantHelper.parseFile(config.WPA_SUPPLICANT_PATH);



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
      res.json(wpaSupplicantConfig);
    })

    server.post('/api/wlan/connect', (req, res) => {
      const body = req.body;

      wpa_supplicant.disable('wlan0', (err) => {
        var options = {
          interface: 'wlan0',
          ssid: body.network.ssid,
          passphrase: body.passphrase,
          driver: 'nl80211'
        };

        wpa_supplicant.enable(options, (err) => {
          res.json({ success: true });
        });
      });
    })

    server.get('/api/wlan/scan', (req, res) => {
      wpa_cli.scan('wlan0', (err, data) => {
        wpa_cli.scan_results('wlan0', (err, data) => {
          res.json(data);
        })
      });
    })

    server.get('/api/wlan/status', (req, res) => {
      wpa_cli.status('wlan0', function (err, status) {
        res.json(status);
      });
    });

    server.get('/api/hostapd/config', (req, res) => {
      hostapd.disable('wlan0', () => {
        const options = {
          interface: 'wlan0',
          driver: 'nl80211',
          ssid: 'NadiaSuite',
          hw_mode: 'g',
          channel: 7,
          wmm_enabled: 0,
          macaddr_acl: 0,
          auth_algs: 1,
          ignore_broadcast_ssid: 0,
          wpa: 2,
          wpa_passphrase: 'YouNeedToChangeNadia',
          wpa_key_mgmt: 'WPA-PSK',
          wpa_pairwise: 'TKIP',
          rsn_pairwise: 'CCMP'
        };

        hostapd.enable(options, () => {
          res.json({ success: true });
        });
      });
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(3000, err => {
      if (err) throw err
      console.log(`> Ready on ${config.APP_HOST}`)
    })
  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })