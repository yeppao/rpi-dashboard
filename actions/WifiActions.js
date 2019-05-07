import React from 'react';

class WifiActions {
    static async scan() {
        const res = await fetch('http://localhost:3000/api/wlan/scan');
        return res.json();
    }
};

export default WifiActions;