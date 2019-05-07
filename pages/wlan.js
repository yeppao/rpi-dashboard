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

const { Title } = Typography;

class Page extends React.Component {
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
            results: this.props.results
        };

        this.getCurrentStatus();
    }

    async getCurrentStatus() {
        const res = await fetch(`${process.env.APP_HOST}/api/wlan/status`);
        const wlanStatus = await res.json();
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
        this.setState({ wlanStatus: wlanStatus });
    }

    static async getInitialProps() {
        const data = await WifiActions.scan();

        return {
            results: data
        }
    }

    refreshWifi = async () => {
        const data = await WifiActions.scan();

        this.setState({ results: data });
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

                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab={<span><Icon type="apple" />Hotspot</span>} key="1">
                        <Title level={4}>HOSTAPD configuration</Title>                        
                        <FormHotspot values={this.state.wlanConfig} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<span><Icon type="android" />Join</span>} key="2">
                        <Title level={4}>WIFI Configuration</Title>
                        <Button icon="reload" onClick={this.refreshWifi}>Actualiser</Button>
                        <FormWifi results={this.state.results} />
                    </Tabs.TabPane>
                </Tabs>
            </BaseLayout>
        );
    }
}

export default withRouter(Page);