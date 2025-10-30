import React from 'react';
import { Layout } from 'antd';
import styles from './index.less';
import Canvas from '@/components/Canvas';
// import History from '@/components/History';
import SlideList from '@/components/SlideList';
import Header from '@/components/Header';
import CanvasHeader from '@/components/CanvasHeader';
import Right from '@/components/Right';

const { Sider, Content } = Layout;

const EditorPage: React.FC = () => {
  
  return (
    <Layout className={styles.layout}>
      <Header>
      </Header>
      <Layout>
        <Sider width={160} className={styles.leftSider}>
          <SlideList />
        </Sider>
        <Content>
          <CanvasHeader></CanvasHeader>
          <Canvas />
        </Content>
        <Sider width={260} className={styles.rightSider}>
          <Right />
        </Sider>
      </Layout>
    </Layout>
  );
};

export default EditorPage;
