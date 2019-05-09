import React from 'react';
import {
    Radio,
    Input,
    Button,
    Form
} from 'antd';
import fetch from 'isomorphic-unfetch';

class FormWifi extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: 1 };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const values = this.props.form.getFieldsValue();
        fetch(`${process.env.APP_HOST}/api/wlan/connect`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
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
                            key={network.bssid} 
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

export default Form.create({ name: 'form_wifi' })(FormWifi);