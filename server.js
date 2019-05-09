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

      if (body.network.id) {
        async () => {
          await new Promise((resolve, reject) => {
            wpa_cli.remove_network('wlan0', body.network.id, (err, data) => {
              wpa_cli.save_config('wlan0', (err, data) => {
                resolve(data);
                console.log('remove and save', data);
              });
            });
          });          
        }        
      }
      const command = `wpa_passphrase "${body.network.ssid}" "${body.passphrase}" >> ${config.WPA_SUPPLICANT_PATH} && wpa_cli -i wlan0 reconfigure`;
      child_process.exec(command, (err, stdout) => {
        console.log(err, stdout);
        wpaCli.list_networks('wlan0', (err, wpaNetworks) => {
          console.log(wpaNetworks, body);
          const network = wpaNetworks.find((wpaNetwork) => wpaNetwork.ssid === body.network.ssid);
          console.log(network);
          wpa_cli.select_network('wlan0', network.id, (err, data) => {
            res.json({ success: true });
          });
        })
      });
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

    server.listen(3000, err => {
      if (err) throw err
      console.log(`> Ready on ${config.APP_HOST}`)
    })
  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })