const express = require('express');
const path = require('path');

const notesData = require('./db/db.json');
const uuid = require('./helpers/uuid');
const { stat } = require('fs');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true}));

// -------- Static pages --------
app.use(express.static('public'));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

// ------- Routes --------
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req,res) => {
    res.status(200).json(notesData);
})

app.post('/api/notes', (req,res) => {
    console.log(`New Note request recieved`);
    const { title, text } = req.body;

    if (title && text) {
        const newNoteBody = {
            title,
            text,
            note_id: uuid(),
        };

        const response = {
            status: 'success',
            body: newNoteBody,
        };

        console.log(response);
        res.status(201).json(response);
    }
    else {
        res.status(500).json('Error in creating new note');
    }
})

// ------- Port listener --------
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);