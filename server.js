const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const child_process = require('child_process');
const wpa_cli = require('wireless-tools/wpa_cli');
const wpaCli = require('./helper/wpa-cli');
const wpa_supplicant = require('wireless-tools/wpa_supplicant');
const hostapd = require('wireless-tools/hostapd');
const ifconfig = require('wireless-tools/ifconfig');
const wpaConfigurator = require('./helper/wpa-configurator');
const wpaSupplicant = require('./helper/wpa-supplicant');

const globalConfig = require('dotenv').config().parsed;

app
  .prepare()
  .then(async () => {
    const server = express();
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));
    const wpaSupplicantConfig = await wpaSupplicant.parseFile(globalConfig.WPA_SUPPLICANT_PATH);
    const wpaConfig = await wpaConfigurator.getConfiguration();
    wpaConfigurator.init();

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
      wpaConfigurator.connect(body);
      res.json({ success: true });
    })

    server.get('/api/wlan/scan', (req, res) => {
      wpa_cli.scan('wlan0', (err, data) => {
        wpa_cli.scan_results('wlan0', (err, data) => {
          wpaCli.list_networks('wlan0', (err, wpaNetworks) => {
            data = data.map((network) => {
              const actualNetwork = wpaNetworks.find((wpaNetwork) => wpaNetwork.ssid === network.ssid);
              if (actualNetwork) {
                wpaNetworks.splice(wpaNetworks.indexOf(actualNetwork), 1);
                return { ...actualNetwork, ...network };
              }

              return network;
            });

            data = [...data, ...wpaNetworks];
            res.json(data);
          });
        });
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

    let interfaceStatus = await wpaConfigurator.getInterfaceStatus('wlan0');
    process.env.APP_HOST = `http://${interfaceStatus.ipv4_address}:3000`;
    server.listen(3000, err => {
      if (err) throw err
      console.log(`> Ready on ${process.env.APP_HOST}`);
    })
  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })