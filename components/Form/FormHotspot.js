import React from 'react';
import { Input, Button, Form, Row, Col, Select, Checkbox } from 'antd';
import { withWpaConfig } from '../Provider/WpaConfigProvider';

class FormHotspot extends React.Component {
    constructor(props) {
        super(props);
        this.state = { values: props.values };        
    }

    componentDidMount() {
        this.props.form.setFieldsValue(this.state.values);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const wpaConfig = this.props.wpaConfig;
        const fields = this.props.form.getFieldsValue();
        delete wpaConfig.network;
        wpaConfig.config = {
            mode: 'hotspot',
            network: {
                ssid: "NadiaSuite",
                mode: 2,
                key_mgmt: "WPA-PSK",
                psk: "YouNeedToChangeNadia",
                frequency: 2437
            },
            dhcpcd: {
                interface: "wlan0",
                ip_address: "192.168.4.1/24",
                nohook: "wpa_supplicant"
            }
        };
        this.props.setWpaConfig(wpaConfig);
        fetch(`${this.props.hostname}/api/wlan/config`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(wpaConfig.config)
        }).then((response) => console.log(response));
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={12}>
                        <Form.Item label="Interface">
                            {getFieldDecorator('interface')(
                            <Select>
                                <Option value="wlan0">wlan0</Option>
                            </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Driver">
                            {getFieldDecorator('driver')(
                            <Select>
                                <Option value="nl80211">nl80211</Option>
                                <Option value="wext">wext</Option>
                            </Select>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="Nom du reseau">
                            {getFieldDecorator('ssid')(
                            <Input placeholder="SSID" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Bande de fréquence">
                            {getFieldDecorator('hw_mode')(
                            <Select>
                                <Option value="g">2.4 GHz</Option>
                                <Option value="a">5 GHz</Option>
                            </Select>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="Channel">
                            {getFieldDecorator('channel')(
                            <Select>
                                <Option value={0}>Auto.</Option>
                                <Option value={1}>1 (recommandé)</Option>
                                <Option value={2}>2</Option>
                                <Option value={3}>3</Option>
                                <Option value={4}>4</Option>
                                <Option value={5}>5</Option>
                                <Option value={6}>6 (recommandé)</Option>
                                <Option value={7}>7</Option>
                                <Option value={8}>8</Option>
                                <Option value={9}>9</Option>
                                <Option value={10}>10 (recommandé)</Option>
                                <Option value={11}>11</Option>
                            </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Support de la QoS">
                        {getFieldDecorator('wmm_enabled', {
                            valuePropName: 'checked',
                            initialValue: 0,
                        })(<Checkbox value={1}>Support de la QoS</Checkbox>)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="Restriction d’accès par adresse MAC">
                            {getFieldDecorator('macaddr_acl')(
                            <Select>
                                <Option value={0}>Restriction sur liste noire</Option>
                                <Option value={1}>Restrition sur liste blanche</Option>
                            </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Algorithme de sécurité">
                            {getFieldDecorator('auth_algs')(
                            <Select>
                                <Option value={1}>WEP</Option>
                                <Option value={2}>WPA</Option>
                                <Option value={3}>WEP & WPA</Option>
                            </Select>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="Mode invisible">
                            {getFieldDecorator('ignore_broadcast_ssid', {
                                valuePropName: 'checked',
                                initialValue: 0,
                            })(<Checkbox value={1}>Oui</Checkbox>)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="WPA">
                            {getFieldDecorator('wpa')(
                            <Select>
                                <Option value={1}>WPA</Option>
                                <Option value={2}>WPA2</Option>
                            </Select>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="Mot de passe">
                            {getFieldDecorator('wpa_passphrase')(
                            <Input placeholder="WPA Passphrase" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Algorithme de clefs">
                            {getFieldDecorator('wpa_key_mgmt')(
                            <Select>
                                <Option value="WPA-PSK">WPA-Personal / WPA2-Personal</Option>
                                <Option value="WPA-PSK-SHA256">WPA2-Personal using SHA256</Option>
                                <Option value="WPA-EAP">WPA-Enterprise / WPA2-Enterprise</Option>
                                <Option value="WPA-EAP-SHA256">WPA2-Enterprise using SHA256</Option>
                                <Option value="SAE">SAE (WPA3-Personal)</Option>
                                <Option value="WPA-EAP-SUITE-B-192">WPA3-Enterprise with 192-bit security/CNSA suite</Option>
                                <Option value="FT-PSK">FT with passphrase/PSK</Option>
                                <Option value="FT-EAP">FT with EAP</Option>
                                <Option value="FT-EAP-SHA384">FT with EAP using SHA384</Option>
                                <Option value="FT-SAE">FT with SAE</Option>
                                <Option value="FILS-SHA256">Fast Initial Link Setup with SHA256</Option>
                                <Option value="FILS-SHA384">Fast Initial Link Setup with SHA384</Option>
                                <Option value="FT-FILS-SHA256">FT and Fast Initial Link Setup with SHA256</Option>
                                <Option value="FT-FILS-SHA384">FT and Fast Initial Link Setup with SHA384</Option>
                                <Option value="OWE">Opportunistic Wireless Encryption (a.k.a. Enhanced Open)</Option>
                                <Option value="DPP">Device Provisioning Protocol</Option>
                                <Option value="OSEN">Hotspot 2.0 online signup with encryption</Option>
                            </Select>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="WPA PAIRWISE">
                            {getFieldDecorator('wpa_pairwise')(
                            <Input placeholder="WPA Pairwise" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Algorithme de chiffrement pour WPA2">
                            {getFieldDecorator('rsn_pairwise')(
                            <Input placeholder="RSN Pairwise" />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Button type="primary" htmlType="submit">Envoyer</Button>
            </Form>
        );
    }
}

export default withWpaConfig(Form.create({ name: 'form_hotspot' })(FormHotspot));