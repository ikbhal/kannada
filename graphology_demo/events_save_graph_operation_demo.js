const fs = require('fs');
const Graph = require('graphology');
const { EventEmitter } = require('events');
const path = require('path');

// Create a new graph
const graph = new Graph({ type: 'directed' });

// Add nodes with properties
graph.addNode('A', { label: 'Node A', category: 'example' });
graph.addNode('B', { label: 'Node B', category: 'example' });

// Add edges with properties
graph.addEdgeWithKey('AB', 'A', 'B', { label: 'Knows', weight: 0.5 });

// Create an event emitter
const eventEmitter = new EventEmitter();

// Listener function to save graph data to a file
function saveGraphToFile(filePath) {
    const serializedGraph = graph.export();
    fs.writeFileSync(filePath, JSON.stringify(serializedGraph, null, 2));
    console.log('Graph data written to', filePath);
}

// Listen for a custom event 'saveGraph' and call the listener function
eventEmitter.on('saveGraph', saveGraphToFile);

// Simulate sending an event
const filepath = path.join(__dirname, 'graph_data2.json');
eventEmitter.emit('saveGraph', filepath); // Pass the file path as an argument

// Example: Accessing node attributes in the graph
graph.forEachNode((node, attributes) => {
    console.log(`Node ${node}:`, attributes);
});

// Example: Accessing edge attributes in the graph
graph.forEachEdge((edge, attributes, source, target) => {
    console.log(`Edge ${edge} from ${source} to ${target}:`, attributes);
});
