const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes/auth');
const routesAdmin = require('./routes/admin');
const routesCompiler = require('./routes/compiler');
const routesAI = require('./routes/ai');
const routesSubmission = require('./routes/Submission');
const app = express();


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://project-mbtl.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});


app.use(express.json());

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI); 
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

connectDB();

app.use('/api/auth', routes);
app.use('/api/admin', routesAdmin);
app.use('/api/compiler', routesCompiler);
app.use('/api/ai', routesAI);
app.use('/api/submission', routesSubmission);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
