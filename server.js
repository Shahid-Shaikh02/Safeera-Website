// server.js
const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.json()); // to parse JSON in POST requests
app.use(express.static('public')); // to serve enquiry.html and other files

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
