import React from 'react';

import '../../static/style.css';
import 'antd/dist/antd.css';

import {
  Layout, Breadcrumb
} from 'antd';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const { Content } = Layout;
const BaseLayout = props => (
  <Layout>
    <Navbar />
    <Layout>
      <Sidebar />
      <Layout style={{ padding: '0 24px 24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{
          background: '#fff', padding: 24, margin: 0, minHeight: 280,
        }}
        >
          {props.children}
        </Content>
      </Layout>
    </Layout>
  </Layout>
)

export default BaseLayout;
