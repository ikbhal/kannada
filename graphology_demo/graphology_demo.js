const Graph = require('graphology');

// Create a new directed graph
const graph = new Graph({ type: 'directed' });

// Add nodes with properties
graph.addNode('A', { label: 'Node A', category: 'example' });
graph.addNode('B', { label: 'Node B', category: 'example' });

// Add edges with properties
graph.addEdgeWithKey('AB', 'A', 'B', { label: 'Knows', weight: 0.5 });

// Get node attributes
const nodeA = graph.getNodeAttributes('A');
console.log('Node A:', nodeA);

// Get edge attributes
const edgeAB = graph.getEdgeAttributes('AB');
console.log('Edge AB:', edgeAB);

// Iterate over nodes
graph.forEachNode((node, attributes) => {
    console.log(`Node ${node}:`, attributes);
});

// Iterate over edges
graph.forEachEdge((edge, attributes, source, target) => {
    console.log(`Edge ${edge} from ${source} to ${target}:`, attributes);
});
