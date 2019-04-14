// In an ideal case, our server can be implemented in microservice architecture
// and be triggered by HTTPS calls, serving from a NoSQL database
// This implementation only works in local environment

const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

// Serve as a primitive database
// Ideally we can use a NoSQL database, and store storyList as collections
// and votes as documents in map format, i.e. { voter1: 3, voter2: 8, ...}
app.set('storyList', []);
app.set('votes', []);

app.use(cors());
app.use(express.json());

// Propagate current story list
app.post('/poker-planning-view-as-developer/:sessionName', (req, res) => {
  app.set('storyList', req.body);
});

// Get current story list
app.get('/poker-planning-view-as-developer/:sessionName', (req, res) => {
  res.send(app.get('storyList'));
});

app.get(
  '/poker-planning-view-as-developer/:sessionName/developers/:id',
  (req, res) => {
    res.send(app.get('storyList'));
  }
);

// Add new vote controller
app.post(
  '/poker-planning-view-as-developer/:sessionName/developers/:id',
  (req, res) => {
    // Add if voter with current id has not voted yet
    !app.get('votes').find(obj => obj.id === req.body.id) &&
      app.get('votes').push(req.body);
  }
);

// Get current story list
app.get('/poker-planning-view-as-scrum-master/:sessionName', (req, res) => {
  res.send(app.get('storyList'));
});

// Proceed with next story
app.post('/poker-planning-view-as-scrum-master/:sessionName', (req, res) => {
  app.set('storyList', req.body);
  app.set('votes', []);
});

// Get current votes
app.get('/vote-mapping', (req, res) => {
  res.send(app.get('votes'));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
