const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'beats.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Ensure upload directory exists
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.use(express.json());
app.use('/embed-widget', express.static(path.join(__dirname, 'embed-widget')));
app.use('/uploads', express.static(UPLOAD_DIR));

// Helper to load beats
function loadBeats() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Helper to save beats
function saveBeats(beats) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(beats, null, 2));
}

// API to get beats list
app.get('/api/beats', (req, res) => {
  res.json(loadBeats());
});

// API to upload a new beat
app.post('/api/beats', upload.single('audio'), (req, res) => {
  const beats = loadBeats();
  const { title, price } = req.body;
  if (!req.file || !title || !price) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const beat = {
    id: Date.now().toString(),
    title,
    price,
    audioUrl: '/uploads/' + req.file.filename
  };
  beats.push(beat);
  saveBeats(beats);
  res.json(beat);
});

// Serve simple admin page for uploading beats
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'embed-widget/admin.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
