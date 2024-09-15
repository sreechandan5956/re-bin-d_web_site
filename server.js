const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Replace the URL with your MongoDB connection string
mongoose.connect('mongodb://localhost:27017/authDB');

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });

  try {
    await newUser.save();
    res.status(200).send('User created');
  } catch (err) {
    res.status(500).send('Error creating user');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && await bcrypt.compare(password, user.password)) {
    res.status(200).send('Login successful');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.post('/forgot_password', async (req, res) => {
  const { email } = req.body;
  // Implement logic to send reset link to email
  res.status(200).send('Reset link sent');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
