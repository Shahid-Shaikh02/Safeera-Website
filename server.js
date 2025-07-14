// server.js
const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');

const express = require('express');
const app = express();
const path = require('path');

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Default route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Optional: handle other pages (e.g., product.html)
app.get('/product.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'product.html'));
});

app.get('/contact.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/contact.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/contact.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'whyus.html'));
});

const axios = require('axios'); // axios is required at the top

// // Store form data to Oracle DB
// app.post('/submit-enquiry', async (req, res) => {
//   let { name, phone, email, subject, message, recaptchaToken } = req.body;

//   // ✅ 1. Verify reCAPTCHA token
//   const secretKey = '6Lf6wFcrAAAAAOnnepQ1OS9mpZzHQGIftP6SQWW2'; // your secret key
//   try {
//     const captchaVerify = await axios.post(
//       `https://www.google.com/recaptcha/api/siteverify`,
//       null,
//       {
//         params: {
//           secret: secretKey,
//           response: recaptchaToken,
//         },
//       }
//     );

//     if (!captchaVerify.data.success) {
//       return res.status(400).json({ message: 'reCAPTCHA failed. Please verify.' });
//     }
//   } catch (captchaError) {
//     console.error('reCAPTCHA error:', captchaError);
//     return res.status(500).json({ message: 'reCAPTCHA verification failed' });
//   }

//   // ✅ 2. Format phone number (add space after country code)
//   const match = phone.match(/^(\+\d{1,4})([0-9]{10})$/);
//   if (match) {
//     phone = `${match[1]} ${match[2]}`;
//   }

//   // ✅ 3. Save to Oracle
//   try {
//     const connection = await oracledb.getConnection(dbConfig);
//     await connection.execute(
//       `INSERT INTO enquiries (name, phone, email, subject, message) VALUES (:name, :phone, :email, :subject, :message)`,
//       { name, phone, email, subject, message },
//       { autoCommit: true }
//     );
//     await connection.close();
//     res.json({ message: 'Thank you for your message!' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Database error' });
//   }
// });

// Server port for local or production (like Railway)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
