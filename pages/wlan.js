import React from 'react';
import fetch from 'isomorphic-unfetch';
import BaseLayout from '../components/Layout/BaseLayout';
import { withRouter } from 'next/router';

class Page extends React.Component {
    static async getInitialProps() {
        const res = await fetch('http://localhost:3000/api/scan');
        const data = await res.json();
        
        console.log('getInitialProps', data);
        
        return {
            results: data
        }
    }

    render() {
        return (
            <BaseLayout>
                WLAN        
                <form>
                    {this.props.results.map((network) => <div key={network.bssid}>{network.ssid}</div>)}
                    <input 
                        type="text" 
                        placeholder="Code WIFI"
                    />
                    <button type="submit">Envoyer</button>
                </form>
            </BaseLayout>
        );
    }
}

export default withRouter(Page);