// graph.js
// Estructura de datos base: grafo no dirigido y ponderado (ajustable a dirigido si lo necesitan)

export class Graph {
    constructor() {
      this.nodes = new Map();   // id -> { name, x, y }
      this.adjacency = new Map(); // id -> [{ to, weight }]
    }
  
    addNode(id, name, x = 0, y = 0, category = 'obligatoria') {
      if (this.nodes.has(id)) {
        console.warn(`El nodo ${id} ya existe.`);
        return;
      }
      this.nodes.set(id, { name, x, y, category });
      this.adjacency.set(id, []);
    }
  
    addEdge(from, to, weight = 1, directed = false) {
      if (!this.nodes.has(from) || !this.nodes.has(to)) {
        throw new Error(`No se puede crear arista: nodo ${from} o ${to} no existe.`);
      }
      this.adjacency.get(from).push({ to, weight });
      if (!directed) {
        this.adjacency.get(to).push({ to: from, weight });
      }
    }
  
    getNeighbors(nodeId) {
      return this.adjacency.get(nodeId) || [];
    }
  
    getAllNodeIds() {
      return Array.from(this.nodes.keys());
    }
  
    getAllEdges() {
      // Devuelve aristas únicas (para grafo no dirigido, evita duplicados A-B y B-A)
      const seen = new Set();
      const edges = [];
      for (const [from, neighbors] of this.adjacency.entries()) {
        for (const { to, weight } of neighbors) {
          const key = [from, to].sort().join('-');
          if (!seen.has(key)) {
            seen.add(key);
            edges.push({ from, to, weight });
          }
        }
      }
      return edges;
    }
  
    getDegree(nodeId) {
      return this.getNeighbors(nodeId).length;
    }
  
    isConnected() {
      const ids = this.getAllNodeIds();
      if (ids.length === 0) return true;
  
      const visited = new Set();
      const stack = [ids[0]];
  
      while (stack.length > 0) {
        const current = stack.pop();
        if (visited.has(current)) continue;
        visited.add(current);
        for (const { to } of this.getNeighbors(current)) {
          if (!visited.has(to)) stack.push(to);
        }
      }
  
      return visited.size === ids.length;
    }
  }