class WifiActions {
    static async scan() {
        const res = await fetch(`${process.env.APP_HOST}/api/wlan/scan`);
        return res.json();
    }
};

export default WifiActions;