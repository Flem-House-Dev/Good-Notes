const express = require('express');
const path = require('path');
const fs = require('fs');

const notesData = require('./db/db.json');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

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
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req,res) => {
    res.status(200).json(notesData);
})

app.post('/api/notes',  (req,res) => {
    console.log(`New Note request recieved`);
    const { title, text } = req.body;

    const existingDb =  fs.readFileSync('./db/db.json');
    const jsonData = JSON.parse(existingDb);

    if (title && text) {
        const newNoteBody = {
            title,
            text,
            id: uuid(),
        };

        jsonData.push(newNoteBody);

        const noteString = JSON.stringify(jsonData, null,2);

        fs.writeFile('./db/db.json', noteString, (err) => {
            if (err) {
                console.error('Error writing file', err);
            } else {
                console.log('Note database has been updated');
            }
        });

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

app.delete(`/api/notes/:id`, (req,res) => {
    const noteId = req.params.id;
    const notes = JSON.parse(fs.readFileSync('./db/db.json'));
    const updateNotes = notes.filter(note => note.id !== noteId);

    fs.writeFileSync('./db/db.json', JSON.stringify(updateNotes, null, 2), 'utf-8');
    res.json({ message: "Note deleted successfully"});
});

// ------- Port listener --------
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));