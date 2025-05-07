// backend/server.js
require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const http       = require('http');
const { Server } = require('socket.io');
const mongoose   = require('mongoose');

// your DB helper
const connectDB = require('./config/db');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: '*', methods: ['GET','POST','PUT','DELETE'] }
});

// helper to load either CJS or ESM default exports
function loadRouter(path) {
  const mod = require(path);
  return mod.default || mod;
}

// ─── MIDDLEWARES ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());         // only this JSON parser

// ─── DATABASE ─────────────────────────────────────────────────────────────────
connectDB();

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use('/api/fuel',              loadRouter('./routes/FuelRoutes.js'));
app.use('/api/points',            loadRouter('./routes/PointsRoutes.js'));
app.use('/api/payments',          loadRouter('./routes/PaymentRoutes.js'));
app.use('/api/reports',           loadRouter('./routes/ReportRoutes.js'));
app.use('/api/recycling-centers', loadRouter('./routes/recyclingCenterRoutes.js'));
app.use('/api/drivers',           loadRouter('./routes/driverRoutes.js'));
app.use('/api/trucks',            loadRouter('./routes/truckRoutes.js'));
app.use('/api/bins',              loadRouter('./routes/binRoutes.js'));
app.use('/api/auth',              loadRouter('./routes/auth.js'));
app.use('/api/education',         loadRouter('./routes/education.js'));
app.use('/api/forum',             loadRouter('./routes/forum.js'));
app.use('/api/quiz',              loadRouter('./routes/quiz.js'));

// simple health‐check
app.get('/', (req, res) => res.send('Combined Backend API is running'));

// ─── SOCKET.IO ────────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('binUpdate', (data) => io.emit('binUpdate', data));
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

// export `io` if other modules need it
module.exports = io;
