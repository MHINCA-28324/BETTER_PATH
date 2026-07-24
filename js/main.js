// main.js
import { dijkstra, checkEulerianPath, checkHamiltonianPath } from './algorithms.js';
import { Game } from './game.js';
import { drawGraph, drawPlayers, spritesReady, animateJump } from './render.js';
import { LEVELS } from './levels.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resultadoDiv = document.getElementById('resultado');
const turnIndicator = document.getElementById('turn-indicator');

const screens = {
  menu: document.getElementById('screen-menu'),
  levels: document.getElementById('screen-levels'),
  game: document.getElementById('screen-game'),
  gameover: document.getElementById('screen-gameover'),
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.style.display = 'none');
  screens[name].style.display = 'block';
}

let selectedMode = 'ai'; // 'ai' | 'local'
let graph = null;
let game = null;
let currentHighlightPath = [];

// --- Navegación de pantallas ---
document.getElementById('btn-mode-ai').addEventListener('click', () => {
  selectedMode = 'ai';
  showLevelSelect();
});

document.getElementById('btn-mode-local').addEventListener('click', () => {
  selectedMode = 'local';
  showLevelSelect();
});

document.getElementById('btn-back-menu').addEventListener('click', () => showScreen('menu'));
document.getElementById('btn-menu').addEventListener('click', () => showScreen('menu'));
document.getElementById('btn-gameover-menu').addEventListener('click', () => showScreen('menu'));

function showLevelSelect() {
  const container = document.getElementById('level-buttons');
  container.innerHTML = '';
  LEVELS.forEach((level) => {
    const btn = document.createElement('button');
    btn.className = 'menu-btn';
    btn.textContent = level.name;
    btn.addEventListener('click', () => startGame(level));
    container.appendChild(btn);
  });
  showScreen('levels');
}

function startGame(level) {
  graph = level.build();
  canvas.width = level.canvasWidth;
  canvas.height = level.canvasHeight;

  game = new Game(graph, 'inicio', 'titulo', { vsAI: selectedMode === 'ai' });
  currentHighlightPath = [];
  resultadoDiv.textContent = '';

  showScreen('game');
  render();
}

// --- Botones de análisis matemático ---
document.getElementById('btn-calcular-ruta').addEventListener('click', () => {
  const result = dijkstra(graph, 'inicio', 'titulo');
  currentHighlightPath = result.exists ? result.path : [];
  resultadoDiv.textContent = result.exists
    ? `Ruta más corta: ${result.path.join(' → ')} (créditos: ${result.distance})`
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

// --- Render principal ---
function render() {
  drawGraph(ctx, graph, currentHighlightPath);
  drawPlayers(ctx, graph, game.players);

  turnIndicator.textContent = game.winner
    ? '¡Partida terminada!'
    : `Turno de: ${game.turn === 'player1' ? 'Jugador 1' : (selectedMode === 'ai' ? 'IA' : 'Jugador 2')}`;

  const state = game.getState();
  if (!game.winner && state.player1Stuck) {
    resultadoDiv.textContent = 'Jugador 1 no tiene movimientos válidos. Partida bloqueada.';
  } else if (!game.winner && state.player2Stuck) {
    resultadoDiv.textContent = 'El rival no tiene movimientos válidos. Partida bloqueada.';
  }
}

function showGameOver() {
  const p1 = game.players.player1;
  const p2 = game.players.player2;
  const winnerLabel = game.winner === 'player1' ? 'Jugador 1' : (selectedMode === 'ai' ? 'La IA' : 'Jugador 2');

  document.getElementById('gameover-title').textContent = `¡Ganó ${winnerLabel}!`;
  document.getElementById('gameover-stats').innerHTML = `
    <p><strong>Jugador 1</strong> — Movimientos: ${p1.moves} | Créditos usados: ${p1.creditsUsed}</p>
    <p><strong>${selectedMode === 'ai' ? 'IA' : 'Jugador 2'}</strong> — Movimientos: ${p2.moves} | Créditos usados: ${p2.creditsUsed}</p>
  `;
  showScreen('gameover');
}

// --- Clic en el canvas ---
canvas.addEventListener('click', (event) => {
  if (!game || game.winner) return;

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const activePlayer = game.turn; // en modo local, ambos jugadores hacen clic; en modo IA, solo player1 debería

  if (selectedMode === 'ai' && activePlayer !== 'player1') return; // espera a que la IA juegue sola

  for (const id of graph.getAllNodeIds()) {
    const node = graph.nodes.get(id);
    const dist = Math.hypot(node.x - x, node.y - y);
    if (dist <= 22) {
      const prevNode = graph.nodes.get(game.players[activePlayer].position);
      const moveResult = game.movePlayer(activePlayer, id);

      if (moveResult.success) {
        animateJump(activePlayer, prevNode, node, render);
        resultadoDiv.textContent = '';

        if (moveResult.gameOver) {
          render();
          setTimeout(showGameOver, 500);
          break;
        }

        // Modo IA: si ahora le toca a la IA, juega automáticamente
        if (selectedMode === 'ai' && game.turn === 'player2') {
          setTimeout(() => {
            const prevAiNode = graph.nodes.get(game.players.player2.position);
            const aiResult = game.playAITurn();
            if (aiResult.success) {
              const aiTargetNode = graph.nodes.get(game.players.player2.position);
              animateJump('player2', prevAiNode, aiTargetNode, render);
              if (aiResult.gameOver) {
                render();
                setTimeout(showGameOver, 500);
              }
            }
            render();
          }, 300);
        }
      } else {
        resultadoDiv.textContent = moveResult.reason;
      }

      render();
      break;
    }
  }
});

spritesReady.then(() => {
  if (game) render();
});

showScreen('menu');