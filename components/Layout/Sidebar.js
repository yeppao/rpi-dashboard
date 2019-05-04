import React from 'react';
import {
    Layout, Menu, Icon,
  } from 'antd';
  
  const { SubMenu } = Menu;
  const { Sider } = Layout;

export default class Sidebar extends React.Component {
    render() {
        return (
            <Sider width={200} style={{ background: '#fff' }}>
                <Menu
                    mode="inline"
                    style={{ height: '100%', borderRight: 0 }}
                >
                    <SubMenu key="sub1" title={<span><Icon type="user" />Test</span>}>
                        <Menu.Item key="1">Test 1</Menu.Item>
                    </SubMenu>                   
                </Menu>
            </Sider>
        );
    }
}