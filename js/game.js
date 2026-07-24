// game.js
import { dijkstra } from './algorithms.js';

export class Game {
  constructor(graph, startNodeId, goalNodeId, opts = {}) {
    this.graph = graph;
    this.startNodeId = startNodeId;
    this.goalNodeId = goalNodeId;
    this.vsAI = opts.vsAI !== undefined ? opts.vsAI : true;
    this.aiMistakeChance = opts.aiMistakeChance !== undefined ? opts.aiMistakeChance : 0.25;

    this.players = {
      player1: { position: startNodeId, moves: 0, creditsUsed: 0, path: [startNodeId] },
      player2: { position: startNodeId, moves: 0, creditsUsed: 0, path: [startNodeId] },
    };

    this.visited = {
      player1: new Set([startNodeId]),
      player2: new Set([startNodeId]),
    };

    this.winner = null;
    this.turn = 'player1';
  }

  getValidMoves(playerId) {
    const p = this.players[playerId];
    const neighbors = this.graph.getNeighbors(p.position).map(n => n.to);
    return neighbors.filter((id) => !this.visited[playerId].has(id));
  }

  isStuck(playerId) {
    const p = this.players[playerId];
    if (p.position === this.goalNodeId) return false;
    return this.getValidMoves(playerId).length === 0;
  }

  movePlayer(playerId, targetNodeId) {
    if (this.winner) return { success: false, reason: 'La partida ya terminó.' };
    if (this.turn !== playerId) return { success: false, reason: 'No es el turno de este jugador.' };

    const validMoves = this.getValidMoves(playerId);
    if (!validMoves.includes(targetNodeId)) {
      return { success: false, reason: 'Movimiento inválido: no es vecino, o ya visitaste ese nodo.' };
    }

    const p = this.players[playerId];
    const edge = this.graph.getNeighbors(p.position).find(n => n.to === targetNodeId);

    p.position = targetNodeId;
    p.moves += 1;
    p.creditsUsed += edge.weight;
    p.path.push(targetNodeId);
    this.visited[playerId].add(targetNodeId);

    if (targetNodeId === this.goalNodeId) {
      this.winner = playerId;
      return { success: true, gameOver: true, winner: playerId };
    }

    this._nextTurn();
    return { success: true, gameOver: false };
  }

  playAITurn() {
    if (this.winner) return { success: false, reason: 'La partida ya terminó.' };
    if (this.turn !== 'player2') return { success: false, reason: 'No es el turno de la IA.' };
    if (!this.vsAI) return { success: false, reason: 'Este modo no usa IA.' };

    const result = dijkstra(this.graph, this.players.player2.position, this.goalNodeId, this.visited.player2);
    if (!result.exists || result.path.length < 2) {
      return { success: false, reason: 'La IA no tiene camino disponible hacia la meta.' };
    }

    let nextNode = result.path[1];
    if (Math.random() < this.aiMistakeChance) {
      const validMoves = this.getValidMoves('player2');
      if (validMoves.length > 0) {
        nextNode = validMoves[Math.floor(Math.random() * validMoves.length)];
      }
    }
    return this.movePlayer('player2', nextNode);
  }

  _nextTurn() {
    this.turn = this.turn === 'player1' ? 'player2' : 'player1';
  }

  getState() {
    return {
      players: this.players,
      turn: this.turn,
      winner: this.winner,
      goalNodeId: this.goalNodeId,
      player1Stuck: this.isStuck('player1'),
      player2Stuck: this.isStuck('player2'),
    };
  }
}