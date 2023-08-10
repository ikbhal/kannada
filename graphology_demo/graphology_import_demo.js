const fs = require('fs');
const Graph = require('graphology');

// Read the JSON file
const filePath = 'graph_data.json'; // Replace with your JSON file path
const serializedGraph = fs.readFileSync(filePath, 'utf-8');

// Parse the JSON data
const importedData = JSON.parse(serializedGraph);

// Create a new graph
const importedGraph = new Graph(importedData.options);

// Import nodes
for (const nodeData of importedData.nodes) {
    const { key, attributes } = nodeData;
    importedGraph.addNode(key, attributes);
}

// Import edges
for (const edgeData of importedData.edges) {
    const { key, source, target, attributes } = edgeData;

    // Check if both source and target nodes exist
    if (importedGraph.hasNode(source) && importedGraph.hasNode(target)) {
        // Add the edge using addEdgeWithKey
        importedGraph.addEdgeWithKey(key, source, target, attributes);
    }
}

// Example: Accessing node attributes in the imported graph
importedGraph.forEachNode((node, attributes) => {
    console.log(`Node ${node}:`, attributes);
});

// Example: Accessing edge attributes in the imported graph
importedGraph.forEachEdge((edge, attributes, source, target) => {
    console.log(`Edge ${edge} from ${source} to ${target}:`, attributes);
});
