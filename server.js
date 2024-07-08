// const express = require('express');
// const sqlite3 = require('sqlite3').verbose();
// const bodyParser = require('body-parser');
// const path = require('path');

// const app = express();
// const db = new sqlite3.Database(':memory:'); // In-memory database

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Serve static files (HTML, CSS, JS)
// app.use(express.static(path.join(__dirname, 'public')));

// // Create a table to store inputs
// db.serialize(() => {
//   db.run("CREATE TABLE inputs (plaintext TEXT, key TEXT)");
// });

// // Vigenère cipher functions
// function generateKey(plaintext, key) {
//   key = key.split('');
//   if (plaintext.length === key.length) return key.join('');
//   for (let i = 0; i < plaintext.length - key.length; i++) {
//     key.push(key[i % key.length]);
//   }
//   return key.join('');
// }

// function cipherText(plaintext, key) {
//   let cipher_text = [];
//   for (let i = 0; i < plaintext.length; i++) {
//     let x = (plaintext.charCodeAt(i) + key.charCodeAt(i)) % 26;
//     x += 'A'.charCodeAt(0);
//     cipher_text.push(String.fromCharCode(x));
//   }
//   return cipher_text.join('');
// }

// // Endpoint to handle input and generate cipher
// app.post('/cipher', (req, res) => {
//   const plaintext = req.body.plaintext.toUpperCase().replace(/ /g, '');
//   const key = req.body.key.toUpperCase().replace(/ /g, '');

//   const extendedKey = generateKey(plaintext, key);
//   const cipher = cipherText(plaintext, extendedKey);

//   // Store inputs in the database
//   db.run("INSERT INTO inputs (plaintext, key) VALUES (?, ?)", [plaintext, key], function(err) {
//     if (err) {
//       return console.error(err.message);
//     }
//   });

//   res.json({ plaintext, key: extendedKey, ciphertext: cipher });
// });

// // Serve the HTML file
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database(':memory:'); // In-memory database

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Create a table to store inputs
db.serialize(() => {
  db.run("CREATE TABLE inputs (plaintext TEXT, key TEXT)");
});

// Vigenère cipher functions
function generateKey(plaintext, key) {
  key = key.split('');
  if (plaintext.length === key.length) return key.join('');
  for (let i = 0; i < plaintext.length - key.length; i++) {
    key.push(key[i % key.length]);
  }
  return key.join('');
}

function cipherText(plaintext, key) {
  let cipher_text = [];
  for (let i = 0; i < plaintext.length; i++) {
    let x = (plaintext.charCodeAt(i) - 'A'.charCodeAt(0) + key.charCodeAt(i) - 'A'.charCodeAt(0)) % 26;
    x += 'A'.charCodeAt(0);
    cipher_text.push(String.fromCharCode(x));
  }
  return cipher_text.join('');
}

// Endpoint to handle input and generate cipher
app.post('/cipher', (req, res) => {
  const plaintext = req.body.plaintext.toUpperCase().replace(/ /g, '');
  const key = req.body.key.toUpperCase().replace(/ /g, '');

  const extendedKey = generateKey(plaintext, key);
  const cipher = cipherText(plaintext, extendedKey);

  // Store inputs in the database
  db.run("INSERT INTO inputs (plaintext, key) VALUES (?, ?)", [plaintext, key], function(err) {
    if (err) {
      return console.error(err.message);
    }
  });

  res.json({ plaintext, key: extendedKey, ciphertext: cipher });
});

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
