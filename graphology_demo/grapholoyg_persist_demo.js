const fs = require('fs');
const Graph = require('graphology');

// Create a new directed graph
const graph = new Graph({ type: 'directed' });

// Add nodes with properties
graph.addNode('A', { label: 'Node A', category: 'example' });
graph.addNode('B', { label: 'Node B', category: 'example' });

// Add edges with properties
graph.addEdgeWithKey('AB', 'A', 'B', { label: 'Knows', weight: 0.5 });

// Serialize the graph data
const serializedGraph = graph.export();

// Write the serialized data to a file
const filePath = 'graph_data.json';
fs.writeFileSync(filePath, JSON.stringify(serializedGraph, null, 2));

console.log('Graph data written to', filePath);
