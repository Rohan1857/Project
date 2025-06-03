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

// More secure CORS config
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://project-mbtl.vercel.app' 
  ],
  credentials: true, // Only if you use cookies/auth headers
}));

app.use(express.json());

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI); // no callback
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
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
