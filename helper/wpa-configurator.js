const fs = require('fs');
const hostapd = require('wireless-tools/hostapd');
const wpa_supplicant = require('wireless-tools/wpa_supplicant');
const dhcpcd = require('./dhcpcd');
const wpaSupplicant = require('./wpa-supplicant');
const wpa_cli = require('wireless-tools/wpa_cli');
const ifconfig = require('./ifconfig');
const wpaCli = require('./wpa-cli');
const child_process = require('child_process');
let networks = require('../data/networks');

let config;

function getConfiguration() {
    return new Promise((resolve, reject) => {
        fs.readFile('./config.json', (err, data) => {
            if (err) throw err;
            config = JSON.parse(data);
            resolve(config);
        });
    });
}

function setConfiguration(configuration) {
    return new Promise((resolve, reject) => {
        fs.writeFile('./config.json', JSON.stringify(configuration), (err, data) => {
            config = configuration;
            resolve(configuration);
        });
    });
}


async function detectCurrentNetwork() {
    return new Promise((resolve) => {
        console.log(networks);
        networks.currentNetwork = networks.scanResults.find(scanResult => scanResult.id);

        if (!networks.currentNetwork) {
            networks.currentNetwork = { id: 0 };
        }

        resolve({ success: true });
    });
}

async function proceed(isInit) {
    if (!isInit) {
        await addNetwork(networks.currentNetwork);
    }
    await wpaCli.list_networks_p('wlan0');
    await wpaCli.scan_networks('wlan0');

    if (isInit) {
        await detectCurrentNetwork();
    }

    await selectNetwork('wlan0');
    await renewIp('wlan0');

    return { success: true };
}

function removeNetwork(requestBody, save = true) {
    return new Promise((resolve, reject) => {
        wpa_cli.remove_network('wlan0', requestBody.network.id, (err, data) => {
            if (save) {
                wpa_cli.save_config('wlan0', (err, data) => {
                    resolve(data);
                });
            }

            resolve(data);
        });
    });
}

async function isCurrent(interface, networkParams) {
    const wpaNetworks = await listNetworks(interface);
    const currentNetwork = wpaNetworks.find((network) => console.log(network) && network.isCurrent === true);

    if (currentNetwork) {
        return true;
    }

    return false;
}

function listNetworks(networkInterface) {
    return new Promise((resolve, reject) => {
        wpaCli.list_networks(networkInterface, (err, wpaNetworks) => {
            resolve(wpaNetworks);
        });
    });
}

function addNetwork(network) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!network.id || network.passphrase) {
                const command = `wpa_passphrase "${network.ssid}" "${network.passphrase}" >> ${process.env.WPA_SUPPLICANT_PATH} && wpa_cli -i wlan0 reconfigure`;
                if (network.id && network.passphrase) {
                    const command = `wpa_cli -i wlan0 set_network ${network.id} psk "${network.passphrase}"`;
                }
                child_process.exec(command, (err, stdout) => {
                    resolve({ success: true });
                });
            }
        } catch(error) { }
    });    
}

function getExistingNetworkInfo(network) {
    return new Promise((resolve, reject) => {
        wpaCli.list_networks('wlan0', (err, wpaNetworks) => {
            console.log('existing', network, wpaNetworks);
            const currentNetwork = wpaNetworks.find(wpaNetwork => wpaNetwork.ssid == network.ssid);
            resolve(currentNetwork);
        });
    });
}

function joinNetwork(requestBody) {
    return new Promise(async (resolve, reject) => {
        try {
            const currentNetwork = await getExistingNetworkInfo('wlan0', requestBody.network);
            if (!currentNetwork) {
                await addNetwork(requestBody);
            }        

            const wpaNetworks = await wpaCli.list_networks_p('wlan0');
            const network = wpaNetworks.find((wpaNetwork) => wpaNetwork.ssid == requestBody.network.ssid);
            wpa_cli.select_network('wlan0', network.id, (err, data) => {
                network.passphrase = requestBody.passphrase;
                config.network = network;
                setConfiguration(config);
                resolve(data);
            });
        } catch(error) { }
    });
}

function getInterfaceStatus(interface) {
    return new Promise((resolve, reject) => {
        ifconfig.status(interface, (err, status) => {
            resolve(status);
        });
    });
}

function getWlanStatus(interface) {
    return new Promise((resolve, reject) => {
        ifconfig.status(interface, (err, status) => {
            resolve(status);
        })
    });
}

async function connect(requestBody) {
    if (requestBody.network.id) {
        await removeNetwork(requestBody);
    }
    await joinNetwork(requestBody);
}

function renewIp(networkInterface) {
    return new Promise((resolve) => {
        const command = [
            'dhclient',
            '-v',
            '-r',
            networkInterface
        ].join(' ');

        child_process.exec(command, (err, data) => {
            ifconfig.status(networkInterface, (err, data) => {
                console.log('renewIp', data);
                networks.status = data;
                resolve(data);
            })            
        });
    });
}

function selectNetwork(networkInterface) {
    return new Promise((resolve) => {
        wpa_cli.select_network(networkInterface, networks.currentNetwork.id, (err, data) => {
            if (networks.currentNetwork.id == 0) {
                const options = {
                    interface: "wlan0",
                    ip_address: "192.168.4.1/24",
                    nohook: "wpa_supplicant" 
                };

                dhcpcd.enable(options, (err, dhcpcdData) => {
                    resolve(dhcpcdData);
                })
            }

            dhcpcd.disable((err, dhcpcdData) => {
                resolve(data);
            });
        });
    });    
}

const wpaConfigurator = module.exports = {
    getConfiguration: getConfiguration,
    setConfiguration: setConfiguration,
    getInterfaceStatus: getInterfaceStatus,
    getWlanStatus: getWlanStatus,
    joinNetwork: joinNetwork,
    proceed: proceed,
    connect: connect
};