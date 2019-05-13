const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const child_process = require('child_process');

const wpaSupplicant = module.exports = {
    parseFile: parseFile,
    enable: enable,
    disable: disable
};

async function enable(callback) {
    return child_process.exec(`/sbin/wpa_supplicant -u -s -O /run/wpa_supplicant`, callback);
}

async function disable(callback) {
    var command = 'kill `pgrep -f "^/sbin/wpa_supplicant.*"` || true';
    return child_process.exec(command, callback);
}

async function parseContent(data) {
    return new Promise((resolve, reject) => {
        let networks = [];
        const networkRegex = /network=\{\n(?<networkContent>[^\}]+)/gm;
        while (networkContent = networkRegex.exec(data)) {
            const networkContentRegex = /(?:\s+(?<key>[^=]+)="?(?<value>[^"|\n]+)"?)/gm;
            const network = {};
            while (networkProperties = networkContentRegex.exec(networkContent.groups.networkContent)) {
                network[networkProperties.groups.key] = networkProperties.groups.value;
            }
            networks.push(network);
        }

        resolve(networks);
    });
}

async function parseFile(filePath) {
    const data = await readFile(filePath, 'utf8');
    return await parseContent(data);
}