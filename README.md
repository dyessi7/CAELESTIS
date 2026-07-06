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
│   │   └── agentBD.json        # Base de
