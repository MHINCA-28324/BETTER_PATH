// main.js
// Punto de entrada: conecta el grafo, el juego y el render con los eventos del DOM.

import { Graph } from './graph.js';
import { dijkstra, checkEulerianPath, checkHamiltonianPath } from './algorithms.js';
import { Game } from './game.js';
import { drawGraph, drawPlayers, spritesReady, animateJump } from './render.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resultadoDiv = document.getElementById('resultado');
const turnIndicator = document.getElementById('turn-indicator');

// --- Grafo temático ---
function buildGraph() {
  const g = new Graph();
  g.addNode('inicio', 'Inicio', 60, 300, 'obligatoria');
  g.addNode('calc1', 'Cálculo I', 220, 150, 'obligatoria');
  g.addNode('calc2', 'Cálculo II', 380, 100, 'obligatoria');
  g.addNode('ed', 'Ecuaciones Dif.', 540, 100, 'optativa');
  g.addNode('prog1', 'Programación I', 220, 450, 'obligatoria');
  g.addNode('estructuras', 'Estructuras de Datos', 380, 450, 'obligatoria');
  g.addNode('discretas', 'Mate. Discretas', 540, 450, 'obligatoria');
  g.addNode('fisica1', 'Física I', 380, 250, 'obligatoria');
  g.addNode('fisica2', 'Física II', 540, 250, 'optativa');
  g.addNode('algebra', 'Álgebra Lineal', 700, 350, 'electiva');
  g.addNode('proyecto', 'Proyecto Final', 850, 300, 'obligatoria');
  g.addNode('titulo', 'Título Ingeniero', 950, 300, 'meta');

  g.addEdge('inicio', 'calc1', 3);
  g.addEdge('inicio', 'prog1', 3);
  g.addEdge('calc1', 'calc2', 4);
  g.addEdge('calc1', 'fisica1', 3);
  g.addEdge('calc2', 'ed', 4);
  g.addEdge('prog1', 'estructuras', 3);
  g.addEdge('estructuras', 'discretas', 3);
  g.addEdge('fisica1', 'fisica2', 4);
  g.addEdge('discretas', 'algebra', 3);
  g.addEdge('fisica2', 'algebra', 2);
  g.addEdge('ed', 'proyecto', 5);
  g.addEdge('algebra', 'proyecto', 5);
  g.addEdge('proyecto', 'titulo', 1);

  return g;
}

let graph = buildGraph();
let game = new Game(graph, 'inicio', 'titulo');
let currentHighlightPath = [];

function render() {
  drawGraph(ctx, graph, currentHighlightPath);
  drawPlayers(ctx, graph, game.players);
  turnIndicator.textContent = game.winner
    ? `¡Ganó ${game.winner}!`
    : `Turno de: ${game.turn}`;
}

// --- Eventos de botones ---
document.getElementById('btn-calcular-ruta').addEventListener('click', () => {
  const result = dijkstra(graph, 'inicio', 'titulo');
  currentHighlightPath = result.exists ? result.path : [];
  resultadoDiv.textContent = result.exists
    ? `Ruta más corta: ${result.path.join(' → ')} (distancia: ${result.distance})`
    : 'No existe ruta disponible.';
  render();
});

document.getElementById('btn-euleriano').addEventListener('click', () => {
  const result = checkEulerianPath(graph);
  resultadoDiv.textContent = `Euleriano: ${result.exists ? 'Sí existe (' + result.type + ')' : 'No existe'} — ${result.reason}`;
});

document.getElementById('btn-hamiltoniano').addEventListener('click', () => {
  const result = checkHamiltonianPath(graph);
  currentHighlightPath = result.exists ? result.path : [];
  resultadoDiv.textContent = result.exists
    ? `Camino hamiltoniano: ${result.path.join(' → ')}`
    : 'No existe camino hamiltoniano.';
  render();
});

document.getElementById('btn-reiniciar').addEventListener('click', () => {
  graph = buildGraph();
  game = new Game(graph, 'inicio', 'titulo');
  currentHighlightPath = [];
  resultadoDiv.textContent = '';
  render();
});

// --- Click en el canvas para mover al jugador 1 ---
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  for (const id of graph.getAllNodeIds()) {
    const node = graph.nodes.get(id);
    const dist = Math.hypot(node.x - x, node.y - y);
    if (dist <= 22) {
      const prevNode = graph.nodes.get(game.players.player1.position);
      const moveResult = game.movePlayer('player1', id);

      if (moveResult.success) {
        const targetNode = graph.nodes.get(id);
        animateJump('player1', prevNode, targetNode, render);

        resultadoDiv.textContent = moveResult.gameOver
          ? `¡Jugador 1 ganó llegando a ${id}!`
          : '';

        if (!moveResult.gameOver) {
          const prevAiNode = graph.nodes.get(game.players.player2.position);
          const aiResult = game.playAITurn();

          if (aiResult.success) {
            const aiTargetNode = graph.nodes.get(game.players.player2.position);
            animateJump('player2', prevAiNode, aiTargetNode, render);
          }

          if (aiResult.gameOver) {
            resultadoDiv.textContent = '¡La IA ganó!';
          }
        }
      } else {
        resultadoDiv.textContent = moveResult.reason;
      }

      render();
      break;
    }
  }
});

render(); // primer dibujo inmediato (con fallback si aún no cargan)
spritesReady.then(render); // redibuja cuando ya cargaron todas las imágenes

