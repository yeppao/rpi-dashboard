import React from 'react';
import {
  Layout, Breadcrumb
} from 'antd';
import Sidebar from './Layout/Sidebar';
import Navbar from './Layout/Navbar';
import Router from './Router';

const { Content } = Layout;
function App() {
  return (
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
            <Router />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;
