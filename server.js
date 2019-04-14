const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

// Serve as a primitive database
let activeStoryList = [];
const votes = [];

app.use(cors());
app.use(express.json());

app.get('/poker-planning-add-story-list', (req, res) => {
  res.send({ server: 'Hello, backend!' });
});

app.post('/poker-planning-view-as-developer/:sessionName', (req, res) => {
  activeStoryList = req.body;
});

app.get('/poker-planning-view-as-developer/:sessionName', (req, res) => {
  res.send(activeStoryList);
});

app.post(
  '/poker-planning-view-as-developer/:sessionName/developers/:id',
  (req, res) => {
    !votes.find(obj => obj.id === req.body.id) && votes.push(req.body);
  }
);

app.get('/poker-planning-view-as-scrum-master/:sessionName', (req, res) => {
  res.send(activeStoryList);
});

app.get('/vote-mapping', (req, res) => {
  res.send(votes);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
