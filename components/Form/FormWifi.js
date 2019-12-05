import React from 'react';
import {
    Radio,
    Input,
    Button,
    Form
} from 'antd';
import { withWpaConfig } from '../Provider/WpaConfigProvider';

class FormWifi extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: 1 };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const values = this.props.form.getFieldsValue();
        values.network.passphrase = values.passphrase;
        let wpaConfig = this.props.wpaConfig;
        console.log(values, wpaConfig);
        wpaConfig.config.network = values.network;
        delete wpaConfig.config.dhcpcd;
        wpaConfig.config.mode = 'client';
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
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit}>
                {getFieldDecorator('network', { initialValue: this.props.results.find((network) => network.isCurrent === true) })(
                <Radio.Group>
                    {this.props.results.map((network) => (
                        <Radio 
                            disabled={network.frequency === undefined} 
                            style={radioStyle} 
                            key={network.id ? network.id : network.bssid}
                            value={network}>{network.ssid}</Radio>))}
                </Radio.Group>
                )}
                {getFieldDecorator('passphrase')(
                <Input placeholder="Code WIFI" />
                )}
                <Button type="primary" htmlType="submit">Envoyer</Button>
            </Form>
        );
    }
}

export default Form.create({ name: 'form_wifi' })(withWpaConfig(FormWifi));