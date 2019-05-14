RPI Dashboard
=============

#### How to install
```sh
$ git clone ...
$ npm install
```

#### How to run
```sh
$ npm run build
$ npm run dev
```

#### Configuration
> Hotspot
```json
{
    "mode": "hotspot",
    "services": {
        "hostapd": {
            "enabled": true,
            "options": {
                "channel": 7,
                "driver": "nl80211",
                "hw_mode": "g",
                "interface": "wlan0",
                "ssid": "NadiaSuite",
                "wpa": 2,
                "wpa_passphrase": "YouNeedToChangeNadia"
            }
        },
        "dhcpcd": {
            "enabled": true,
            "options": {
                "interface": "wlan0",
                "ip_address": "192.168.4.1/24",
                "nohook": "wpa_supplicant"
            }
        }
    }
}
```

> Client
```json
{
    "mode": "client",
    "network": { "ssid": "Network-SSID", "passphrase": "YourWifiPassphrase" },
    "services": {
        "hostapd": { "enabled": true },
        "dhcpcd": { "enabled": false }
    }
}
```

