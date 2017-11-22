const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo/technopark', { useMongoClient: true });

const taskSchema = mongoose.Schema({ name: String, done: Boolean });
const Task = mongoose.model('Task', taskSchema);

var db = mongoose.connection;
db.on('error', () => console.error('connection error:'));
db.once('open', function() {
  console.info('connected to database');
});

const app = express();

app.use(bodyParser.json());

app.get('/tasks/', (req, res) => {
  Task.find().lean().exec((err, tasks) => {
    res
      .header({'Content-Type': 'application/json'})
      .send(JSON.stringify(tasks))
      .end();
  });
});

app.post('/tasks/', (req, res) => {
  console.log('requested', req.body)
  const task = new Task(req.body);
  task.save((err, task) => {
    if (err) {
      console.log('cant save', err);
      res.status(500).end();
      return;
    }

    console.log('saved new task');
    res.status(200).end();
  });
});

app.put('/tasks/:id', (req, res) => {
  console.log('requested', req.params)
  const task = Task.findById(req.params.id, (err, task) => {
    task.done = true;
    Task.update({_id: req.params.id}, task, () => {
      res.end();
    });
  })

});

app.use('*', (req, res) => {
  res
    .status(404)
    .header({'Content-Type': 'application/json'})
    .send(JSON.stringify({message: 'not found'}))
    .end()
})

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🤖  listening on :${PORT}`);
})
