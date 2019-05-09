var child_process = require('child_process');

/**
 * The **wpa_cli** command is used to configure wpa network interfaces.
 *
 */
const wpaCli = module.exports = {
    list_networks: list_networks,
    list_networks_p: list_networks_p
};
/**
 * Parses the result for a wpa command over an interface.
 *
 * @private
 * @static
 * @category wpa_cli
 * @param {string} block The section of stdout for the command.
 * @returns {object} The parsed wpa command result.
 *
 */
function parse_command_block(block) {
    var match;

    var parsed = {
        result: block.match(/^([^\s]+)/)[1]
    };

    return parsed;
}

/**
 * Parses the results of a scan_result request.
 *
 * @private
 * @static
 * @category wpa_cli
 * @param {string} block The section of stdout for the interface.
 * @returns {object} The parsed scan results.
 */
function parse_list_networks(block) {
    let match;
    let results = [];

    lines = block.split('\n').map(function (item) { return item + "\n"; });
    lines.forEach(function (entry) {
        var parsed = {};
        if ((match = entry.match(/^([0-9])+\t([^\t]+)\t([^\t\n]+)\t?(\[CURRENT\])?/))) {
            parsed = {
                id: parseInt(match[1]),
                ssid: match[2],
                bssid: match[3],
                isCurrent: match[4] !== undefined
            };
        }

        if (!(Object.keys(parsed).length === 0 && parsed.constructor === Object)) {
            results.push(parsed);
        }
    });

    return results;
}

/**
 * Parses the status for a scan_results request.
 *
 * @private
 * @static
 * @category wpa_cli
 * @param {function} callback The callback function.
 *
 */
function parse_list_networks_interface(callback) {
    return function (error, stdout, stderr) {
        console.log(stdout, stderr);
        if (error) {
            callback(error);
        } else {
            callback(error, parse_list_networks(stdout.trim()));
        }
    };
}


function list_networks(networkInterface, callback) {
    var command = ['wpa_cli -i',
        networkInterface,
        'list_networks'].join(' ');

    return child_process.exec(command, parse_list_networks_interface(callback));
}

function list_networks_p(networkInterface) {
    return new Promise((resolve, reject) => {
        list_networks(networkInterface, (err, data) => {
            resolve(data);
        });
    });
}