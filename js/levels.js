// levels.js
import { Graph } from './graph.js';

// ============================================
// NIVEL 1: Ingeniería de Sistemas
// ============================================
function buildLevel1() {
  const g = new Graph();
  g.addNode('inicio', 'Inicio', 40, 300, 'obligatoria');
  g.addNode('prog1', 'Programación I', 190, 180, 'obligatoria');
  g.addNode('calc1', 'Cálculo Diferencial', 190, 420, 'obligatoria');
  g.addNode('prog2', 'Estructuras de Datos', 340, 180, 'obligatoria');
  g.addNode('discretas', 'Mate. Discretas', 340, 420, 'obligatoria');
  g.addNode('elect1', 'Electiva: Diseño UX', 260, 300, 'electiva');
  g.addNode('bd', 'Bases de Datos', 490, 300, 'obligatoria');

  // Optativas: una rama corta (2 saltos), otra larga (3 saltos)
  g.addNode('opt_redes', 'Optativa: Redes', 640, 150, 'optativa');
  g.addNode('opt_ia', 'Optativa: IA', 640, 300, 'optativa');
  g.addNode('opt_web', 'Optativa: Desarrollo Web', 640, 450, 'optativa');
  g.addNode('opt_seg', 'Optativa: Ciberseguridad', 790, 220, 'optativa');
  g.addNode('opt_cloud', 'Optativa: Computación en la Nube', 790, 380, 'optativa');

  g.addNode('proyecto', 'Proyecto de Grado', 940, 300, 'obligatoria');
  g.addNode('titulo', 'Título Ing. Sistemas', 1060, 300, 'meta');

  g.addEdge('inicio', 'prog1', 3);
  g.addEdge('inicio', 'calc1', 3);
  g.addEdge('prog1', 'prog2', 3);
  g.addEdge('calc1', 'discretas', 4);
  g.addEdge('prog1', 'elect1', 2);
  g.addEdge('elect1', 'discretas', 2);
  g.addEdge('prog2', 'bd', 3);
  g.addEdge('discretas', 'bd', 3);

  // Rama corta directa (2 saltos hasta proyecto)
  g.addEdge('bd', 'opt_web', 3);
  g.addEdge('opt_web', 'proyecto', 5);

  // Ramas más largas (3 saltos), con cruce entre ellas
  g.addEdge('bd', 'opt_redes', 2);
  g.addEdge('bd', 'opt_ia', 3);
  g.addEdge('opt_redes', 'opt_seg', 2);
  g.addEdge('opt_ia', 'opt_seg', 3);
  g.addEdge('opt_ia', 'opt_cloud', 2);
  g.addEdge('opt_seg', 'proyecto', 3);
  g.addEdge('opt_cloud', 'proyecto', 2);

  g.addEdge('proyecto', 'titulo', 1);

  return g;
}

// ============================================
// NIVEL 2: Ingeniería Industrial
// ============================================
function buildLevel2() {
  const g = new Graph();
  g.addNode('inicio', 'Inicio', 40, 320, 'obligatoria');
  g.addNode('calc1', 'Cálculo Diferencial', 190, 180, 'obligatoria');
  g.addNode('admin1', 'Fundamentos de Administración', 190, 460, 'obligatoria');
  g.addNode('calc2', 'Cálculo Integral', 340, 180, 'obligatoria');
  g.addNode('contab', 'Contabilidad', 340, 460, 'obligatoria');
  g.addNode('elect1', 'Electiva: Economía Global', 265, 320, 'electiva');
  g.addNode('estadistica', 'Estadística', 490, 320, 'obligatoria');
  g.addNode('investigacion_op', 'Investigación de Operaciones', 640, 320, 'obligatoria');

  // 3 optativas con distinto largo de rama
  g.addNode('opt_logistica', 'Optativa: Logística', 790, 130, 'optativa');
  g.addNode('opt_calidad', 'Optativa: Gestión de Calidad', 790, 320, 'optativa');
  g.addNode('opt_finanzas', 'Optativa: Finanzas', 790, 510, 'optativa');

  g.addNode('opt_cadena', 'Optativa: Cadena de Suministro', 940, 130, 'optativa');
  g.addNode('opt_ergonomia', 'Optativa: Ergonomía', 940, 420, 'optativa');
  g.addNode('elect2', 'Electiva: Innovación', 940, 220, 'electiva');

  g.addNode('proyecto', 'Proyecto de Grado', 1090, 300, 'obligatoria');
  g.addNode('titulo', 'Título Ing. Industrial', 1220, 300, 'meta');

  g.addEdge('inicio', 'calc1', 3);
  g.addEdge('inicio', 'admin1', 3);
  g.addEdge('calc1', 'calc2', 3);
  g.addEdge('admin1', 'contab', 3);
  g.addEdge('calc1', 'elect1', 2);
  g.addEdge('elect1', 'contab', 2);
  g.addEdge('calc2', 'estadistica', 3);
  g.addEdge('contab', 'estadistica', 3);
  g.addEdge('estadistica', 'investigacion_op', 4);

  // Rama corta (1 salto directo)
  g.addEdge('investigacion_op', 'opt_calidad', 3);
  g.addEdge('opt_calidad', 'proyecto', 4);

  // Rama media (2 saltos)
  g.addEdge('investigacion_op', 'opt_finanzas', 3);
  g.addEdge('opt_finanzas', 'opt_ergonomia', 2);
  g.addEdge('opt_ergonomia', 'proyecto', 3);

  // Rama larga (3 saltos), con cruce vía electiva
  g.addEdge('investigacion_op', 'opt_logistica', 2);
  g.addEdge('opt_logistica', 'opt_cadena', 2);
  g.addEdge('opt_cadena', 'elect2', 2);
  g.addEdge('elect2', 'proyecto', 2);
  g.addEdge('opt_cadena', 'proyecto', 4); // atajo alterno desde la misma rama

  g.addEdge('proyecto', 'titulo', 1);

  return g;
}

