const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Routes
const itemRoutes = require('./routes/processRoutes');
app.use('/api', itemRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));