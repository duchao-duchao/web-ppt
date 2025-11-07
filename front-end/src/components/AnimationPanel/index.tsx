import React from 'react';
import { Form, Select, InputNumber, Button, Space, Divider, Typography, message } from 'antd';
import { usePresentationStore } from '@/stores/presentationStore';
import type { ElementAnimation, AnimationEffect, AnimationStartMode } from '@/types/presentation';
import { EyeOutlined, ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Title, Text } = Typography;

const EFFECT_OPTIONS: { label: string; value: AnimationEffect }[] = [
  { label: '淡入', value: 'appear' },
  { label: '淡出', value: 'disappear' },
  { label: '缩放进入', value: 'zoomIn' },
  { label: '缩放退出', value: 'zoomOut' },
  { label: '飞入', value: 'flyIn' },
  { label: '飞出', value: 'flyOut' },
  { label: '旋转', value: 'spin' },
  { label: '弹跳', value: 'bounce' },
  { label: '擦除', value: 'wipe' },
  { label: '淡化', value: 'fade' },
];

const START_OPTIONS: { label: string; value: AnimationStartMode }[] = [
  { label: '单击时', value: 'onClick' },
  { label: '与上一项同时', value: 'withPrevious' },
  { label: '上一项之后', value: 'afterPrevious' },
];

function buildKeyframes(effect: AnimationEffect, kind: ElementAnimation['kind'], options: ElementAnimation['options']): Keyframe[] {
  const distance = options.distancePx ?? 120;
  const angle = options.rotateDeg ?? 360;
  const direction = options.direction ?? 'top';

  switch (effect) {
    case 'fade': {
      // 通用淡化（强调）
      return [{ opacity: 0.5 }, { opacity: 1 }];
    }
    case 'appear':
      return [{ opacity: 0 }, { opacity: 1 }];
    case 'disappear':
      return [{ opacity: 1 }, { opacity: 0 }];
    case 'flyIn': {
      const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
      const sign = direction === 'left' || direction === 'top' ? '-' : '';
      const from = `translate${axis}(${sign}${distance}px)`;
      const to = 'translate(0, 0)';
      return [{ transform: from }, { transform: to }];
    }
    case 'flyOut': {
      const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
      const sign = direction === 'left' || direction === 'top' ? '-' : '';
      const to = `translate${axis}(${sign}${distance}px)`;
      return [{ transform: 'translate(0,0)' }, { transform: to }];
    }
    case 'zoomIn':
      return [{ transform: 'scale(0.8)' }, { transform: 'scale(1)' }];
    case 'zoomOut':
      return [{ transform: 'scale(1)' }, { transform: 'scale(0.8)' }];
    case 'spin':
      return [{ transform: 'rotate(0deg)' }, { transform: `rotate(${angle}deg)` }];
    case 'bounce': {
      const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
      const sign = direction === 'left' || direction === 'top' ? '-' : '';
      const offset = `translate${axis}(${sign}${Math.round(distance / 2)}px)`;
      return [
        { transform: 'translate(0,0)', offset: 0 },
        { transform: offset, offset: 0.3 },
        { transform: 'translate(0,0)', offset: 0.6 },
        { transform: offset, offset: 0.8 },
        { transform: 'translate(0,0)', offset: 1 },
      ];
    }
    case 'wipe': {
      // 简化为沿方向缩放
      const isHorizontal = direction === 'left' || direction === 'right';
      const from = isHorizontal ? 'scaleX(0)' : 'scaleY(0)';
      const to = isHorizontal ? 'scaleX(1)' : 'scaleY(1)';
      return [{ transform: from, transformOrigin: 'center' }, { transform: to, transformOrigin: 'center' }];
    }
    default:
      return [{ opacity: 0 }, { opacity: 1 }];
  }
}

