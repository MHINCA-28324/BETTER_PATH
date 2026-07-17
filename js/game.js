// game.js
// Conecta la lógica de grafos con la mecánica de juego.
// No dibuja nada (eso es trabajo de render.js) — solo maneja estado y reglas.

import { dijkstra } from './algorithms.js';

export class Game {
  constructor(graph, startNodeId, goalNodeId) {
    this.graph = graph;
    this.startNodeId = startNodeId;
    this.goalNodeId = goalNodeId;

    this.players = {
      player1: { position: startNodeId, isAI: false, moves: 0 },
      player2: { position: startNodeId, isAI: true, moves: 0 },
    };

    this.winner = null;
    this.turn = 'player1';
    this.aiPath = null;
    this.aiStepIndex = 0;

    this._prepareAI();
  }

  _prepareAI() {
    const result = dijkstra(this.graph, this.startNodeId, this.goalNodeId);
    if (result.exists) {
      this.aiPath = result.path;
    } else {
      this.aiPath = null;
    }
  }

  getValidMoves(playerId) {
    const currentPos = this.players[playerId].position;
    return this.graph.getNeighbors(currentPos).map(n => n.to);
  }

  movePlayer(playerId, targetNodeId) {
    if (this.winner) {
      return { success: false, reason: 'La partida ya terminó.' };
    }

    if (this.turn !== playerId) {
      return { success: false, reason: 'No es el turno de este jugador.' };
    }

    const validMoves = this.getValidMoves(playerId);
    if (!validMoves.includes(targetNodeId)) {
      return { success: false, reason: 'Movimiento inválido: el nodo no es vecino de la posición actual.' };
    }

    this.players[playerId].position = targetNodeId;
    this.players[playerId].moves += 1;

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
    if (!this.aiPath) return { success: false, reason: 'La IA no tiene camino hacia la meta.' };

    this.aiStepIndex += 1;
    const nextNode = this.aiPath[this.aiStepIndex];

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
    };
  }
}