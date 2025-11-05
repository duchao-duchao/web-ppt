import { v4 as uuidv4 } from 'uuid';

export const initialSlides = [
    // 封面：全屏背景图 + 半透明标题卡片
    {
        id: uuidv4(),
        background: {
        color: '#000000',
        image: 'https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1200&q=60'
        },
        elements: [
        {
            id: uuidv4(),
            type: 'shape',
            content: 'rounded-rectangle',
            x: 80,
            y: 140,
            width: 640,
            height: 180,
            style: {
            fill: 'rgba(255,255,255,0.85)',
            stroke: 'transparent',
            strokeWidth: 0
            }
        },
        {
            id: uuidv4(),
            type: 'text',
            content: '精美演示模板',
            x: 100,
            y: 160,
            width: 600,
            height: 70,
            style: {
            fontSize: 44,
            fontWeight: 'bold',
            color: '#111111',
            textAlign: 'center'
            }
        },
        {
            id: uuidv4(),
            type: 'text',
            content: '图文展示 · 极简风格',
            x: 100,
            y: 230,
            width: 600,
            height: 50,
            style: {
            fontSize: 20,
            color: '#555555',
            textAlign: 'center'
            }
        }
        ]
    },
    // 文本+图片版式：左图右文
    {
        id: uuidv4(),
        background: {
        color: '#f7f9fc'
        },
        elements: [
        {
            id: uuidv4(),
            type: 'image',
            content: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1000&q=60',
            x: 60,
            y: 80,
            width: 360,
            height: 240,
            style: {}
        },
        {
            id: uuidv4(),
            type: 'shape',
            content: 'rounded-rectangle',
            x: 440,
            y: 80,
            width: 300,
            height: 240,
            style: {
            fill: '#ffffff',
            stroke: '#e0e4ef',
            strokeWidth: 1
            }
        },
        {
            id: uuidv4(),
            type: 'text',
            content: '产品亮点',
            x: 460,
            y: 100,
            width: 260,
            height: 40,
            style: {
            fontSize: 26,
            fontWeight: 'bold',
            color: '#111111'
            }
        },
        {
            id: uuidv4(),
            type: 'text',
            content: '• 高质感视觉',
            x: 460,
            y: 150,
            width: 260,
            height: 28,
            style: {
            fontSize: 16,
            color: '#444444'
            }
        },
        {
            id: uuidv4(),
            type: 'text',
            content: '• 响应式布局',
            x: 460,
            y: 182,
            width: 260,
            height: 28,
            style: {
            fontSize: 16,
            color: '#444444'
            }
        },
        {
            id: uuidv4(),
            type: 'text',
            content: '• 易于编辑',
            x: 460,
            y: 214,
            width: 260,
            height: 28,
            style: {
            fontSize: 16,
            color: '#444444'
            }
        }
        ]
    },
    // 图片集锦：三张图片横排
    {
        id: uuidv4(),
        background: {
        color: '#ffffff'
        },
        elements: [
        {
            id: uuidv4(),
            type: 'text',
            content: '图片集锦',
            x: 60,
            y: 50,
            width: 680,
            height: 50,
            style: {
            fontSize: 32,
            fontWeight: 'bold',
            color: '#111111'
            }
        },
        {
            id: uuidv4(),
            type: 'shape',
            content: 'rectangle',
            x: 60,
            y: 100,
            width: 120,
            height: 4,
            style: {
            fill: '#1677ff',
            stroke: 'transparent',
            strokeWidth: 0
            }
        },
        {
            id: uuidv4(),
            type: 'image',
            content: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60',
            x: 60,
            y: 140,
            width: 200,
            height: 140,
            style: {}
        },
        {
            id: uuidv4(),
            type: 'image',
            content: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60',
            x: 300,
            y: 140,
            width: 200,
            height: 140,
            style: {}
        },
        {
            id: uuidv4(),
            type: 'image',
            content: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=800&q=60',
            x: 540,
            y: 140,
            width: 200,
            height: 140,
            style: {}
        }
        ]
    }
]