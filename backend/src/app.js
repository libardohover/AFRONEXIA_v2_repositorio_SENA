const express = require('express');
const cors = require('cors');
require('dotenv').config();

const crudRoutes = require('./routes/crud.routes');
const aiRoutes = require('./routes/ai.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1', crudRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ia', aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 Servidor AFRONEXIA corriendo en http://localhost:' + PORT);
});