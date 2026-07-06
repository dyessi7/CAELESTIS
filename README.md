# CAELESTIS
Intelligent system for automated detection and analysis of celestial objects in astronomical images using YOLOv8, deep learning and an AI agent

**Automatic detection of celestial objects using computer vision**

Sistema de inteligencia artificial que detecta, clasifica y describe objetos celestes en imágenes astronómicas reales, combinando un modelo de detección YOLOv8 con un agente reactivo basado en reglas.

[![Live Demo](https://img.shields.io/badge/demo-caelestis--pied.vercel.app-c9a14a?style=flat-square)](https://caelestis-pied.vercel.app)
[![Backend](https://img.shields.io/badge/API-caelestis--backend.onrender.com-4ade80?style=flat-square)](https://caelestis-backend.onrender.com/docs)
[![Python](https://img.shields.io/badge/python-3.11-blue?style=flat-square)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square)](https://nextjs.org)

---

## Contexto

Los telescopios modernos generan más datos de los que la humanidad puede analizar manualmente. El proyecto Galaxy Zoo, con más de 400 000 voluntarios, logró clasificar apenas el 6% de sus imágenes en 17 años. Caelestis nace para acercar la exploración del cosmos a estudiantes y aficionados sin acceso a software astronómico profesional, mediante herramientas de inteligencia artificial accesibles desde el navegador.

## Descripción del sistema

Caelestis está compuesto por cuatro capas que trabajan de forma coordinada:

1. **Modelo de detección visual (YOLOv8n)** — identifica y localiza objetos celestes en la imagen, generando cajas delimitadoras (bounding boxes) con niveles de confianza.
2. **Agente reactivo basado en reglas** — evalúa cada detección, filtra por umbrales de confianza y selecciona la respuesta apropiada desde una base de conocimiento curada.
3. **API REST (FastAPI)** — expone endpoints públicos para detección, descripción individual, generación de reportes y consulta de métricas.
4. **Interfaz web (Next.js)** — permite subir imágenes, visualizar detecciones con bounding boxes interactivos y consultar información detallada de cada objeto.

## Clases detectadas

El sistema clasifica cuatro categorías de objetos celestes:

| Clase | mAP50 |
|-------|-------|
| Cúmulo globular | 0.931 |
| Nebulosa | 0.791 |
| Cometa | 0.698 |
| Galaxia | 0.564 |

## Enlaces del sistema

| Componente | URL |
|-----------|-----|
| Aplicación web | https://caelestis-pied.vercel.app |
| Detector interactivo | https://caelestis-pied.vercel.app/detector |
| API en producción | https://caelestis-backend.onrender.com |
| Documentación interactiva de la API | https://caelestis-backend.onrender.com/docs |

## Arquitectura

```
┌─────────────────────┐         ┌─────────────────────┐
│  Frontend Next.js   │  HTTP   │  Backend FastAPI    │
│  (Vercel)           │◄───────►│  (Render)           │
│                     │  JSON   │                     │
│  · Landing          │         │  · CaelestisDetector│
│  · /detector        │         │  · CaelestisAgent   │
│  · Bounding boxes   │         │  · Base de          │
│    interactivos     │         │    conocimiento     │
└─────────────────────┘         └─────────────────────┘
```

## Stack tecnológico

**Backend**
- Python 3.11
- FastAPI (API REST)
- Ultralytics YOLOv8n (detección de objetos)
- PyTorch CPU (inferencia)

**Frontend**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui

**Infraestructura**
- Render (backend)
- Vercel (frontend)
- GitHub (control de versiones)

## Dataset

El modelo fue entrenado sobre **COSMICA** (Piratinskii & Rabaev, 2025), un dataset público de aproximadamente 20 000 imágenes astronómicas reales capturadas por telescopios amateurs, con cuatro clases anotadas y división por defecto en entrenamiento, validación y prueba.

## Métricas del modelo

Evaluación sobre el conjunto de prueba (1 948 imágenes):

| Métrica | Valor |
|---------|-------|
| Precisión | 0.797 |
| Recall | 0.678 |
| mAP50 | 0.746 |
| mAP50-95 | 0.438 |

## Estructura del repositorio

```
CAELESTIS/
├── backend/
│   ├── agente/
│   │   ├── agent.py           # Clase CaelestisAgent
│   │   └── agentBD.json        # Base de conocimiento astronómica
│   ├── modelo/
│   │   └── best.pt             # Modelo YOLOv8n entrenado
│   ├── detector.py             # Envoltorio de YOLOv8
│   ├── main.py                 # Servidor FastAPI y endpoints
│   └── requirements.txt        # Dependencias Python
│
├── frontend/
│   ├── public/
│   │   └── ejemplos/           # Imágenes astronómicas de ejemplo
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Landing principal
│   │   │   └── detector/       # Página del detector
│   │   ├── components/         # Componentes reutilizables
│   │   └── lib/
│   │       └── api.ts          # Cliente HTTP del backend
│   └── package.json
│
└── README.md
```

## Ejecución local

### Requisitos previos
- Python 3.11
- Node.js 20+
- Git

### Backend

```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1        # Windows
source venv/bin/activate           # Linux/Mac
pip install -r requirements.txt
uvicorn main:app --reload
```

El backend queda accesible en `http://localhost:8000`. La documentación interactiva se sirve en `http://localhost:8000/docs`.

### Frontend

En una nueva terminal:

```bash
cd frontend
npm install
npm run dev
```

La interfaz web queda accesible en `http://localhost:3000`.

## Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/salud` | Verifica el estado del servicio |
| `GET` | `/metricas` | Devuelve las métricas globales y por clase del modelo |
| `POST` | `/detectar` | Recibe una imagen y devuelve las detecciones con metadatos del agente |
| `POST` | `/describir` | Devuelve la descripción detallada de una clase específica |
| `POST` | `/reporte` | Genera un reporte agregado a partir de múltiples detecciones |

## Autora

**Yessica Pamela Gómez Salinas**  
Escuela Profesional de Ingeniería de Sistemas e Inteligencia Artificial  
Universidad Privada Antenor Orrego · Trujillo, Perú · 2026

## Curso y contexto académico

Proyecto final del curso de Inteligencia Artificial.  
Docente: Teobaldo Hernán Sagástegui Chigne.

## Fuentes y créditos

- **Dataset:** [COSMICA](https://universe.roboflow.com/) (Piratinskii & Rabaev, 2025)
- **Modelo base:** [Ultralytics YOLOv8](https://github.com/ultralytics/ultralytics)
- **Imágenes de ejemplo:** [NASA Image Gallery](https://images.nasa.gov/) · Hubble Space Telescope · James Webb Space Telescope
- **Base de conocimiento astronómica:** información curada desde recursos oficiales de la NASA

## Antecedentes

El sistema se apoya en trabajos previos que validan el uso de arquitecturas YOLO en detección astronómica:

- González et al. (2018) — *AstroCV*: detección automática de galaxias con YOLO y CNN.
- D'Addona et al. (2024) — *DeepSpaceYoloDataset*: imágenes astronómicas anotadas para YOLO.
- Ramos & Rivas-Echeverría (2025) — Análisis comparativo de YOLOv8, v9 y v10 en objetos del cielo profundo.
