import React from 'react';
import { Input, Button, Form, Row, Col } from 'antd';
class FormHotspot extends React.Component {
    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={12}>
                        <Form.Item label="Interface"><Input placeholder="Interface" /></Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Driver"><Input placeholder="Driver" /></Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="SSID"><Input placeholder="SSID" /></Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="HW Mode"><Input placeholder="HW Mode" /></Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="Channel"><Input placeholder="Channel" /></Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="WMM Enabled"><Input placeholder="WMM Enabled" /></Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="MACADDR ACL"><Input placeholder="MACADDR ACL" /></Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="AUTH ALGS"><Input placeholder="AUTH ALGS" /></Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="IGNORE BROADCAST SSID"><Input placeholder="IGNORE BROADCAST SSID" /></Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="WPA"><Input placeholder="WPA" /></Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="WPA Passphrase"><Input placeholder="WPA Passphrase" /></Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="WPA KEY MGMT"><Input placeholder="WPA KEY MGMT" /></Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="WPA PAIRWISE"><Input placeholder="WPA PAIRWISE" /></Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="RSN PAIRWISE"><Input placeholder="RSN PAIRWISE" /></Form.Item>
                    </Col>
                </Row>

                <Button type="primary" htmlType="submit">
                    Envoyer
                            </Button>
            </Form>
        );
    }
}

export default FormHotspot;