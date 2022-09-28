const fs = require('fs');
const path = require('path');

const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

// const { notes } = require('./db/db');
let data;
let notes;

app.use(express.static('public'));
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

fs.readFile("./db/db.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("Error reading file from disk:", err);
    return;
  }
  try {
    data = JSON.parse(jsonString);
    notes = data.notes;
    //console.log(notes);
  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
});

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    return note;
  }

app.get('/api/notes', (req, res) => {
  let results = notes;
  res.json(results);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
  });
app.post('/api/notes', (req, res) => {
  // set id based on what the next index of the array will be

  req.body.id = notes.length.toString();
  const note = createNewNote(req.body, notes);

  console.log(req.body);
  res.json(note);

});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});