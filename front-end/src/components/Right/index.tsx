import { Tabs } from 'antd'
import PropertyPanel from '../PropertyPanel'
import BackgroundPanel from '../BackgroundPanel'
import styles from './index.less'

const Right = () => {
  return (
    <div className={styles.right}>
      <Tabs defaultActiveKey="1" items={[
        {
          label: `属性面板`,
          key: '1',
          children: <PropertyPanel />,
        },
        {
          label: `背景面板`,
          key: '2',
          children: <BackgroundPanel />,
        },
      ]} />
    </div>
  )
}

export default Right;
