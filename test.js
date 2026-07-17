import { Graph } from './js/graph.js';
import { dijkstra } from './js/algorithms.js';

const g = new Graph();
g.addNode('A', 'Casa');
g.addNode('B', 'Parque');
g.addNode('C', 'Universidad');
g.addEdge('A', 'B', 4);
g.addEdge('B', 'C', 2);
g.addEdge('A', 'C', 10);

const resultado = dijkstra(g, 'A', 'C');
console.log(resultado);

import { checkEulerianPath } from './js/algorithms.js';

// Grafo con circuito euleriano (todos los nodos grado par)
const g2 = new Graph();
g2.addNode('A', 'A'); g2.addNode('B', 'B'); g2.addNode('C', 'C');
g2.addEdge('A', 'B'); g2.addEdge('B', 'C'); g2.addEdge('C', 'A');

console.log('Circuito esperado:', checkEulerianPath(g2));

// Grafo sin euleriano (3 nodos de grado impar, más de 2)
const g3 = new Graph();
g3.addNode('A','A'); g3.addNode('B','B'); g3.addNode('C','C'); g3.addNode('D','D');
g3.addEdge('A','B'); g3.addEdge('A','C'); g3.addEdge('A','D');

console.log('No debería existir:', checkEulerianPath(g3));