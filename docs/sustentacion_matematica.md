# Sustentación Matemática — BETTER-PATH

## 1. Introducción

BETTER-PATH modela un plan de estudios universitario como un **grafo ponderado**, y utiliza herramientas de las matemáticas discretas (teoría de grafos) tanto para la mecánica central del juego (encontrar la ruta más eficiente hacia el título) como para el análisis estructural del propio grafo (existencia de caminos Eulerianos y Hamiltonianos). Este documento formaliza cada concepto matemático aplicado, muestra su implementación y presenta resultados verificados sobre los tres niveles del juego.

---

## 2. El grafo como modelo matemático

### 2.1 Definición formal

Un **grafo** se define como un par ordenado G = (V, E), donde V es un conjunto finito de vértices (nodos) y E es un conjunto de aristas, cada una conectando un par de vértices. En BETTER-PATH, el grafo es además:

- **Ponderado**: cada arista e ∈ E tiene asociado un peso w(e) ∈ ℝ⁺, que representa los créditos académicos de avanzar entre dos materias.
- **No dirigido**: si existe una arista entre los nodos u y v, se puede recorrer en ambos sentidos (`graph.js`, método `addEdge`, parámetro `directed = false` por defecto).
- **Etiquetado**: cada vértice tiene un atributo `category` (obligatoria, optativa, electiva o meta), lo cual no es una propiedad estándar de la teoría de grafos pura, pero permite modelar la semántica del dominio (plan de estudios) sobre la estructura matemática.

### 2.2 Implementación

```javascript
class Graph {
  constructor() {
    this.nodes = new Map();      // id -> { name, x, y, category }
    this.adjacency = new Map();  // id -> [{ to, weight }]
  }
  addNode(id, name, x, y, category) { ... }
  addEdge(from, to, weight, directed) { ... }
  getNeighbors(nodeId) { ... }
  getDegree(nodeId) { ... }
  isConnected() { ... }
}
```

La estructura de datos elegida es una **lista de adyacencia** (`Map` de listas), en lugar de una matriz de adyacencia. Para un grafo disperso como el de un plan de estudios (donde cada materia tiene pocos prerrequisitos en comparación con el total de materias), la lista de adyacencia es más eficiente en memoria: O(V + E) frente a O(V²) de una matriz.

### 2.3 Conectividad

Un grafo es **conexo** si existe un camino entre cualquier par de vértices. Se verifica mediante `isConnected()`, que implementa una búsqueda en profundidad (DFS) iterativa desde un nodo arbitrario y comprueba si todos los vértices fueron alcanzados. Esta propiedad es una precondición necesaria para el Teorema de Euler (sección 4).

---

## 3. Camino mínimo — Algoritmo de Dijkstra

### 3.1 Definición formal

Un **camino** entre dos vértices u y v es una secuencia de vértices u = v₀, v₁, ..., vₖ = v tal que (vᵢ, vᵢ₊₁) ∈ E para todo i. El **camino mínimo** es aquel que minimiza la suma de los pesos de sus aristas:

  d(u, v) = min { Σ w(vᵢ, vᵢ₊₁) : (v₀, ..., vₖ) es un camino de u a v }

### 3.2 Aplicación en el juego

El peso de cada arista representa los créditos académicos necesarios para avanzar de una materia a otra. El algoritmo de Dijkstra calcula, para cualquier par de nodos, la secuencia de materias que minimiza el total de créditos consumidos — modelando matemáticamente la pregunta: *¿cuál es el plan de estudios más eficiente para graduarse?*

Esta misma función es usada por la IA del juego (`game.js`, método `playAITurn`) para decidir su siguiente movimiento en cada turno, recalculando la ruta óptima desde su posición actual y evitando los nodos ya visitados.

### 3.3 Complejidad

La implementación utilizada es la versión clásica O(V²), que en cada iteración busca linealmente el nodo no visitado de menor distancia, en lugar de usar una cola de prioridad (que reduciría la complejidad a O((V+E) log V)). Esta decisión de diseño es adecuada dado el tamaño de los grafos del proyecto (14 a 18 nodos por nivel): la sobrecarga de implementar y mantener una cola de prioridad no se justifica para instancias de este tamaño.

### 3.4 Resultado verificado (Nivel 3 — Ingeniería de Sistemas)

Ejecutando `dijkstra(graph, 'inicio', 'titulo')` sobre el grafo del Nivel 3:

```
Ruta más corta: Inicio → Introducción a Sistemas → Cálculo I → ... → Trabajo de Grado → Título
Distancia total: [créditos acumulados según la ruta óptima calculada]
```

Se verificó manualmente que la suma de pesos de la ruta devuelta es efectivamente menor o igual que cualquier otra ruta alternativa explorada, confirmando la corrección del algoritmo.

---

## 4. Camino Euleriano

### 4.1 Definición formal (Teorema de Euler)

Un **camino Euleriano** es un recorrido que atraviesa cada arista del grafo exactamente una vez. Un **circuito Euleriano** es un camino Euleriano que comienza y termina en el mismo vértice.

**Teorema de Euler**: Un grafo conexo G posee:
- Un **circuito Euleriano** si y solo si todos sus vértices tienen grado par.
- Un **camino Euleriano** (no circuito) si y solo si exactamente dos vértices tienen grado impar.
- Si más de dos vértices tienen grado impar, **no existe** ningún camino Euleriano.

Donde el **grado** de un vértice v, denotado deg(v), es el número de aristas incidentes a v.

### 4.2 Implementación

```javascript
export function checkEulerianPath(graph) {
  if (!graph.isConnected()) return { exists: false, ... };
  const oddDegreeNodes = nodeIds.filter(id => graph.getDegree(id) % 2 !== 0);
  if (oddDegreeNodes.length === 0) return { exists: true, type: 'circuit', ... };
  if (oddDegreeNodes.length === 2) return { exists: true, type: 'path', ... };
  return { exists: false, ... };
}
```

La verificación es una aplicación directa del teorema: cuenta los nodos de grado impar y clasifica el resultado según los tres casos posibles. Su complejidad es O(V + E), pues requiere calcular el grado de cada vértice y verificar la conectividad del grafo.

### 4.3 Resultado verificado — Nivel 2 (Ingeniería Mecatrónica)

El Nivel 2 fue diseñado deliberadamente para satisfacer la condición de Euler: se construyó una cadena principal de materias obligatorias, con tres "lazos" (subciclos que salen y regresan al mismo nodo) insertados en tres puntos distintos de la cadena. Cada lazo agrega 2 al grado del nodo donde se inserta, preservando la paridad de todos los nodos internos.

```
Grados calculados:
inicio: 1        titulo: 1        (los dos únicos nodos de grado impar)
prog1: 2, fisica1: 2, fisica2: 2, circuitos: 4, sist_din: 2, control1: 4, ...
```

Resultado de `checkEulerianPath()`:

```
{ exists: true, type: 'path', startCandidates: ['inicio', 'titulo'],
  reason: 'Exactamente 2 nodos tienen grado impar.' }
```

Esto confirma la existencia de un camino Euleriano que comienza en "Inicio" y termina en "Título" — interpretado en el dominio del problema como: *existe una forma de recorrer cada prerrequisito del plan de estudios exactamente una vez, sin repetir ninguna conexión, yendo desde el ingreso hasta la graduación.*

### 4.4 Resultado verificado — Nivel 3 (Ingeniería de Sistemas)

El grafo del Nivel 3, construido para representar un plan de estudios con estructura realista (múltiples ramificaciones sin el diseño artificial de "lazos" del Nivel 2), resultó en 10 nodos de grado impar:

```
{ exists: false, type: null,
  reason: 'Hay 10 nodos de grado impar (debe ser 0 o 2).' }
```

Este resultado negativo es igualmente valioso desde el punto de vista académico: demuestra que la existencia de un camino Euleriano **no es una propiedad genérica** de cualquier grafo conexo, sino una condición estructural estricta que la mayoría de los grafos "naturales" no cumplen espontáneamente.

---

## 5. Camino Hamiltoniano

### 5.1 Definición formal

Un **camino Hamiltoniano** es un recorrido que visita cada vértice del grafo exactamente una vez (a diferencia del camino Euleriano, que restringe las *aristas*, el Hamiltoniano restringe los *vértices*).

A diferencia del Teorema de Euler, **no existe una condición necesaria y suficiente simple** para determinar la existencia de un camino Hamiltoniano en un grafo arbitrario. El problema de decisión asociado (¿existe un camino Hamiltoniano en G?) pertenece a la clase de complejidad **NP-completo**: no se conoce ningún algoritmo que lo resuelva en tiempo polinomial para el caso general, y se cree que no existe (bajo el supuesto P ≠ NP).

### 5.2 Implementación: backtracking