function previewAnimation(elementId: string, anim: ElementAnimation) {
  // 优先在主画布容器内查找元素，避免命中左侧缩略图
  const el = (document.querySelector(`#ppt-main-canvas #ppt-el-${elementId}`) as HTMLElement) 
          || document.getElementById(`ppt-el-${elementId}`);
  if (!el) {
    message.warning('未找到可预览的元素');
    return;
  }
  const keyframes = buildKeyframes(anim.effect, anim.kind, anim.options);
  const { durationMs = 600, delayMs = 0, easing = 'ease-out' } = anim.options;
  el.animate(keyframes as any, { duration: durationMs, delay: delayMs, easing, iterations: anim.options.loop ? Infinity : 1, fill: 'both' });
}

const AnimationPanel: React.FC = () => {
  const {
    slides,
    currentSlideIndex,
    selectedElementIds,
    addAnimation,
    updateAnimation,
    removeAnimation,
    reorderAnimations,
  } = usePresentationStore();

  const selectedElementId = selectedElementIds.length === 1 ? selectedElementIds[0] : null;
  const selectedElement = React.useMemo(() => {
    const slide = slides[currentSlideIndex];
    if (!slide || !selectedElementId) return null;
    return slide.elements.find(el => el.id === selectedElementId) || null;
  }, [slides, currentSlideIndex, selectedElementId]);

  const [newEffect, setNewEffect] = React.useState<AnimationEffect>('fade');
  const [newKind, setNewKind] = React.useState<ElementAnimation['kind']>('entrance');
  const [newStart, setNewStart] = React.useState<AnimationStartMode>('onClick');
  const [durationMs, setDurationMs] = React.useState<number>(600);
  const [delayMs, setDelayMs] = React.useState<number>(0);
  const [distancePx, setDistancePx] = React.useState<number>(120);
  const [rotateDeg, setRotateDeg] = React.useState<number>(360);
  const [direction, setDirection] = React.useState<'left'|'right'|'top'|'bottom'>('top');

  const handleAdd = () => {
    if (!selectedElementId) return;
    const anim: Omit<ElementAnimation, 'id'> = {
      kind: newKind,
      effect: newEffect,
      startMode: newStart,
      options: { durationMs, delayMs, direction, distancePx, rotateDeg, easing: 'ease-out' },
    };
    addAnimation(selectedElementId, anim);
    message.success('已添加动画');
  };

  const handlePreview = (anim: ElementAnimation) => {
    if (!selectedElementId) return;
    previewAnimation(selectedElementId, anim);
  };

  if (!selectedElement) {
    return (
      <div className={styles.panel}>
        <Text type="secondary">请选择一个元素以编辑动画</Text>
      </div>
    );
  }

  const animations = selectedElement.animations || [];

  return (
    <div className={styles.panel}>
      <Title level={5} className={styles.title}>动画</Title>

      <Form size="small" layout="inline" className={styles.form}>
        <Form.Item label="类型">
          <Select style={{ width: 100 }} value={newKind} onChange={setNewKind as any} options={[
            { label: '入场', value: 'entrance' },
            { label: '强调', value: 'emphasis' },
            { label: '退出', value: 'exit' },
          ]} />
        </Form.Item>
        <Form.Item label="效果">
          <Select style={{ width: 120 }} value={newEffect} onChange={setNewEffect as any} options={EFFECT_OPTIONS} />
        </Form.Item>
        <Form.Item label="触发">
          <Select style={{ width: 120 }} value={newStart} onChange={setNewStart as any} options={START_OPTIONS} />
        </Form.Item>
        <Form.Item label="时长">
          <InputNumber min={100} max={10000} value={durationMs} onChange={(v) => setDurationMs(v || 600)} />
        </Form.Item>
        <Form.Item label="延迟">
          <InputNumber min={0} max={5000} value={delayMs} onChange={(v) => setDelayMs(v || 0)} />
        </Form.Item>
        <Form.Item label="方向">
          <Select style={{ width: 100 }} value={direction} onChange={setDirection as any} options={[
            { label: '上', value: 'top' },
            { label: '下', value: 'bottom' },
            { label: '左', value: 'left' },
            { label: '右', value: 'right' },
          ]} />
        </Form.Item>
        <Form.Item label="距离">
          <InputNumber min={0} max={600} value={distancePx} onChange={(v) => setDistancePx(v || 120)} />
        </Form.Item>
        <Form.Item label="角度">
          <InputNumber min={0} max={1080} value={rotateDeg} onChange={(v) => setRotateDeg(v || 360)} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加</Button>
        </Form.Item>
      </Form>

      <Divider className={styles.divider} />

      {!animations.length ? (
        <Text type="secondary">暂无动画</Text>
      ) : (
        <div className={styles.list}>
          {animations.map((anim, idx) => (
            <div key={anim.id} className={styles.item}>
              <Space size={8} wrap>
                <Select size="small" style={{ width: 96 }}
                  value={anim.kind}
                  onChange={(v) => updateAnimation(selectedElementId!, anim.id, { kind: v as ElementAnimation['kind'] })}
                  options={[{ label: '入场', value: 'entrance' }, { label: '强调', value: 'emphasis' }, { label: '退出', value: 'exit' }]} />

                <Select size="small" style={{ width: 120 }}
                  value={anim.effect}
                  onChange={(v) => updateAnimation(selectedElementId!, anim.id, { effect: v as AnimationEffect })}
                  options={EFFECT_OPTIONS} />

                <Select size="small" style={{ width: 120 }}
                  value={anim.startMode}
                  onChange={(v) => updateAnimation(selectedElementId!, anim.id, { startMode: v as AnimationStartMode })}
                  options={START_OPTIONS} />

                <InputNumber size="small" min={100} max={10000} value={anim.options.durationMs ?? 600}
                  onChange={(v) => updateAnimation(selectedElementId!, anim.id, { options: { ...anim.options, durationMs: v ?? 600 } })} />

                <InputNumber size="small" min={0} max={5000} value={anim.options.delayMs ?? 0}
                  onChange={(v) => updateAnimation(selectedElementId!, anim.id, { options: { ...anim.options, delayMs: v ?? 0 } })} />

                <Select size="small" style={{ width: 96 }} value={anim.options.direction ?? 'top'}
                  onChange={(v) => updateAnimation(selectedElementId!, anim.id, { options: { ...anim.options, direction: v as any } })}
                  options={[
                    { label: '上', value: 'top' },
                    { label: '下', value: 'bottom' },
                    { label: '左', value: 'left' },
                    { label: '右', value: 'right' },
                  ]} />

                <InputNumber size="small" min={0} max={600} value={anim.options.distancePx ?? 120}
                  onChange={(v) => updateAnimation(selectedElementId!, anim.id, { options: { ...anim.options, distancePx: v ?? 120 } })} />

                <InputNumber size="small" min={0} max={1080} value={anim.options.rotateDeg ?? 360}
                  onChange={(v) => updateAnimation(selectedElementId!, anim.id, { options: { ...anim.options, rotateDeg: v ?? 360 } })} />
              </Space>

              <Space size={8}>
                <Button size="small" icon={<EyeOutlined />} onClick={() => handlePreview(anim)} />
                <Button size="small" icon={<ArrowUpOutlined />} onClick={() => reorderAnimations(selectedElementId!, idx, Math.max(0, idx - 1))} disabled={idx === 0} />
                <Button size="small" icon={<ArrowDownOutlined />} onClick={() => reorderAnimations(selectedElementId!, idx, Math.min(animations.length - 1, idx + 1))} disabled={idx === animations.length - 1} />
                <Divider type="vertical" className={styles.actionsDivider} />
                <Button size="small" danger icon={<DeleteOutlined />} onClick={() => removeAnimation(selectedElementId!, anim.id)} />
              </Space>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimationPanel;