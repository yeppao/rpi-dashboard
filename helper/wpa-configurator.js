const fs = require('fs');
const hostapd = require('wireless-tools/hostapd');
const wpa_supplicant = require('wireless-tools/wpa_supplicant');
const dhcpcd = require('./dhcpcd');
const wpaSupplicant = require('./helper/wpa-supplicant');
const wpa_cli = require('wireless-tools/wpa_cli');

let config;

async function getConfiguration() {
    return new Promise((resolve, reject) => {
        fs.readFile('./config.json', (err, data) => {
            if (err) throw err;
            config = JSON.parse(data);
            resolve(config);
        });
    });
}

async function setConfiguration(configuration) {
    return new Promise((resolve, reject) => {
        fs.writeFile('./config.json', JSON.stringify(configuration), (err, data) => {
            config = configuration;
            resolve(configuration);
        });
    });
}

async function init() {
    return new Promise((resolve, reject) => {
        if (config.mode === 'hotspot') {
            if (config.services.hostapd.enabled) {
                hostapd.enable(config.services.hostapd.options, (err) => {
                    dhcpcd.enable(config.services.dhcpcd.options, (err) => {
                        resolve({ success: true });
                    });
                });
            }
        } else if (config.mode === 'client') {
            wpaSupplicant.enable((err) => {
                if (config.networkId) {
                    wpa_cli.select_network('wlan0', config.networkId, () => console.log('network selected'));
                }
                resolve({ success: true });
            });
        }
    });
}

const wpaConfigurator = module.exports = {
    getConfiguration: getConfiguration,
    setConfiguration: setConfiguration,
    init: init
};