// render.js
// Dibuja el grafo, los nodos, aristas y jugadores en el canvas.
// No calcula nada de lógica — solo recibe datos y los pinta.

const CATEGORY_COLORS = {
    obligatoria: '#5dade2',   // celeste
    optativa: '#af7ac5',      // morado
    electiva: '#e59866',      // naranja/mostaza
    meta: '#f4d03f',          // dorado
  };
  
  const PLAYER_COLORS = {
    player1: '#3498db', // azul
    player2: '#2ecc71', // verde
  };
  
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
  
      // peso de la arista en el punto medio
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
      const color = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.obligatoria;
      const isInPath = highlightPath.includes(id);
  
      ctx.beginPath();
      ctx.arc(node.x, node.y, 22, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = isInPath ? '#fff' : '#222';
      ctx.lineWidth = isInPath ? 3 : 1.5;
      ctx.stroke();
  
      ctx.fillStyle = '#000';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, node.x, node.y + 35);
    }
  }
  
  export function drawPlayers(ctx, graph, players) {
    for (const [playerId, playerData] of Object.entries(players)) {
      const node = graph.nodes.get(playerData.position);
      if (!node) continue;
  
      const color = PLAYER_COLORS[playerId] || '#fff';
      const offsetX = playerId === 'player1' ? -12 : 12; // para que no se tapen si están en el mismo nodo
  
      ctx.beginPath();
      ctx.arc(node.x + offsetX, node.y - 30, 8, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }