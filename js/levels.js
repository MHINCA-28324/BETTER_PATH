// levels.js
import { Graph } from './graph.js';

// ============================================
// NIVEL 1: Ingeniería Industrial — Hamiltoniano
// ============================================
function buildLevel1() {
  const g = new Graph();
  g.addNode('inicio', 'Inicio', 40, 300, 'obligatoria');
  g.addNode('calc1', 'Cálculo Diferencial', 200, 300, 'obligatoria');
  g.addNode('admin1', 'Fundamentos de Administración', 360, 300, 'obligatoria');
  g.addNode('elect1', 'Electiva: Economía Global', 520, 180, 'electiva');
  g.addNode('contab', 'Contabilidad', 680, 300, 'obligatoria');
  g.addNode('estadistica', 'Estadística', 840, 300, 'obligatoria');
  g.addNode('invop', 'Investigación de Operaciones', 1000, 300, 'obligatoria');
  g.addNode('logistica', 'Optativa: Logística', 1160, 300, 'optativa');
  g.addNode('calidad', 'Optativa: Gestión de Calidad', 1320, 300, 'optativa');
  g.addNode('proyecto', 'Proyecto de Grado', 1480, 300, 'obligatoria');
  g.addNode('titulo', 'Título Ing. Industrial', 1640, 300, 'meta');

  g.addEdge('inicio', 'calc1', 3);
  g.addEdge('calc1', 'admin1', 3);
  g.addEdge('admin1', 'elect1', 2);
  g.addEdge('elect1', 'contab', 2);
  g.addEdge('contab', 'estadistica', 4);
  g.addEdge('estadistica', 'invop', 4);
  g.addEdge('invop', 'logistica', 3);
  g.addEdge('logistica', 'calidad', 2);
  g.addEdge('calidad', 'proyecto', 3);
  g.addEdge('proyecto', 'titulo', 1);

  return g;
}

// ============================================
// NIVEL 2: Ingeniería Mecatrónica — Euleriano
// ============================================
function buildLevel2() {
  const g = new Graph();
  g.addNode('inicio', 'Inicio', 40, 320, 'obligatoria');
  g.addNode('prog1', 'Programación I', 190, 320, 'obligatoria');
  g.addNode('fisica1', 'Física Mecánica', 340, 320, 'obligatoria');
  g.addNode('fisica2', 'Electricidad y Magnetismo', 490, 320, 'obligatoria');
  g.addNode('circuitos', 'Circuitos Eléctricos', 640, 320, 'obligatoria');
  g.addNode('elect_a1', 'Electiva: Robótica Básica', 640, 150, 'electiva');
  g.addNode('elect_a2', 'Electiva: Manufactura Digital', 790, 150, 'electiva');
  g.addNode('sist_din', 'Sistemas Dinámicos', 790, 320, 'obligatoria');
  g.addNode('elect_c1', 'Optativa: Sensores', 790, 490, 'optativa');
  g.addNode('elect_c2', 'Optativa: Actuadores', 940, 490, 'optativa');
  g.addNode('control1', 'Control I', 940, 320, 'obligatoria');
  g.addNode('opt_b1', 'Optativa: PLC', 940, 150, 'optativa');
  g.addNode('opt_b2', 'Optativa: IoT Industrial', 1090, 150, 'optativa');
  g.addNode('arq', 'Arquitectura Mecatrónica', 1090, 320, 'obligatoria');
  g.addNode('proyecto', 'Proyecto de Grado', 1240, 320, 'obligatoria');
  g.addNode('titulo', 'Título Ing. Mecatrónica', 1390, 320, 'meta');

  g.addEdge('inicio', 'prog1', 3);
  g.addEdge('prog1', 'fisica1', 3);
  g.addEdge('fisica1', 'fisica2', 4);
  g.addEdge('fisica2', 'circuitos', 4);
  g.addEdge('circuitos', 'sist_din', 3);
  g.addEdge('sist_din', 'control1', 4);
  g.addEdge('control1', 'arq', 3);
  g.addEdge('arq', 'proyecto', 4);
  g.addEdge('proyecto', 'titulo', 1);

 
  g.addEdge('circuitos', 'elect_a1', 2);
  g.addEdge('elect_a1', 'elect_a2', 2);
  g.addEdge('elect_a2', 'circuitos', 2);

  
  g.addEdge('sist_din', 'elect_c1', 2);
  g.addEdge('elect_c1', 'elect_c2', 2);
  g.addEdge('elect_c2', 'sist_din', 2);

 
  g.addEdge('control1', 'opt_b1', 3);
  g.addEdge('opt_b1', 'opt_b2', 2);
  g.addEdge('opt_b2', 'control1', 3);

  return g;
}

