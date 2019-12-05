import React from 'react';
import fetch from 'isomorphic-unfetch';
import BaseLayout from '../components/Layout/BaseLayout';
import { withRouter } from 'next/router';
import {
    Radio,
    Tabs,
    Icon,
    Input,
    Button,
    Form,
    Row,
    Col,
    Typography,
    Tag,
    Badge
} from 'antd';
import FormHotspot from '../components/Form/FormHotspot';
import FormWifi from '../components/Form/FormWifi';
import WifiActions from '../actions/WifiActions';
import { withWpaConfig } from '../components/Provider/WpaConfigProvider';

const { Title } = Typography;

class Page extends React.Component {
    async scan() {
        const res = await fetch(`${this.props.hostname}/api/wlan/scan`);
        return res.json();
    }

    constructor(props) {
        super(props);

        this.state = {
            wlanConfig: {
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
            },
            wlanStatus: null,
            results: []
        };
        this.scan().then(results => this.setState({ results: results }));
        this.getConfig();
        this.getCurrentStatus();        
    }

    async getConfig() {
        const res = await fetch(`${this.props.hostname}/api/wlan/config`);
        const wlan = await res.json();
        this.props.setWpaConfig(wlan);
    }

    /*const wlanStatus = {
            bssid: '2c:f5:d3:02:ea:d9',
            frequency: 2412,
            mode: 'station',
            key_mgmt: 'wpa2-psk',
            ssid: 'Fake-Wifi',
            pairwise_cipher: 'CCMP',
            group_cipher: 'CCMP',
            p2p_device_address: 'e4:28:9c:a8:53:72',
            wpa_state: 'COMPLETED',
            ip: '10.34.141.168',
            mac: 'e4:28:9c:a8:53:72',
            uuid: 'e1cda789-8c88-53e8-ffff-31c304580c1e',
            id: 0
        }*/
    async getCurrentStatus() {
        const res = await fetch(`${this.props.hostname}/api/wlan/status`);
        const wlanStatus = await res.json();    

        this.setState({ wlanStatus: wlanStatus });
    }    

    refreshWifi = async () => {
        const data = await this.scan();

        this.setState({ results: data });
    }

    handleTabChange = (activeKey) => {
        const { wpaConfig } = this.props;
        wpaConfig.config.mode = activeKey;
        this.props.setWpaConfig(wpaConfig);
    }

    render() {
        return (
            <BaseLayout>
                {this.state.wlanStatus && (
                    <React.Fragment>
                        <Title level={4}>Statut</Title>
                        <Row>
                            <Col span={6}><Tag color="blue">ID</Tag>{this.state.wlanStatus.id}</Col>
                            <Col span={6}><Tag color="blue">BSSID</Tag>{this.state.wlanStatus.bssid}</Col>
                            <Col span={6}><Tag color="blue">Frequence</Tag>{this.state.wlanStatus.frequency}</Col>
                            <Col span={6}><Tag color="blue">Mode</Tag>{this.state.wlanStatus.mode}</Col>
                        </Row>
                        <Row>
                            <Col span={8}><Tag color="blue">MGMT Key</Tag>{this.state.wlanStatus.key_mgmt}</Col>
                            <Col span={8}><Tag color="blue">SSID</Tag>{this.state.wlanStatus.ssid}</Col>
                            <Col span={8}><Tag color="blue">Pairwise cipher</Tag>{this.state.wlanStatus.pairwise_cipher}</Col>
                        </Row>
                        <Row>
                            <Col span={8}><Tag color="blue">Group cipher</Tag>{this.state.wlanStatus.group_cipher}</Col>
                            <Col span={8}><Tag color="blue">Device address</Tag>{this.state.wlanStatus.p2p_device_address}</Col>
                            <Col span={8}>
                                <Tag color="blue">WPA State</Tag>
                                <Badge status="success" text={this.state.wlanStatus.wpa_state} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}><Tag color="blue">IP</Tag>{this.state.wlanStatus.ip}</Col>
                            <Col span={8}><Tag color="blue">MAC</Tag>{this.state.wlanStatus.mac}</Col>
                            <Col span={8}><Tag color="blue">UUID</Tag>{this.state.wlanStatus.uuid}</Col>
                        </Row>
                    </React.Fragment>)}

                <Tabs activeKey={this.props.wpaConfig && this.props.wpaConfig.config && this.props.wpaConfig.config.mode} onChange={this.handleTabChange}>
                    <Tabs.TabPane tab={<span><Icon type="apple" />Hotspot</span>} key="hotspot">
                        <Title level={4}>HOSTAPD configuration</Title>                        
                        <FormHotspot values={this.state.wlanConfig} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<span><Icon type="android" />Join</span>} key="client">
                        <Title level={4}>WIFI Configuration</Title>
                        <Button icon="reload" onClick={this.refreshWifi}>Actualiser</Button>
                        <FormWifi results={this.state.results} />
                    </Tabs.TabPane>
                </Tabs>
            </BaseLayout>
        );
    }
}

export default withWpaConfig(withRouter(Page));