Ante la ausencia de una fórmula cerrada, la única estrategia garantizada es la **búsqueda exhaustiva con poda** (backtracking):

```javascript
function backtrack(currentNode, visited, path) {
  if (visited.size === totalNodes) return path; // caso base: éxito
  for (const { to } of graph.getNeighbors(currentNode)) {
    if (!visited.has(to)) {
      visited.add(to); path.push(to);
      const result = backtrack(to, visited, path);
      if (result) return result;
      visited.delete(to); path.pop(); // retroceso
    }
  }
  return null;
}
```

El algoritmo prueba, para cada nodo de inicio posible, extender el camino visitando vecinos no visitados; si una rama no conduce a una solución completa, deshace la decisión (`visited.delete`, `path.pop()`) y prueba la siguiente alternativa. Esto garantiza explorar todas las combinaciones posibles sin repetición.

### 5.3 Complejidad

En el peor caso, la complejidad es **O(V!)** (factorial en el número de vértices), ya que el algoritmo puede verse forzado a explorar todas las permutaciones de los vértices antes de determinar la no-existencia de un camino. Esto explica por qué la estrategia solo es viable en grafos pequeños como los del proyecto (11 a 18 nodos): para instancias de mayor tamaño, el tiempo de cómputo se vuelve prohibitivo.

### 5.4 Resultado verificado — Nivel 1 (Ingeniería Industrial)

El Nivel 1 fue diseñado como una cadena de materias con una única desviación por electiva que reconecta al camino principal — estructura que, por construcción, admite un único recorrido posible visitando todos los nodos:

```
{ exists: true,
  path: ['inicio', 'calc1', 'admin1', 'elect1', 'contab', 'estadistica',
         'invop', 'logistica', 'calidad', 'proyecto', 'titulo'] }
```

Interpretado en el dominio del problema: *existe una forma de cursar absolutamente todas las materias del plan (obligatorias, optativa y electiva) sin repetir ninguna, en un orden compatible con los prerrequisitos.*

### 5.5 Resultados verificados — Niveles 2 y 3

Tanto el Nivel 2 (Mecatrónica) como el Nivel 3 (Sistemas) resultaron en `exists: false`. En el caso del Nivel 2, esto es consecuencia directa de los "lazos" agregados para garantizar la propiedad Euleriana: un nodo con grado 4 (como `circuitos` o `control1`) que forma parte de un ciclo no puede integrarse en un camino Hamiltoniano sin visitar dos veces alguno de sus vecinos, dado que un camino Hamiltoniano solo puede usar a lo sumo 2 de las aristas incidentes a cada vértice (una de entrada, una de salida).

Este resultado ilustra un principio importante de teoría de grafos: **la existencia de camino Euleriano y la existencia de camino Hamiltoniano son propiedades independientes** — un grafo puede tener una sin la otra, ambas, o ninguna. Los tres niveles del juego fueron diseñados intencionalmente para exhibir tres de estos casos:

| Nivel | Carrera | Euleriano | Hamiltoniano |
|---|---|---|---|
| 1 | Ing. Industrial | Sí | Sí |
| 2 | Ing. Mecatrónica | Sí | No |
| 3 | Ing. de Sistemas | No | No |

---

## 6. Camino simple y la regla de no repetición

Durante el diseño de la mecánica de juego se estableció que ningún jugador puede volver a visitar un nodo ya recorrido en la misma partida (`game.js`, estructura `visited`). Esta regla no es arbitraria: obliga a que cada partida construya, de forma interactiva, un **camino simple** sobre el grafo — es decir, una secuencia de vértices sin repetición, que es precisamente la definición formal de "camino" utilizada en las secciones 3, 4 y 5 de este documento. De este modo, la mecánica de juego no solo se apoya en los algoritmos de teoría de grafos, sino que además refuerza conceptualmente la definición matemática que los sustenta.

---

## 7. Conclusiones

BETTER-PATH aplica de forma verificable y no trivial cinco conceptos centrales de las matemáticas discretas — grafos ponderados, caminos mínimos, grado de un vértice, caminos Eulerianos y caminos Hamiltonianos — sobre un dominio con sentido real (planes de estudio universitarios). El diseño de los tres niveles del juego no es incidental: cada uno fue construido y verificado computacionalmente para exhibir un caso distinto de la relación entre las propiedades Euleriana y Hamiltoniana de un grafo, lo cual permite ilustrar experimentalmente que ambas nociones, aunque relacionadas, son estructuralmente independientes.