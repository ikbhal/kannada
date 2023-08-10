const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { graph, importGraphFromJSON } = require('./graph_db'); 
const { EventEmitter } = require('events');
const eventEmitter = new EventEmitter();
eventEmitter.on('saveGraph', saveGraphToFile);

const app = express();

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'secret-key', resave: true, saveUninitialized: true }));
app.use(flash());

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// graph load from graph_data3.json
const graph_file_path = path.join(__dirname, 'graph_data3.json');
importGraphFromJSON(graph, graph_file_path);

// Routes
app.get('/', (req, res) => {
  res.render('index', { messages: req.flash('messages') , body: ''});
});

app.post('/add-date', (req, res) => {
  const { date } = req.body;
  graph.addNode(date, { type: 'date' });
  req.flash('messages', 'Date node added successfully.');

  const filepath = path.join(__dirname, 'graph_data3.json');
  eventEmitter.emit('saveGraph', graph_file_path); 

  res.redirect('/');
});

app.post('/add-video', (req, res) => {
  const { date, videoId, title, url } = req.body;

   // Set default date to current date (yyyy-mm-dd) if not provided
   if (!date) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    date = `${year}-${month}-${day}`;
  }

  // If videoId is not provided, extract from YouTube URL if available
  if (!videoId && url) {
    const youtubeRegex = /(?:youtube\.com\/.*[=/]([^/&]+)|youtu\.be\/([^/&]+))/i;
    const match = url.match(youtubeRegex);
    if (match) {
      videoId = match[1] || match[2];
    }
  }
  
  const videoNodeId = `video_${date}_${videoId}`;
  graph.addNode(videoNodeId, { type: 'video', title, url, videoId });
  graph.addEdgeWithKey(`watch_${date}_${videoId}`, date, videoNodeId, { type: 'watch' });
  req.flash('messages', 'Video node and watch edge added successfully.');

  eventEmitter.emit('saveGraph', graph_file_path);

  res.redirect('/');
});

app.get('/list-videos', (req, res) => {
  const inputDate = req.query.date;

  if (inputDate) {
    const videos = [];
    graph.forEachEdge((edge, attributes, source, target) => {
      if (source === inputDate && attributes.type === 'watch') {
        const videoNode = graph.getNodeAttributes(target);
        videos.push(videoNode);
      }
    });
    
    res.render('list_videos', { videos, inputDate , body: '', messages: []});
  } else {
    res.render('list_videos', { inputDate: '', videos: [] , body: '', messages: []});
  }
});


function saveGraphToFile(filePath) {
  const serializedGraph = graph.export();

  // Ensure the directory exists
  const directory = path.dirname(filePath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(serializedGraph, null, 2));
    console.log('Graph data written to', filePath);
  } else {
    console.log('File already exists:', filePath);
  }
}

// Listen for a custom event 'saveGraph' and call the listener function
// eventEmitter.on('saveGraph', saveGraphToFile);

// Start server
const port = 3026;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
