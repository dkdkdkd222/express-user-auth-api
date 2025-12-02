const express = require('express')
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const userRoutes = require('./routes/user-routes')

// Connecting Mongo db
mongoose
.connect(process.env.MONGO_URI)
.then(()=> console.log('Mongo db is connected'))
.catch((e) => console.log(e)) 

// Using the middleware
app.use(express.json())


// Get user routes
app.use('/user', userRoutes);
// Starting the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${process.env.PORT}`)
})