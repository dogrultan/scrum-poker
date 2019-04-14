const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

// Serve as a primitive database
// Ideally we can use a NoSQL database, and store storyList as collections
// and votes as documents in map format, i.e. { voter1: 3, voter2: 8, ...}
let storyList = [];
let votes = [];

app.use(cors());
app.use(express.json());

// Propagate current story list
app.post('/poker-planning-view-as-developer/:sessionName', (req, res) => {
  storyList = req.body;
});

// Get current story list
app.get('/poker-planning-view-as-developer/:sessionName', (req, res) => {
  res.send(storyList);
});

app.get(
  '/poker-planning-view-as-developer/:sessionName/developers/:id',
  (req, res) => {
    res.send(storyList);
  }
);

// Add new vote controller
app.post(
  '/poker-planning-view-as-developer/:sessionName/developers/:id',
  (req, res) => {
    // Add if voter with current id has not voted yet
    !votes.find(obj => obj.id === req.body.id) && votes.push(req.body);
  }
);

// Get current story list
app.get('/poker-planning-view-as-scrum-master/:sessionName', (req, res) => {
  res.send(storyList);
});

// Proceed with next story
app.post('/poker-planning-view-as-scrum-master/:sessionName', (req, res) => {
  storyList = req.body;
  votes = [];
});

// Get current votes
app.get('/vote-mapping', (req, res) => {
  res.send(votes);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
