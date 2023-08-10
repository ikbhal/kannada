const Graph = require('graphology');
const fs = require('fs');

// Create a new graph
const learningMaterialGraph = new Graph({ type: 'mixed' });

// Function to add a date node
function addDateNode(date) {
  learningMaterialGraph.addNode(date, { type: 'date' });
}

// Function to add a video node
function addVideoNode(date, videoId, title, url) {
  const videoNodeId = `video_${date}_${videoId}`;
  learningMaterialGraph.addNode(videoNodeId, { type: 'video', title, url, videoId });
  learningMaterialGraph.addEdge(`watch_${date}_${videoId}`, date, videoNodeId, { type: 'watch' });
}

// Add your own functions for web pages and audio nodes here

// Example: Adding nodes and edges
// addDateNode('2023-08-10');
// addVideoNode('2023-08-10', 'abc123', 'Introduction to Kannada', 'https://youtube.com/abc123');
// Add more nodes and edges as needed

// Export the graph

function importGraphFromJSON(graph, filePath) {

   // Check if the file exists
   if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return;
  }
  // Read the JSON file
  const serializedGraph = fs.readFileSync(filePath, 'utf-8');

  // Parse the JSON data
  const importedData = JSON.parse(serializedGraph);

  // Set graph options if available
  if (importedData.options) {
    graph.import(importedData.options);
  }

  // Import nodes
  for (const nodeData of importedData.nodes) {
    const { key, attributes } = nodeData;
    graph.addNode(key, attributes);
  }

  // Import edges
  for (const edgeData of importedData.edges) {
    const { key, source, target, attributes } = edgeData;

    // Check if both source and target nodes exist
    if (graph.hasNode(source) && graph.hasNode(target)) {
      // Add the edge using addEdgeWithKey
      graph.addEdgeWithKey(key, source, target, attributes);
    }
  }
}

module.exports = {
  graph: learningMaterialGraph,
  importGraphFromJSON
}