// ============================================
// NIVEL 3: Ingeniería de Sistemas — 
// ============================================
function buildLevel3() {
  const g = new Graph();
  g.addNode('inicio', 'Inicio', 40, 400, 'obligatoria');
  g.addNode('intro_sistemas', 'Introducción a Sistemas', 190, 400, 'obligatoria');
  g.addNode('calc1', 'Cálculo I', 340, 400, 'obligatoria');


  g.addNode('fisica1', 'Física I', 490, 200, 'obligatoria');
  g.addNode('calc2', 'Cálculo II', 490, 400, 'obligatoria');
  g.addNode('algebra', 'Álgebra', 490, 600, 'obligatoria');

  g.addNode('electiva_top', 'Electiva: Libre I', 640, 130, 'electiva');
  g.addNode('fem', 'Optativa: FEM', 790, 130, 'optativa');
  g.addNode('probabilidad', 'Probabilidad', 790, 300, 'obligatoria');
  g.addNode('redes', 'Optativa: Redes', 940, 200, 'optativa');
  g.addNode('ingeco', 'Ingeniería Económica', 640, 450, 'obligatoria');

  g.addNode('discretas', 'Mate. Discretas', 640, 600, 'obligatoria');

  g.addNode('programacion', 'Programación', 340, 700, 'obligatoria');
  g.addNode('ingesoft', 'Ing. de Software', 490, 780, 'obligatoria');
  g.addNode('arquisoft', 'Arquitectura de Software', 640, 780, 'obligatoria');
  g.addNode('electiva_bottom', 'Electiva: Libre II', 570, 880, 'electiva');

  g.addNode('trabajo_grado', 'Trabajo de Grado', 1090, 400, 'obligatoria');
  g.addNode('titulo', 'Título', 1240, 400, 'meta');

  g.addEdge('inicio', 'intro_sistemas', 3);
  g.addEdge('intro_sistemas', 'calc1', 3);
  g.addEdge('intro_sistemas', 'programacion', 3);


  g.addEdge('calc1', 'fisica1', 3);
  g.addEdge('calc1', 'calc2', 3);
  g.addEdge('calc1', 'algebra', 3);

  g.addEdge('fisica1', 'electiva_top', 2);
  g.addEdge('electiva_top', 'fem', 2);
  g.addEdge('fem', 'probabilidad', 2);
  g.addEdge('fem', 'redes', 3);               
  g.addEdge('calc2', 'probabilidad', 3);
  g.addEdge('probabilidad', 'redes', 2);
  g.addEdge('calc2', 'ingeco', 3);
  g.addEdge('ingeco', 'trabajo_grado', 4);     
  g.addEdge('redes', 'trabajo_grado', 4);
  g.addEdge('algebra', 'discretas', 3);
  g.addEdge('discretas', 'trabajo_grado', 4);

  g.addEdge('programacion', 'ingesoft', 3);
  g.addEdge('ingesoft', 'arquisoft', 3);
  g.addEdge('ingesoft', 'electiva_bottom', 2);
  g.addEdge('arquisoft', 'electiva_bottom', 2);
  g.addEdge('arquisoft', 'trabajo_grado', 4);

  g.addEdge('trabajo_grado', 'titulo', 1);

  return g;
}

export const LEVELS = [
  { id: 1, name: 'Nivel 1: Ingeniería Industrial', build: buildLevel1, canvasWidth: 1780, canvasHeight: 500 },
  { id: 2, name: 'Nivel 2: Ingeniería Mecatrónica', build: buildLevel2, canvasWidth: 1470, canvasHeight: 620 },
  { id: 3, name: 'Nivel 3: Ingeniería de Sistemas', build: buildLevel3, canvasWidth: 1400, canvasHeight: 950 },
];