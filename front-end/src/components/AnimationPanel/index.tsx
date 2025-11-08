import React from 'react';
import { Form, Select, InputNumber, Button, Space, Divider, Typography, message, Popover, Row, Col } from 'antd';
import { usePresentationStore } from '@/stores/presentationStore';
import type { ElementAnimation, AnimationEffect, AnimationStartMode } from '@/types/presentation';
import { EyeOutlined, DeleteOutlined, PlusOutlined, CaretRightOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Text } = Typography;

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

// ===== 中文标签映射：元素类型与动画效果 =====
function typeLabel(type?: string): string {
  switch (type) {
    case 'shape':
      return '形状';
    case 'text':
      return '文本';
    case 'image':
      return '图片';
    case 'chart':
      return '图表';
    default:
      return '元素';
  }
}

function directionLabel(dir?: 'left' | 'right' | 'top' | 'bottom'): string {
  switch (dir) {
    case 'left':
      return '向左';
    case 'right':
      return '向右';
    case 'top':
      return '向上';
    case 'bottom':
      return '向下';
    default:
      return '';
  }
}

function effectLabel(anim: ElementAnimation): string {
  const dirText = directionLabel(anim.options.direction);
  const long = anim.options.distancePx && anim.options.distancePx > 180 ? '长距离' : '';
  switch (anim.effect) {
    case 'appear':
      return '淡入';
    case 'disappear':
      return '淡出';
    case 'zoomIn':
      return '缩放进入';
    case 'zoomOut':
      return '缩放退出';
    case 'flyIn':
      return `${dirText ? dirText : ''}${long ? long : ''}浮入`.replace(/^$/, '浮入');
    case 'flyOut':
      return `${dirText ? dirText : ''}浮出`.replace(/^$/, '浮出');
    case 'spin':
      return '旋转';
    case 'bounce':
      return `${dirText ? dirText : ''}弹入`.replace(/^$/, '弹入');
    case 'wipe':
      return `${dirText ? dirText : ''}擦除`.replace(/^擦除$/, '擦除');
    case 'fade':
      return '淡化';
    default:
      return anim.effect;
  }
}

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
    // reorderAnimations,
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
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  const handleOpenAddPopover = () => {
    if (!selectedElementId) {
      message.warning('请先选择一个元素');
      return;
    }
    setPopoverOpen(true);
  };

  const handleConfirmAdd = () => {
    const elementId = selectedElementId;
    if (!elementId) {
      message.warning('请先选择一个元素');
      return;
    }
    const anim: Omit<ElementAnimation, 'id'> = {
      kind: newKind,
      effect: newEffect,
      startMode: newStart,
      options: { durationMs, delayMs, direction, distancePx, rotateDeg, easing: 'ease-out' },
    };
    addAnimation(elementId, anim);
    setPopoverOpen(false);
    message.success('已添加动画');
  };

  const handlePreview = (anim: ElementAnimation) => {
    if (!selectedElementId) return;
    previewAnimation(selectedElementId, anim);
  };

  const handlePreviewRef = (ref: { elementId: string; animationId: string }) => {
    const slide = slides[currentSlideIndex];
    const anim = findAnimation(slide, ref.elementId, ref.animationId);
    if (!anim) {
      message.warning('动画不存在');
      return;
    }
    previewAnimation(ref.elementId, anim);
  };

  const handleDeleteRef = (ref: { elementId: string; animationId: string }) => {
    removeAnimation(ref.elementId, ref.animationId);
  };

  // ======== 整页顺序预览 ========
  const isPlayingAllRef = React.useRef(false);
  const runningAllRef = React.useRef<Animation[]>([]);
  const timerAllRef = React.useRef<number | null>(null);

  const getElementDom = (elementId: string): HTMLElement | null => {
    const main = document.getElementById('ppt-main-canvas');
    const selector = `#ppt-el-${elementId}`;
    return (main?.querySelector(selector) as HTMLElement) || null;
  };

  const findAnimation = (slide: typeof slides[number] | undefined, elementId: string, animationId: string) => {
    if (!slide) return null;
    const el = slide.elements.find(e => e.id === elementId);
    return el?.animations?.find(a => a.id === animationId) ?? null;
  };

  const cancelAllAnimationsOnSlide = () => {
    const container = document.getElementById('ppt-main-canvas');
    if (container && (container as any).getAnimations) {
      try { (container as any).getAnimations().forEach((a: Animation) => a.cancel()); } catch {}
    }
  };

  const applyEntranceGating = (slide: typeof slides[number]) => {
    if (!slide || !Array.isArray(slide.timeline)) return;
    const refs = slide.timeline.flatMap(step => step.animationRefs);
    const gatedIds = new Set<string>();
    for (const ref of refs) {
      if (gatedIds.has(ref.elementId)) continue;
      const anim = findAnimation(slide, ref.elementId, ref.animationId);
      if (!anim) continue;
      if (anim.kind === 'entrance') {
        const dom = getElementDom(ref.elementId);
        if (!dom) continue;
        dom.style.opacity = '0';
        dom.setAttribute('data-pre-enter', 'true');
        gatedIds.add(ref.elementId);
      }
    }
  };

  const clearEntranceGating = (slide: typeof slides[number]) => {
    if (!slide) return;
    for (const el of slide.elements) {
      const dom = getElementDom(el.id);
      if (!dom) continue;
      if (dom.getAttribute('data-pre-enter') === 'true') {
        dom.style.opacity = '';
        dom.removeAttribute('data-pre-enter');
      }
    }
  };

  const playAllTimeline = async () => {
    const slide = slides[currentSlideIndex];
    if (!slide) return;
    const steps = Array.isArray(slide.timeline) && slide.timeline.length
      ? slide.timeline
      : // 回退：没有时间线则按元素动画顺序生成一个简单序列
        slide.elements.flatMap(el => (el.animations || []).map(a => ({ animationRefs: [{ elementId: el.id, animationId: a.id }], trigger: 'auto' } as any)));

    cancelAllAnimationsOnSlide();
    applyEntranceGating(slide);
    isPlayingAllRef.current = true;
    runningAllRef.current = [];

    for (const step of steps) {
      if (!isPlayingAllRef.current) break;
      if (step.trigger === 'afterDelay' && step.delayMs && step.delayMs > 0) {
        await new Promise(res => setTimeout(res, step.delayMs));
      }
      const waapis: Animation[] = [];
      for (const ref of step.animationRefs) {
        const anim = findAnimation(slide, ref.elementId, ref.animationId);
        const dom = getElementDom(ref.elementId);
        if (!anim || !dom) continue;
        // 清除元素上的残留动画
        try { (dom as any).getAnimations?.().forEach((a: Animation) => a.cancel()); } catch {}
        // 播放前清除入口 gating
        if (dom.getAttribute('data-pre-enter') === 'true') {
          dom.style.opacity = '';
          dom.removeAttribute('data-pre-enter');
        }
        const kf = buildKeyframes(anim.effect, anim.kind, anim.options);
        const wa = dom.animate(kf as any, {
          duration: anim.options.durationMs ?? 600,
          delay: anim.options.delayMs ?? 0,
          easing: anim.options.easing ?? 'ease',
          fill: 'none',
        });
        waapis.push(wa);
      }
      runningAllRef.current = waapis;
      try { await Promise.all(waapis.map(a => a.finished.catch(() => {}))); } catch {}
    }
    isPlayingAllRef.current = false;
    cancelAllAnimationsOnSlide();
    applyEntranceGating(slide); // 结束后保持入口元素隐藏，避免全部常显
  };

  const stopAllPreview = () => {
    isPlayingAllRef.current = false;
    try { runningAllRef.current.forEach(a => a.cancel()); } catch {}
    runningAllRef.current = [];
    cancelAllAnimationsOnSlide();
    const slide = slides[currentSlideIndex];
    clearEntranceGating(slide);
  };

  const addFormContent = (
    <Form size="small" layout="vertical" style={{ maxWidth: 360 }}>
      <Row gutter={[12, 8]}>
          <Col span={12}>
            <Form.Item label="类型">
              <Select value={newKind} onChange={(v: any) => setNewKind(v)} options={[
                { label: '入场', value: 'entrance' },
                { label: '强调', value: 'emphasis' },
                { label: '退出', value: 'exit' },
              ]} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="效果">
              <Select value={newEffect} onChange={(v: any) => setNewEffect(v)} options={EFFECT_OPTIONS} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="触发">
              <Select value={newStart} onChange={(v: any) => setNewStart(v)} options={START_OPTIONS} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="方向">
              <Select value={direction} onChange={(v: any) => setDirection(v)} options={[
                { label: '上', value: 'top' },
                { label: '下', value: 'bottom' },
                { label: '左', value: 'left' },
                { label: '右', value: 'right' },
              ]} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="时长(ms)">
              <InputNumber min={100} max={10000} value={durationMs} onChange={(v: any) => setDurationMs(v || 600)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="延迟(ms)">
              <InputNumber min={0} max={5000} value={delayMs} onChange={(v: any) => setDelayMs(v || 0)} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="距离(px)">
              <InputNumber min={0} max={600} value={distancePx} onChange={(v: any) => setDistancePx(v || 120)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="角度(°)">
              <InputNumber min={0} max={1080} value={rotateDeg} onChange={(v: any) => setRotateDeg(v || 360)} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item>
              <Button type="primary" onClick={handleConfirmAdd} block>添加</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
  );

  const toolbar = (
    <>
      <Space>
        <Popover
          content={addFormContent}
          title="添加动画"
          trigger="click"
          open={popoverOpen}
          onOpenChange={(open) => setPopoverOpen(open)}
        >
          <Button style={{width: '230px', borderRadius: 0, marginBottom: 8}} icon={<PlusOutlined />} onClick={handleOpenAddPopover} disabled={!selectedElement}>添加动画</Button>
        </Popover>
      </Space>
      {!selectedElement && (
        <div>
          <Button style={{width: '110px', borderRadius: 0, marginRight: 10}} onClick={playAllTimeline}>预览全部</Button>
          <Button style={{width: '110px', borderRadius: 0}} onClick={stopAllPreview}>停止预览</Button>
        </div>
      )}
    </>
  );

  const slide = slides[currentSlideIndex];
  const animations = selectedElement ? (selectedElement.animations || []) : [];
  const orderedRefs = React.useMemo(() => {
    if (!slide) return [] as { elementId: string; animationId: string }[];
    if (Array.isArray(slide.timeline) && slide.timeline.length) {
      return slide.timeline.flatMap(step => step.animationRefs);
    }
    return slide.elements.flatMap(el => (el.animations || []).map(a => ({ elementId: el.id, animationId: a.id })));
  }, [slide]);

  return (
    <div className={styles.panel}>
      {toolbar}
      <Divider className={styles.divider} />
      {selectedElement ? (
        !animations.length ? (
          <Text type="secondary">暂无动画</Text>
        ) : (
          <div className={styles.list}>
            {animations.map((anim, idx) => (
              <div key={anim.id} className={styles.itemCard} title={`【${typeLabel(selectedElement?.type)}】${effectLabel(anim)}`}>
                <div className={styles.itemHeader}>
                  <span className={styles.indexBadge}>{idx + 1}</span>
                  <span className={styles.itemLabel}>【{typeLabel(selectedElement?.type)}】{effectLabel(anim)}</span>
                  <span className={styles.itemActions}>
                    <Button style={{marginRight: 8}} size="small" icon={<EyeOutlined />} onClick={() => handlePreview(anim)} />
                    {/* <Button size="small" icon={<ArrowUpOutlined />} onClick={() => reorderAnimations(selectedElementId!, idx, Math.max(0, idx - 1))} disabled={idx === 0} />
                    <Button size="small" icon={<ArrowDownOutlined />} onClick={() => reorderAnimations(selectedElementId!, idx, Math.min(animations.length - 1, idx + 1))} disabled={idx === animations.length - 1} /> */}
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => removeAnimation(selectedElementId!, anim.id)} />
                  </span>
                </div>
                <div className={styles.itemBody}>
                  <Form size="small" layout="vertical">
                    <Row gutter={[12, 8]}>
                      <Col span={12}>
                        <Form.Item label="类型">
                          <Select size="small"
                            value={anim.kind}
                            onChange={(v) => updateAnimation(selectedElementId!, anim.id, { kind: v as ElementAnimation['kind'] })}
                            options={[{ label: '入场', value: 'entrance' }, { label: '强调', value: 'emphasis' }, { label: '退出', value: 'exit' }]} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="效果">
                          <Select size="small"
                            value={anim.effect}
                            onChange={(v) => updateAnimation(selectedElementId!, anim.id, { effect: v as AnimationEffect })}
                            options={EFFECT_OPTIONS} />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item label="触发">
                          <Select size="small"
                            value={anim.startMode}
                            onChange={(v) => updateAnimation(selectedElementId!, anim.id, { startMode: v as AnimationStartMode })}
                            options={START_OPTIONS} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="方向">
                          <Select size="small"
                            value={anim.options.direction ?? 'top'}
                            onChange={(v) => updateAnimation(selectedElementId!, anim.id, { options: { ...anim.options, direction: v as any } })}
                            options={[
                              { label: '上', value: 'top' },
                              { label: '下', value: 'bottom' },
                              { label: '左', value: 'left' },
                              { label: '右', value: 'right' },
                            ]} />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item label="时长(ms)">
                          <InputNumber size="small" min={100} max={10000} value={anim.options.durationMs ?? 600}
                            onChange={(v) => updateAnimation(selectedElementId!, anim.id, { options: { ...anim.options, durationMs: v ?? 600 } })} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="延迟(ms)">
                          <InputNumber size="small" min={0} max={5000} value={anim.options.delayMs ?? 0}
                            onChange={(v) => updateAnimation(selectedElementId!, anim.id, { options: { ...anim.options, delayMs: v ?? 0 } })} />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item label="距离(px)">
                          <InputNumber size="small" min={0} max={600} value={anim.options.distancePx ?? 120}
                            onChange={(v) => updateAnimation(selectedElementId!, anim.id, { options: { ...anim.options, distancePx: v ?? 120 } })} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="角度(°)">
                          <InputNumber size="small" min={0} max={1080} value={anim.options.rotateDeg ?? 360}
                            onChange={(v) => updateAnimation(selectedElementId!, anim.id, { options: { ...anim.options, rotateDeg: v ?? 360 } })} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className={styles.compactList}>
          {orderedRefs.length ? (
            orderedRefs.map((ref, idx) => {
              const el = slide.elements.find(e => e.id === ref.elementId);
              const anim = findAnimation(slide, ref.elementId, ref.animationId);
              return (
                <div key={`${ref.elementId}-${ref.animationId}`} className={styles.compactItem}>
                  <span className={styles.indexBadge}>{idx + 1}</span>
                  <span className={styles.compactLabel}>【{typeLabel(el?.type)}】{anim ? effectLabel(anim) : '动画'}</span>
                  <span className={styles.compactActions}>
                    <Button size="small" type="text" icon={<CaretRightOutlined />} onClick={() => handlePreviewRef(ref)} />
                    <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteRef(ref)} />
                  </span>
                </div>
              );
            })
          ) : (
            <Text type="secondary">暂无时间线</Text>
          )}
        </div>
      )}
    </div>
  );
};

export default AnimationPanel;