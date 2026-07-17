// algorithms.js
// Funciones puras: reciben un Graph, devuelven resultados. No tocan el DOM.

export function dijkstra(graph, startId, endId) {
    const distances = new Map();
    const previous = new Map();
    const visited = new Set();
  
    for (const id of graph.getAllNodeIds()) {
      distances.set(id, Infinity);
      previous.set(id, null);
    }
    distances.set(startId, 0);
  
    while (visited.size < graph.getAllNodeIds().length) {
      // Nodo no visitado con menor distancia
      let current = null;
      let minDist = Infinity;
      for (const [id, dist] of distances.entries()) {
        if (!visited.has(id) && dist < minDist) {
          minDist = dist;
          current = id;
        }
      }
  
      if (current === null) break; // resto son inalcanzables
      if (current === endId) break; // ya llegamos
  
      visited.add(current);
  
      for (const { to, weight } of graph.getNeighbors(current)) {
        if (visited.has(to)) continue;
        const newDist = distances.get(current) + weight;
        if (newDist < distances.get(to)) {
          distances.set(to, newDist);
          previous.set(to, current);
        }
      }
    }
  
    // Reconstruir el camino
    const path = [];
    let step = endId;
    while (step !== null) {
      path.unshift(step);
      step = previous.get(step);
    }
  
    if (distances.get(endId) === Infinity) {
      return { exists: false, path: [], distance: Infinity };
    }
  
    return { exists: true, path, distance: distances.get(endId) };
  }
  
  export function checkEulerianPath(graph) {
    const nodeIds = graph.getAllNodeIds();
  
    if (nodeIds.length === 0) {
      return { exists: false, type: null, reason: 'El grafo está vacío.' };
    }
  
    if (!graph.isConnected()) {
      return { exists: false, type: null, reason: 'El grafo no es conexo.' };
    }
  
    const oddDegreeNodes = nodeIds.filter(id => graph.getDegree(id) % 2 !== 0);
  
    if (oddDegreeNodes.length === 0) {
      return {
        exists: true,
        type: 'circuit',
        reason: 'Todos los nodos tienen grado par.'
      };
    }
  
    if (oddDegreeNodes.length === 2) {
      return {
        exists: true,
        type: 'path',
        startCandidates: oddDegreeNodes,
        reason: 'Exactamente 2 nodos tienen grado impar.'
      };
    }
  
    return {
      exists: false,
      type: null,
      reason: `Hay ${oddDegreeNodes.length} nodos de grado impar (debe ser 0 o 2).`
    };
  }
  
  export function checkHamiltonianPath(graph) {
    const nodeIds = graph.getAllNodeIds();
    const totalNodes = nodeIds.length;
  
    if (totalNodes === 0) {
      return { exists: false, path: [], reason: 'El grafo está vacío.' };
    }
  
    function backtrack(currentNode, visited, path) {
      if (visited.size === totalNodes) {
        return path; // ¡Encontramos un camino hamiltoniano!
      }
  
      for (const { to } of graph.getNeighbors(currentNode)) {
        if (!visited.has(to)) {
          visited.add(to);
          path.push(to);
  
          const result = backtrack(to, visited, path);
  
          if (result) {
            return result;
          }
  
          visited.delete(to);
          path.pop();
        }
      }
  
      return null; // no se encontró camino desde este nodo
    }
  
    for (const startId of nodeIds) {
      const result = backtrack(startId, new Set([startId]), [startId]);
      if (result) {
        return { exists: true, path: result };
      }
    }
  
    return { exists: false, path: [], reason: 'No existe un camino hamiltoniano en este grafo.' };
  }