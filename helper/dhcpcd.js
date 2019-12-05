const child_process = require('child_process');

async function enable(options, callback) {
    return child_process.exec(`dhcpcd -S ip_address=${options.ip_address} --nohook ${options.nohook} ${options.interface}`, callback);
}

async function disable(callback) {
    var command = 'kill `pgrep -f "^dhcpcd.*"` || true';
    return child_process.exec(command, callback);
}

const dhcpcd = module.exports = {
    enable: enable,
    disable: disable
}