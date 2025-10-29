import React from 'react';
import { Layout } from 'antd';
import styles from './index.less';
import Canvas from '@/components/Canvas';
// import History from '@/components/History';
import PropertyPanel from '@/components/PropertyPanel';
import SlideList from '@/components/SlideList';
import BackgroundPanel from '@/components/BackgroundPanel';
import Header from '@/components/Header';

const { Sider, Content } = Layout;

const EditorPage: React.FC = () => {
  
  return (
    <Layout className={styles.layout}>
      <Header>
      </Header>
      <Layout>
        <Sider width={300} className={styles.leftSider}>
          <SlideList />
        </Sider>
        <Content className={styles.content}>
          <Canvas />
        </Content>
        <Sider width={300} className={styles.rightSider}>
          <PropertyPanel />
          <BackgroundPanel />
        </Sider>
      </Layout>
    </Layout>
  );
};

export default EditorPage;
