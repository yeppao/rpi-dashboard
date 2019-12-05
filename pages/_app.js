import App, { Container } from 'next/app';
import WpaConfigProvider from '../components/Provider/WpaConfigProvider';

class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props;
        return (
        <Container>
            <WpaConfigProvider>
                <Component {...pageProps} />
            </WpaConfigProvider>
        </Container>
        );
    }
}

export default MyApp;