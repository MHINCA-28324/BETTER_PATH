import { Graph } from './js/graph.js';
import { dijkstra, checkEulerianPath, checkHamiltonianPath } from './js/algorithms.js';
import { Game } from './js/game.js';

// ============================================
// GRAFO TEMÁTICO REAL: "El camino hacia el título"
// ============================================

const universityGraph = new Graph();

// Nodos: id, nombre visible, posición x/y (para cuando Robert dibuje)
universityGraph.addNode('inicio', 'Inicio', 50, 300);
universityGraph.addNode('calc1', 'Cálculo I', 200, 150);
universityGraph.addNode('calc2', 'Cálculo II', 350, 100);
universityGraph.addNode('ed', 'Ecuaciones Diferenciales', 500, 100);
universityGraph.addNode('prog1', 'Programación I', 200, 450);
universityGraph.addNode('estructuras', 'Estructuras de Datos', 350, 450);
universityGraph.addNode('discretas', 'Matemáticas Discretas', 500, 450);
universityGraph.addNode('fisica1', 'Física I', 350, 250);
universityGraph.addNode('fisica2', 'Física II', 500, 250);
universityGraph.addNode('algebra', 'Álgebra Lineal', 650, 350);
universityGraph.addNode('proyecto', 'Proyecto Final', 800, 300);
universityGraph.addNode('titulo', 'Título de Ingeniero', 950, 300);

// Aristas: from, to, peso (ej. créditos o "dificultad")
universityGraph.addEdge('inicio', 'calc1', 3);
universityGraph.addEdge('inicio', 'prog1', 3);
universityGraph.addEdge('calc1', 'calc2', 4);
universityGraph.addEdge('calc1', 'fisica1', 3);
universityGraph.addEdge('calc2', 'ed', 4);
universityGraph.addEdge('prog1', 'estructuras', 3);
universityGraph.addEdge('estructuras', 'discretas', 3);
universityGraph.addEdge('fisica1', 'fisica2', 4);
universityGraph.addEdge('discretas', 'algebra', 3);
universityGraph.addEdge('fisica2', 'algebra', 2);
universityGraph.addEdge('ed', 'proyecto', 5);
universityGraph.addEdge('algebra', 'proyecto', 5);
universityGraph.addEdge('proyecto', 'titulo', 1);

// ============================================
// PRUEBAS SOBRE EL GRAFO TEMÁTICO
// ============================================

console.log('--- RUTA MÁS CORTA: Inicio → Título ---');
console.log(dijkstra(universityGraph, 'inicio', 'titulo'));

console.log('\n--- ¿CAMINO EULERIANO? ---');
console.log(checkEulerianPath(universityGraph));

console.log('\n--- ¿CAMINO HAMILTONIANO? ---');
console.log(checkHamiltonianPath(universityGraph));

console.log('\n--- SIMULACIÓN DE PARTIDA ---');
const game = new Game(universityGraph, 'inicio', 'titulo');
console.log('Estado inicial:', game.getState());
console.log('Jugador 1 mueve a calc1:', game.movePlayer('player1', 'calc1'));
console.log('IA (player2) juega:', game.playAITurn());