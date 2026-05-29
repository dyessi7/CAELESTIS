"""
Caelestis API — Servidor FastAPI.

Expone el detector y el agente como una API HTTP que el frontend consume.
Define cinco endpoints: detección de objetos, descripción detallada,
generación de reporte, métricas del modelo y verificación de estado.
"""

from pathlib import Path
from io import BytesIO

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

from detector import CaelestisDetector
from agente.agent import CaelestisAgent


# ------------------------------------------------------------------------------
# Inicialización del servidor y de los componentes
# ------------------------------------------------------------------------------

app = FastAPI(
    title="Caelestis API",
    description="Detección y descripción automática de objetos celestes.",
    version="1.0.0",
)

# Configuración de CORS para permitir peticiones del frontend.
# En desarrollo se permite cualquier origen; en producción se restringe
# al dominio del frontend desplegado en Vercel.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Detector y agente se instancian una sola vez al arrancar el servidor.
# Cargar el modelo YOLO tarda 1-2 segundos; hacerlo por petición sería
# inviable. La misma instancia atiende todas las peticiones concurrentes.
detector = CaelestisDetector()
agente = CaelestisAgent()


# ------------------------------------------------------------------------------
# Modelos de datos (validación automática de Pydantic)
# ------------------------------------------------------------------------------

class DescripcionRequest(BaseModel):
    """Cuerpo esperado por el endpoint /describir."""
    clase: str
    confianza: float | None = None


class Deteccion(BaseModel):
    """Detección individual que llega al endpoint /reporte."""
    clase: str
    confianza: float


class ReporteRequest(BaseModel):
    """Cuerpo esperado por el endpoint /reporte."""
    detecciones: list[Deteccion]


# ------------------------------------------------------------------------------
# Endpoints
# ------------------------------------------------------------------------------

@app.get("/salud")
def salud():
    """Verifica que el servidor está activo."""
    return {"status": "ok", "servicio": "Caelestis API"}


@app.post("/detectar")
async def detectar(archivo: UploadFile = File(...)):
    """
    Detecta objetos celestes en una imagen.

    Recibe una imagen vía multipart/form-data, ejecuta inferencia con YOLOv8,
    enriquece cada detección con metadatos del agente (nombre, descripción
    corta, nivel de certeza) y devuelve el conjunto completo listo para
    renderizar los bounding boxes en el frontend.
    """
    # Validar que el archivo es una imagen.
    if not archivo.content_type or not archivo.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="El archivo debe ser una imagen."
        )

    try:
        contenido = await archivo.read()
        imagen = Image.open(BytesIO(contenido))
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="No se pudo procesar la imagen."
        )

    # Inferencia con YOLOv8.
    detecciones_crudas = detector.detectar(imagen)

    # Enriquecer cada detección con los metadatos del agente.
    detecciones_enriquecidas = []
    for det in detecciones_crudas:
        metadatos = agente.metadatos_deteccion(det["clase"], det["confianza"])
        detecciones_enriquecidas.append({
            **metadatos,
            "bbox": det["bbox"],
        })

    return {
        "total": len(detecciones_enriquecidas),
        "imagen_ancho": imagen.width,
        "imagen_alto": imagen.height,
        "detecciones": detecciones_enriquecidas,
    }


@app.post("/describir")
def describir(peticion: DescripcionRequest):
    """
    Devuelve la información detallada de un objeto para el panel lateral.

    Se invoca cuando el usuario hace hover sostenido sobre un bounding box
    en el frontend.
    """
    resultado = agente.describir_objeto(peticion.clase, peticion.confianza)

    if "error" in resultado:
        raise HTTPException(status_code=404, detail=resultado["error"])

    return resultado


@app.post("/reporte")
def reporte(peticion: ReporteRequest):
    """
    Genera un reporte descriptivo de la escena completa.

    Se invoca cuando el usuario presiona el botón "Generar informe" en el
    frontend.
    """
    detecciones_dict = [d.model_dump() for d in peticion.detecciones]
    texto = agente.generar_reporte(detecciones_dict)
    return {"reporte": texto}


@app.get("/metricas")
def metricas():
    """
    Devuelve las métricas de evaluación del modelo en el conjunto de test.

    Estas métricas se incluyen en la sección informativa del frontend.
    """
    return {
        "modelo": "YOLOv8n entrenado sobre COSMICA",
        "epochs": 50,
        "global": {
            "mAP50": 0.746,
            "mAP50_95": 0.438,
            "precision": 0.797,
            "recall": 0.678,
        },
        "por_clase": {
            "globular_cluster": {"mAP50": 0.931},
            "nebula": {"mAP50": 0.791},
            "comet": {"mAP50": 0.698},
            "galaxy": {"mAP50": 0.564},
        },
    }