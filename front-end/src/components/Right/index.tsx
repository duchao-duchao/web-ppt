import { Tabs } from 'antd'
import PropertyPanel from '../PropertyPanel'
import AnimationPanel from '../AnimationPanel'
import styles from './index.less'

const Right = () => {
  return (
    <div className={styles.right}>
      <Tabs
        defaultActiveKey="1"
        tabBarStyle={{padding: '0 16px'}}
        items={[
            {
                label: `样式`,
                key: '1',
                children: <PropertyPanel />,
            },
            {
                label: `动画`,
                key: '2',
                children: <AnimationPanel />,
            },
        ]}
      />
    </div>
  )
}

export default Right;
