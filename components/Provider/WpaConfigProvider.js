import React, { Component } from 'react';
import fetch from 'isomorphic-unfetch';

export const WpaConfigContext = React.createContext({
    wpaConfig: null,
    setWpaConfig: () => { }
});

class WpaConfigProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wpaConfig: {
                mode: '',
                network: { id: 0 },
                services: {}
            },
            hostname: undefined,
            setWpaConfig: wpaConfig => {
                this.setState({ wpaConfig: wpaConfig });
            },
            setHostname: hostname => {
                this.setState({ hostname: hostname });
            },            
        };

        if (this.props.children && this.props.children.props && this.props.children.props.hostname) {
            process.env.APP_HOST = this.state.hostname = this.props.children.props.hostname;        
        }
    }

    render() {
        return (
            <WpaConfigContext.Provider value={this.state}>
                {this.props.children}
            </WpaConfigContext.Provider>
        )
    }
}

export const withWpaConfig = Component => class WpaConfigConsumer extends Component {
    static async getInitialProps(ctx) {
        const { req } = ctx;
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);            
        }

        let protocol = req ? req.protocol : window.location.protocol
        let host = req ? req.headers.host : window.location.hostname    
        console.log(protocol, host);
        pageProps.hostname = `${protocol}://${host}`;

        return { ...pageProps };
    }

    render() {
        return (            
            <WpaConfigContext.Consumer>
                {store => <Component {...this.props} {...store} />}
            </WpaConfigContext.Consumer>
        )
    }
}

export default WpaConfigProvider;