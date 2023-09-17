
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rolerouter=require('./routers/roles.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors=require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/roles',rolerouter)
const url = 'mongodb://127.0.0.1:27017/test1';
async function connectToMongoDB() {
    try {
      // Use Mongoose to connect to MongoDB
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }
  connectToMongoDB();

  const secretKey = 'your-secret-key';

  // Replace with your user database
  const users = [];
  
  app.post('/signup', async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = {
        username,
        password: hashedPassword,
      };
  
      users.push(newUser);
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
  
      const user = users.find((u) => u.username === username);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
  
      const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ token });
      // console.log( token);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

















app.listen(3000,()=>{

console.log("server started");

});