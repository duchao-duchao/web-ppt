export const shapes = [
  {
    type: 'circle',
    name: '圆形',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'triangle',
    name: '三角形',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <polygon points="25,5 45,40 5,40" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'diamond',
    name: '菱形',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <polygon points="25,5 45,25 25,45 5,25" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'star',
    name: '星形',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <polygon points="25,2 30,18 47,18 34,28 39,44 25,35 11,44 16,28 3,18 20,18" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'arrow-right',
    name: '右箭头',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <polygon points="5,15 5,35 35,35 35,45 45,25 35,5 35,15" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'hexagon',
    name: '六边形',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <polygon points="15,8 35,8 45,25 35,42 15,42 5,25" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'heart',
    name: '心形',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <path d="M25,42 C25,42 10,30 10,20 C10,12 15,8 22,8 C23,8 25,10 25,10 C25,10 27,8 28,8 C35,8 40,12 40,20 C40,30 25,42 25,42 Z" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'pentagon',
    name: '五边形',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <polygon points="25,5 45,18 38,42 12,42 5,18" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  // 基础几何图形
  {
    type: 'rectangle',
    name: '矩形',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <rect x="8" y="15" width="34" height="20" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'square',
    name: '正方形',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <rect x="12" y="12" width="26" height="26" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'ellipse',
    name: '椭圆',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <ellipse cx="25" cy="25" rx="20" ry="12" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'rounded-rectangle',
    name: '圆角矩形',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <rect x="8" y="15" width="34" height="20" rx="4" ry="4" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  // 箭头图形
  {
    type: 'arrow-left',
    name: '左箭头',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <polygon points="45,15 45,35 15,35 15,45 5,25 15,5 15,15" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'arrow-up',
    name: '上箭头',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <polygon points="15,45 35,45 35,15 45,15 25,5 5,15 15,15" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'arrow-down',
    name: '下箭头',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <polygon points="15,5 35,5 35,35 45,35 25,45 5,35 15,35" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'double-arrow',
    name: '双向箭头',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <polygon points="5,25 15,15 15,20 35,20 35,15 45,25 35,35 35,30 15,30 15,35" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  // 特殊图形
  {
    type: 'cloud',
    name: '云朵',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <path d="M38,30 C42,30 45,27 45,23 C45,19 42,16 38,16 C37,12 33,9 28,9 C23,9 19,12 18,16 C14,16 11,19 11,23 C11,27 14,30 18,30 L38,30 Z" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'speech-bubble',
    name: '对话框',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <path d="M8,8 L42,8 C44,8 46,10 46,12 L46,28 C46,30 44,32 42,32 L20,32 L12,40 L18,32 L10,32 C8,32 6,30 6,28 L6,12 C6,10 8,8 10,8 Z" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'thought-bubble',
    name: '思考泡泡',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <ellipse cx="28" cy="18" rx="16" ry="12" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
        <circle cx="18" cy="32" r="4" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
        <circle cx="12" cy="38" r="2" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'cross',
    name: '十字',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <polygon points="20,5 30,5 30,20 45,20 45,30 30,30 30,45 20,45 20,30 5,30 5,20 20,20" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'plus',
    name: '加号',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <path d="M23,8 L27,8 L27,23 L42,23 L42,27 L27,27 L27,42 L23,42 L23,27 L8,27 L8,23 L23,23 Z" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'minus',
    name: '减号',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <rect x="8" y="23" width="34" height="4" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'octagon',
    name: '八边形',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <polygon points="18,8 32,8 42,18 42,32 32,42 18,42 8,32 8,18" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'trapezoid',
    name: '梯形',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <polygon points="15,12 35,12 42,38 8,38" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'parallelogram',
    name: '平行四边形',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <polygon points="12,32 8,18 38,18 42,32" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'lightning',
    name: '闪电',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <polygon points="28,5 18,22 25,22 22,45 32,28 25,28" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'gear',
    name: '齿轮',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <path d="M25,15 C30,15 35,20 35,25 C35,30 30,35 25,35 C20,35 15,30 15,25 C15,20 20,15 25,15 Z M23,5 L27,5 L28,10 L32,11 L35,8 L38,11 L35,14 L36,18 L41,19 L41,23 L36,24 L35,28 L38,31 L35,34 L32,31 L28,32 L27,37 L23,37 L22,32 L18,31 L15,34 L12,31 L15,28 L14,24 L9,23 L9,19 L14,18 L15,14 L12,11 L15,8 L18,11 L22,10 Z" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  // 更多箭头图形
  {
    type: 'curved-arrow',
    name: '弯曲箭头',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <path d="M10,35 Q25,10 40,25 L35,30 L45,35 L35,40 L40,35 Q25,20 15,35" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'circular-arrow',
    name: '循环箭头',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <path d="M25,8 A17,17 0 1,1 8,25 L12,21 L8,15 L2,21 L8,25 A17,17 0 1,0 25,8" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'u-turn-arrow',
    name: 'U型箭头',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <path d="M15,40 L15,20 Q15,10 25,10 Q35,10 35,20 L35,30 L30,25 L40,30 L30,35 L35,30 L35,20 Q35,15 25,15 Q15,15 15,20 L15,40" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'arrow-up-right',
    name: '右上箭头',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <polygon points="20,40 15,35 30,20 20,20 20,10 40,10 40,30 30,30 30,20 15,35" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'arrow-down-left',
    name: '左下箭头',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <polygon points="30,10 35,15 20,30 30,30 30,40 10,40 10,20 20,20 20,30 35,15" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  // 常用符号图形
  {
    type: 'checkmark',
    name: '检查标记',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <path d="M8,25 L18,35 L42,11 L38,7 L18,27 L12,21 Z" fill="#52c41a" stroke="#389e0d" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'x-mark',
    name: 'X标记',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <path d="M15,15 L35,35 M35,15 L15,35" fill="none" stroke="#ff4d4f" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    type: 'warning',
    name: '警告',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <polygon points="25,5 45,40 5,40" fill="#faad14" stroke="#d48806" strokeWidth="1"/>
        <rect x="23" y="18" width="4" height="12" fill="white"/>
        <circle cx="25" cy="35" r="2" fill="white"/>
      </svg>
    )
  },
  {
    type: 'info',
    name: '信息',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="#1890ff" stroke="#096dd9" strokeWidth="1"/>
        <circle cx="25" cy="18" r="2" fill="white"/>
        <rect x="23" y="25" width="4" height="12" fill="white"/>
      </svg>
    )
  },
  {
    type: 'question',
    name: '问号',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="#722ed1" stroke="#531dab" strokeWidth="1"/>
        <path d="M20,20 Q20,15 25,15 Q30,15 30,20 Q30,23 25,25 L25,28" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="25" cy="33" r="1.5" fill="white"/>
      </svg>
    )
  },
  // 流程图专用图形
  {
    type: 'process-rectangle',
    name: '流程矩形',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <rect x="5" y="15" width="40" height="20" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'decision-diamond',
    name: '决策菱形',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <polygon points="25,8 42,25 25,42 8,25" fill="#faad14" stroke="#d48806" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'start-end-oval',
    name: '开始/结束椭圆',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <ellipse cx="25" cy="25" rx="20" ry="12" fill="#52c41a" stroke="#389e0d" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'document',
    name: '文档',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <path d="M10,8 L35,8 L40,13 L40,42 L10,42 Z M35,8 L35,13 L40,13" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'database',
    name: '数据库',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <ellipse cx="25" cy="12" rx="18" ry="6" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
        <path d="M7,12 L7,38 Q7,44 25,44 Q43,44 43,38 L43,12" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
        <ellipse cx="25" cy="25" rx="18" ry="3" fill="none" stroke="#1677ff" strokeWidth="1"/>
        <ellipse cx="25" cy="32" rx="18" ry="3" fill="none" stroke="#1677ff" strokeWidth="1"/>
      </svg>
    )
  },
  // 装饰性图形
  {
    type: 'flower',
    name: '花朵',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <circle cx="25" cy="15" r="6" fill="#ff85c0" stroke="#f759ab" strokeWidth="1"/>
        <circle cx="35" cy="25" r="6" fill="#ff85c0" stroke="#f759ab" strokeWidth="1"/>
        <circle cx="25" cy="35" r="6" fill="#ff85c0" stroke="#f759ab" strokeWidth="1"/>
        <circle cx="15" cy="25" r="6" fill="#ff85c0" stroke="#f759ab" strokeWidth="1"/>
        <circle cx="25" cy="25" r="4" fill="#faad14" stroke="#d48806" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'leaf',
    name: '叶子',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <path d="M25,40 Q15,30 15,20 Q15,10 25,10 Q35,10 35,20 Q35,30 25,40 Z M25,40 Q25,25 35,20" fill="#52c41a" stroke="#389e0d" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'sun',
    name: '太阳',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="8" fill="#faad14" stroke="#d48806" strokeWidth="1"/>
        <g stroke="#faad14" strokeWidth="2" strokeLinecap="round">
          <line x1="25" y1="5" x2="25" y2="10"/>
          <line x1="25" y1="40" x2="25" y2="45"/>
          <line x1="5" y1="25" x2="10" y2="25"/>
          <line x1="40" y1="25" x2="45" y2="25"/>
          <line x1="11.5" y1="11.5" x2="15" y2="15"/>
          <line x1="35" y1="35" x2="38.5" y2="38.5"/>
          <line x1="11.5" y1="38.5" x2="15" y2="35"/>
          <line x1="35" y1="15" x2="38.5" y2="11.5"/>
        </g>
      </svg>
    )
  },
  {
    type: 'moon',
    name: '月亮',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <path d="M30,8 A18,18 0 1,0 30,42 A15,15 0 1,1 30,8 Z" fill="#722ed1" stroke="#531dab" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'house',
    name: '房子',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <polygon points="25,8 8,22 8,42 42,42 42,22" fill="#4096ff" stroke="#1677ff" strokeWidth="1"/>
        <rect x="20" y="30" width="10" height="12" fill="#faad14" stroke="#d48806" strokeWidth="1"/>
        <rect x="30" y="20" width="6" height="6" fill="#faad14" stroke="#d48806" strokeWidth="1"/>
      </svg>
    )
  },
  {
    type: 'tree',
    name: '树',
    svg: (
      <svg width="20" height="20" viewBox="0 0 50 50">
        <rect x="22" y="35" width="6" height="10" fill="#8b4513" stroke="#654321" strokeWidth="1"/>
        <circle cx="25" cy="20" r="12" fill="#52c41a" stroke="#389e0d" strokeWidth="1"/>
        <circle cx="18" cy="25" r="8" fill="#52c41a" stroke="#389e0d" strokeWidth="1"/>
        <circle cx="32" cy="25" r="8" fill="#52c41a" stroke="#389e0d" strokeWidth="1"/>
      </svg>
    )
  }
];