// render.js
// Dibuja el grafo, los nodos, aristas y jugadores en el canvas.
// No calcula nada de lógica — solo recibe datos y los pinta.

const CATEGORY_COLORS = {
  obligatoria: '#5dade2',
  optativa: '#af7ac5',
  electiva: '#e59866',
  meta: '#f4d03f',
};

const PLAYER_FALLBACK_COLORS = {
  player1: '#3498db',
  player2: '#2ecc71',
};

const FRAME_SIZE = 32;
const JUMP_HEIGHT = 30; // qué tan alto "salta" visualmente en píxeles

const FRAME_POSITIONS = [
  { x: 0, y: 0 },
  { x: FRAME_SIZE, y: 0 },
  { x: 0, y: FRAME_SIZE },
  { x: FRAME_SIZE, y: FRAME_SIZE },
];

// --- Carga de sprites ---
const sprites = {};
const loadPromises = [];

function loadSprite(name, path) {
  const img = new Image();
  const promise = new Promise((resolve) => {
    img.onload = () => resolve();
    img.onerror = () => {
      console.error(`No se pudo cargar el sprite: ${path} (revisa el nombre/ruta del archivo)`);
      resolve();
    };
  });
  img.src = path;
  sprites[name] = img;
  loadPromises.push(promise);
}

loadSprite('player1', 'assets/sprites/player1.png');
loadSprite('player2', 'assets/sprites/player2.png');
loadSprite('node_obligatoria', 'assets/sprites/node_obligatoria.png');
loadSprite('node_optativa', 'assets/sprites/node_optativa.png');
loadSprite('node_electiva', 'assets/sprites/node_electiva.png');
loadSprite('node_meta', 'assets/sprites/meta.png');

export const spritesReady = Promise.all(loadPromises);

function isSpriteReady(sprite) {
  return sprite && sprite.complete && sprite.naturalWidth > 0;
}

// --- Estado de animación por jugador ---
const playerAnim = {
  player1: { frame: 0, facing: 1, pos: null, rafId: null },
  player2: { frame: 0, facing: 1, pos: null, rafId: null },
};

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function animateJump(playerId, fromNode, toNode, onUpdate, duration = 450) {
  const state = playerAnim[playerId];
  if (!state || !fromNode || !toNode) return;

  if (state.rafId !== null) {
    cancelAnimationFrame(state.rafId);
    state.rafId = null;
  }

  state.facing = toNode.x < fromNode.x ? -1 : 1;

  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const eased = easeInOutQuad(t);

    const x = fromNode.x + (toNode.x - fromNode.x) * eased;
    const yBase = fromNode.y + (toNode.y - fromNode.y) * eased;
    const arc = Math.sin(t * Math.PI) * JUMP_HEIGHT;
    const y = yBase - arc;

    state.pos = { x, y };
    state.frame = Math.min(Math.floor(t * FRAME_POSITIONS.length), FRAME_POSITIONS.length - 1);

    onUpdate();

    if (t < 1) {
      state.rafId = requestAnimationFrame(step);
    } else {
      state.pos = null;
      state.frame = 0;
      state.rafId = null;
      onUpdate();
    }
  }

  state.rafId = requestAnimationFrame(step);
}

// --- Dibujo principal ---
export function drawGraph(ctx, graph, highlightPath = []) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawEdges(ctx, graph, highlightPath);
  drawNodes(ctx, graph, highlightPath);
}

function drawEdges(ctx, graph, highlightPath) {
  const edges = graph.getAllEdges();

  for (const { from, to, weight } of edges) {
    const nodeFrom = graph.nodes.get(from);
    const nodeTo = graph.nodes.get(to);
    const isHighlighted = isEdgeInPath(from, to, highlightPath);

    ctx.beginPath();
    ctx.moveTo(nodeFrom.x, nodeFrom.y);
    ctx.lineTo(nodeTo.x, nodeTo.y);
    ctx.strokeStyle = isHighlighted ? '#f4d03f' : '#666';
    ctx.lineWidth = isHighlighted ? 4 : 2;
    ctx.stroke();

    const midX = (nodeFrom.x + nodeTo.x) / 2;
    const midY = (nodeFrom.y + nodeTo.y) / 2;
    ctx.fillStyle = '#ccc';
    ctx.font = '11px sans-serif';
    ctx.fillText(weight, midX, midY);
  }
}

function isEdgeInPath(from, to, path) {
  for (let i = 0; i < path.length - 1; i++) {
    if (
      (path[i] === from && path[i + 1] === to) ||
      (path[i] === to && path[i + 1] === from)
    ) {
      return true;
    }
  }
  return false;
}

function drawNodes(ctx, graph, highlightPath) {
  for (const id of graph.getAllNodeIds()) {
    const node = graph.nodes.get(id);
    const isInPath = highlightPath.includes(id);
    const spriteKey = 'node_' + node.category;
    const sprite = sprites[spriteKey];
    const size = 44;

    if (isSpriteReady(sprite)) {
      ctx.drawImage(sprite, node.x - size / 2, node.y - size / 2, size, size);
    } else {
      ctx.beginPath();
      ctx.arc(node.x, node.y, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.obligatoria;
      ctx.fill();
    }

    if (isInPath) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, size / 2 + 3, 0, Math.PI * 2);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.fillStyle = '#fff';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(node.name, node.x, node.y + size / 2 + 14);
  }
}

export function drawPlayers(ctx, graph, players) {
  for (const [playerId, playerData] of Object.entries(players)) {
    const logicalNode = graph.nodes.get(playerData.position);
    if (!logicalNode) continue;

    const state = playerAnim[playerId] || { frame: 0, facing: 1, pos: null };
    const basePos = state.pos || logicalNode;

    const sprite = sprites[playerId];
    const offsetX = playerId === 'player1' ? -18 : 18;
    const size = 32;
    const drawX = basePos.x + offsetX - size / 2;
    const drawY = basePos.y - 45;

    if (isSpriteReady(sprite)) {
      const frame = FRAME_POSITIONS[state.frame] || FRAME_POSITIONS[0];

      ctx.save();
      if (state.facing === -1) {
        ctx.translate(drawX + size, drawY);
        ctx.scale(-1, 1);
        ctx.drawImage(sprite, frame.x, frame.y, FRAME_SIZE, FRAME_SIZE, 0, 0, size, size);
      } else {
        ctx.drawImage(sprite, frame.x, frame.y, FRAME_SIZE, FRAME_SIZE, drawX, drawY, size, size);
      }
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.arc(basePos.x + offsetX, basePos.y - 30, 8, 0, Math.PI * 2);
      ctx.fillStyle = PLAYER_FALLBACK_COLORS[playerId] || '#ffffff';
      ctx.fill();
    }
  }
}