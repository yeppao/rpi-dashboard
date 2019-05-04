import React from 'react';
import {
  Layout, Menu
} from 'antd';
import Link from 'next/link';

const { Header } = Layout;

export default class Navbar extends React.Component {
    render() {
        return (
            <Header className="header">
            <div className="logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['1']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="1">
                <Link href=""><a>Home</a></Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link href="/docker"><a>Docker</a></Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link href="/wlan"><a>WLAN</a></Link>
              </Menu.Item>
            </Menu>
          </Header>
        );
    }
}