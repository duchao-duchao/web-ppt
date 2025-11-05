const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'presentation.json');

// 初始化数据文件
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initialDoc = {
      name: '协同演示',
      currentSlideIndex: 0,
      slides: [],
      updatedAt: Date.now(),
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialDoc, null, 2));
  }
}

function readDoc() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return { name: '协同演示', currentSlideIndex: 0, slides: [], updatedAt: Date.now() };
  }
}

function writeDoc(doc) {
  ensureDataFile();
  const next = { ...doc, updatedAt: Date.now() };
  fs.writeFileSync(DATA_FILE, JSON.stringify(next, null, 2));
  return next;
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

app.use(cors());
app.use(express.json());

// REST: 获取当前文档
app.get('/api/presentation', (req, res) => {
  const doc = readDoc();
  res.json(doc);
});

// REST: 覆盖保存文档（非增量，便于演示）
app.post('/api/presentation', (req, res) => {
  const doc = req.body || {};
  const next = writeDoc(doc);
  io.emit('state', next); // 广播最新状态
  res.json({ ok: true });
});

// Socket.IO：协同广播
io.on('connection', (socket) => {
  const doc = readDoc();
  socket.emit('state', doc);

  socket.on('state', (incoming) => {
    if (!incoming || typeof incoming !== 'object') return;
    const merged = { ...doc, ...incoming };
    const next = writeDoc(merged);
    socket.broadcast.emit('state', next); // 广播给其他客户端
  });

  socket.on('disconnect', () => {
    // no-op
  });
});

server.listen(PORT, () => {
  console.log(`web-ppt backend listening on http://localhost:${PORT}`);
});