// ============================================
// NIVEL 3: Ingeniería Mecatrónica
// ============================================
function buildLevel3() {
  const g = new Graph();
  g.addNode('inicio', 'Inicio', 40, 320, 'obligatoria');
  g.addNode('fisica1', 'Física Mecánica', 190, 160, 'obligatoria');
  g.addNode('prog1', 'Programación I', 190, 480, 'obligatoria');
  g.addNode('fisica2', 'Electricidad y Magnetismo', 340, 160, 'obligatoria');
  g.addNode('circuitos', 'Circuitos Eléctricos', 340, 480, 'obligatoria');
  g.addNode('elect1', 'Electiva: Robótica Básica', 265, 320, 'electiva');
  g.addNode('sistemas_din', 'Sistemas Dinámicos', 490, 320, 'obligatoria');
  g.addNode('control1', 'Control I', 640, 320, 'obligatoria');
  g.addNode('elect2', 'Electiva: Manufactura Digital', 640, 500, 'electiva');

  // Optativas: 3 ramas de distinto largo (1, 2 y 3 saltos)
  g.addNode('opt_robot', 'Optativa: Robótica Avanzada', 790, 140, 'optativa');
  g.addNode('opt_vision', 'Optativa: Visión Artificial', 940, 100, 'optativa');
  g.addNode('opt_pid', 'Optativa: Control Avanzado', 1090, 140, 'optativa');

  g.addNode('opt_plc', 'Optativa: Automatización PLC', 790, 320, 'optativa');
  g.addNode('opt_iot', 'Optativa: IoT Industrial', 940, 320, 'optativa');

  g.addNode('opt_diseno', 'Optativa: Diseño Mecánico', 790, 500, 'optativa');

  g.addNode('proyecto', 'Proyecto de Grado', 1240, 320, 'obligatoria');
  g.addNode('titulo', 'Título Ing. Mecatrónica', 1380, 320, 'meta');

  g.addEdge('inicio', 'fisica1', 3);
  g.addEdge('inicio', 'prog1', 3);
  g.addEdge('fisica1', 'fisica2', 4);
  g.addEdge('prog1', 'circuitos', 3);
  g.addEdge('fisica1', 'elect1', 2);
  g.addEdge('elect1', 'circuitos', 2);
  g.addEdge('fisica2', 'sistemas_din', 4);
  g.addEdge('circuitos', 'sistemas_din', 3);
  g.addEdge('sistemas_din', 'control1', 4);

  // Rama corta (1 salto)
  g.addEdge('control1', 'opt_plc', 3);
  g.addEdge('opt_plc', 'opt_iot', 2);
  g.addEdge('opt_iot', 'proyecto', 4);

  // Rama corta directa alterna (1 salto puro)
  g.addEdge('control1', 'elect2', 2);
  g.addEdge('elect2', 'opt_diseno', 2);
  g.addEdge('opt_diseno', 'proyecto', 3);

  // Rama larga (3 saltos)
  g.addEdge('control1', 'opt_robot', 3);
  g.addEdge('opt_robot', 'opt_vision', 3);
  g.addEdge('opt_vision', 'opt_pid', 3);
  g.addEdge('opt_pid', 'proyecto', 3);

  g.addEdge('proyecto', 'titulo', 1);

  return g;
}

export const LEVELS = [
  { id: 1, name: 'Nivel 1: Ingeniería de Sistemas', build: buildLevel1, canvasWidth: 1160, canvasHeight: 600 },
  { id: 2, name: 'Nivel 2: Ingeniería Industrial', build: buildLevel2, canvasWidth: 1320, canvasHeight: 600 },
  { id: 3, name: 'Nivel 3: Ingeniería Mecatrónica', build: buildLevel3, canvasWidth: 1600, canvasHeight: 650 },
];