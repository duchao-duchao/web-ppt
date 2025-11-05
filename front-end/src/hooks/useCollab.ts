import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { usePresentationStore } from '@/stores/presentationStore';

// 简易协同：通过 Socket.IO 同步整体文档状态
export function useCollab() {
  const loadState = usePresentationStore(state => state.loadState);
  const socketRef = useRef<Socket | null>(null);
  const isApplyingRemoteRef = useRef(false);

  // 建立连接并加载初始文档
  useEffect(() => {
    const socket = io('http://localhost:3001', { transports: ['websocket'] });
    socketRef.current = socket;

    fetch('http://localhost:3001/api/presentation')
      .then(res => res.json())
      .then(doc => {
        isApplyingRemoteRef.current = true;
        loadState(doc);
        setTimeout(() => { isApplyingRemoteRef.current = false; }, 50);
      })
      .catch(() => {});

    socket.on('state', (doc: any) => {
      isApplyingRemoteRef.current = true;
      loadState(doc);
      setTimeout(() => { isApplyingRemoteRef.current = false; }, 50);
    });

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [loadState]);

  // 监听状态变更并广播
  useEffect(() => {
    const unsub = (usePresentationStore as any).subscribe((state: any) => {
      if (isApplyingRemoteRef.current) return;
      const payload = {
        slides: state.slides,
        currentSlideIndex: state.currentSlideIndex,
        name: state.name,
      };
      socketRef.current?.emit('state', payload);
    });
    return unsub;
  }, []);
}