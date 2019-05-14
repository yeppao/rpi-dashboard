const fs = require('fs');
const hostapd = require('wireless-tools/hostapd');
const wpa_supplicant = require('wireless-tools/wpa_supplicant');
const dhcpcd = require('./dhcpcd');
const wpaSupplicant = require('./wpa-supplicant');
const wpa_cli = require('wireless-tools/wpa_cli');
const ifconfig = require('wireless-tools/ifconfig');

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
                joinNetwork(config);
                resolve({ success: true });
            });
        }
    });
}

async function removeNetwork(requestBody, save = true) {
    return new Promise((resolve, reject) => {
        wpa_cli.remove_network('wlan0', requestBody.network.id, (err, data) => {
            if (save) {
                wpa_cli.save_config('wlan0', (err, data) => {
                    resolve(data);
                    console.log('remove and save', data);
                });
            }

            resolve(data);
        });
    });
}

async function joinNetwork(requestBody) {
    return new Promise((resolve, reject) => {
        const command = `wpa_passphrase "${requestBody.network.ssid}" "${requestBody.network.passphrase}" >> ${config.WPA_SUPPLICANT_PATH} && wpa_cli -i wlan0 reconfigure`;
        child_process.exec(command, (err, stdout) => {
            wpaCli.list_networks('wlan0', (err, wpaNetworks) => {
                const network = wpaNetworks.find((wpaNetwork) => wpaNetwork.ssid === requestBody.network.ssid);
                wpa_cli.select_network('wlan0', network.id, (err, data) => {
                    network.passphrase = requestBody.passphrase;
                    wpaConfig.network = network;
                    wpaConfigurator.setConfiguration(wpaConfig);
                    resolve(data);
                });
            })
        });
    });
}

async function getInterfaceStatus(interface) {
    return new Promise((resolve, reject) => {
        ifconfig.status(interface, (err, status) => {
            resolve(status);
        });
    });
}

async function connect(requestBody) {
    if (requestBody.network.id) {
        await removeNetwork(requestBody);
    }
    await joinNetwork(requestBody);
}

const wpaConfigurator = module.exports = {
    getConfiguration: getConfiguration,
    setConfiguration: setConfiguration,
    getInterfaceStatus: getInterfaceStatus,
    joinNetwork: joinNetwork,
    init: init,
    connect: connect
};