const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://sreechandan2022:Mona_1234@ac-3tk3itq-shard-00-00.ta6j2ie.mongodb.net:27017,ac-3tk3itq-shard-00-01.ta6j2ie.mongodb.net:27017,ac-3tk3itq-shard-00-02.ta6j2ie.mongodb.net:27017/?replicaSet=atlas-dxhcap-shard-0&ssl=true&authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  otp: String
});

const User = mongoose.model('User', userSchema);

const OTP_API_KEY = 'xDMtTV6nWBj2UbA3rpF9qgkJ1KsyuNOC';

app.post('/send_otp', async (req, res) => {
  const { email } = req.body;
  try {
    const response = await axios.post('https://api.otp.dev/request', {
      recipient: email,
      originator: 'Your Company Name',
      apiKey: OTP_API_KEY
    });
    res.status(200).json({ otpToken: response.data.token, email });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending OTP');
  }
});

app.post('/verify_otp', async (req, res) => {
  const { email, otp, otpToken } = req.body;
  try {
    const response = await axios.post('https://api.otp.dev/verify', {
      recipient: email,
      otp,
      token: otpToken,
      apiKey: OTP_API_KEY
    });
    if (response.data.valid) {
      res.status(200).send('OTP verified');
    } else {
      res.status(401).send('Invalid OTP');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error verifying OTP');
  }
});

app.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, email });

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
