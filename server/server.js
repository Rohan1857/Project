const express= require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()
const routes = require('./routes/auth');
const routesAdmin = require('./routes/admin');
const routesCompiler = require('./routes/compiler');
const routesAI = require('./routes/ai');
const routesSubmission = require('./routes/Submission');
const app = express();
app.use(cors());
app.use(express.json())


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
app.listen(5000, () => {
    console.log("Server is running on port 3000");
})