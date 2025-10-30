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
  }
];