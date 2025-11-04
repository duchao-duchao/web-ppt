import React from 'react';
import { Menu, Dropdown } from 'antd';

interface ContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  onClose: () => void;
  onSelect: (key: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, visible, onClose, onSelect }) => {
  const menu = (
    <Menu onClick={({ key }) => onSelect(key)}>
      <Menu.Item key="copy">复制</Menu.Item>
      <Menu.Item key="paste">粘贴</Menu.Item>
      <Menu.Item key="delete">删除</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="bringForward">上移一层</Menu.Item>
      <Menu.Item key="sendBackward">下移一层</Menu.Item>
    </Menu>
  );

  if (!visible) return null;

  return (
    <div style={{ position: 'fixed', left: x, top: y, zIndex: 1000 }} onMouseLeave={onClose}>
      <Dropdown overlay={menu} open={visible} onOpenChange={v => !v && onClose()}>
        <div />
      </Dropdown>
    </div>
  );
};

export default ContextMenu;