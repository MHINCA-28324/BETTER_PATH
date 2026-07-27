# BETTER-PATH

**BETTER-PATH** es un juego educativo basado en teoría de grafos que simula un plan de estudios universitario. Los jugadores deben encontrar la ruta más corta (en créditos) desde el ingreso hasta la obtención del título, moviéndose por un grafo donde cada nodo es una asignatura y cada arista representa un prerequisito. 

El juego incluye tres niveles correspondientes a carreras de ingeniería (Industrial, Mecatrónica y Sistemas), y permite explorar propiedades matemáticas como caminos Eulerianos y Hamiltonianos mediante botones de análisis interactivos. Es el proyecto final para la asignatura Matemáticas Discretas I.

---

## Autores

- **Miguel Angel Hincapie Santacruz**
- **Johan Santiago Monroy Bolaños**

**Curso:** Matemáticas Discretas I – Universidad Nacional de Colombia  
**Docente:** Jhoan Sebastian Tenjo García  
**Fecha de entrega:** 27 de julio de 2026

---

## Requisitos

- Un navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge o Safari).
- No se requiere instalar ningún servidor web, bases de datos ni dependencias adicionales (Node.js, Python, etc.). Todo el código se ejecuta directamente en el cliente.
- Se requiere tener instalado solo y exclusivamente Live Server

---

## Instalación y ejecución

Sigue estos pasos para ejecutar el proyecto en tu computadora:

1. **Clona el repositorio** (o descarga el archivo ZIP):
   ```bash
   git clone https://github.com/MHINCA-28324/BETTER_PATH.git


Abre la carpeta del proyecto.
Haz Clic derecho sobre index.html.
Selecciona Open with Live Server.
¡Listo! El juego cargará automáticamente. No necesitas hacer ningún paso adicional.

Cómo jugar
1. Pantalla de inicio
Al abrir la aplicación, verás dos opciones:

Jugar contra la IA: Modo solitario donde tú (Jugador 1) te enfrentas a la computadora.

Modo Local (2 jugadores): Dos personas juegan en el mismo dispositivo, alternando turnos.

2. Selección de nivel
Elige uno de los tres niveles disponibles:

Nivel 1: Ingeniería Industrial

Nivel 2: Ingeniería Mecatrónica

Nivel 3: Ingeniería de Sistemas

Cada nivel tiene una estructura de grafo diferente (materias, prerequisitos y créditos).

3. Mecánica del juego
Movimiento: Haz clic sobre un nodo (materia) que sea vecino al nodo donde se encuentra tu ficha. No puedes repetir nodos ya visitados.

Objetivo: Llegar primero al nodo especial llamado "Título".

Turnos: El indicador superior te dirá de quién es el turno. En modo local, los jugadores alternan haciendo clic. En modo IA, la computadora jugará automáticamente después de tu movimiento.

Créditos: Cada arista tiene un peso (créditos). El juego acumula los créditos que consumes en cada movimiento.

4. Botones de análisis (matemáticas discretas en acción)
Durante la partida, puedes utilizar estos botones para explorar las propiedades del grafo actual. No afectan el desarrollo de la partida, solo muestran información:

Calcular ruta más corta: Ejecuta el algoritmo de Dijkstra desde el nodo "Inicio" hasta "Título" y resalta en amarillo la ruta óptima, mostrando el total de créditos mínimos.

Verificar Euleriano: Aplica el Teorema de Euler, cuenta los nodos de grado impar y te dice si el grafo tiene un camino o circuito Euleriano.

Verificar Hamiltoniano: Ejecuta un algoritmo de backtracking para buscar un camino que pase por todos los nodos exactamente una vez. Si lo encuentra, lo resalta en el canvas.

5. Fin de la partida
Cuando un jugador alcanza el nodo "Título", se declara un ganador y se muestran las estadísticas de la partida (número de movimientos y créditos usados por cada jugador).

Estructura del proyecto
text
BETTER_PATH/
├── index.html          # Punto de entrada de la aplicación
├── README.md           # Este archivo
├── package.json        # Metadatos del proyecto
├── css/
│   └── styles.css      # Estilos y diseño responsivo
├── js/
│   ├── algorithms.js   # Dijkstra, Euler y Hamilton (funciones puras)
│   ├── game.js         # Lógica del juego (turnos, IA, estado)
│   ├── graph.js        # Clase Graph (nodos, aristas, vecinos, grados)
│   ├── levels.js       # Definición de los 3 niveles
│   ├── main.js         # Controlador principal y eventos
│   └── render.js       # Renderizado en canvas, sprites y animaciones
└── assets/
    └── sprites/        # Imágenes de los jugadores y nodos

Estado actual del proyecto
Versión: entrega-final-v1
Estado: Estable y completamente funcional. Todos los niveles están jugables, los algoritmos arrojan resultados correctos y la interfaz responde adecuadamente. Este repositorio contiene la versión entregada para la evaluación final del curso.