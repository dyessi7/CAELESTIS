"""
Caelestis Detector — Capa de visión por computadora.

Encapsula el modelo YOLOv8 entrenado y expone una interfaz simple para
correr detección sobre imágenes. Convierte la salida cruda del modelo en
una lista estructurada de detecciones lista para ser consumida por el
agente y por el servidor FastAPI.
"""

from pathlib import Path
from ultralytics import YOLO


class CaelestisDetector:
    """
    Envoltorio del modelo YOLOv8 entrenado sobre el dataset COSMICA.

    El modelo se carga una sola vez al instanciar la clase y permanece en
    memoria durante toda la vida del proceso. El backend debe crear una
    única instancia al arrancar el servidor para evitar recargar el modelo
    en cada petición.
    """

    # Confianza mínima para incluir una detección en los resultados.
    # Es un primer filtro grueso: descarta predicciones evidentemente ruido
    # antes de pasar los resultados al agente, que aplica un segundo filtro
    # más estricto al armar el reporte final.
    UMBRAL_CONFIANZA = 0.25

    def __init__(self, ruta_modelo=None):
        """
        Carga el modelo YOLOv8 desde disco.

        Parámetros
        ----------
        ruta_modelo : str | Path, opcional
            Ruta al archivo best.pt. Si no se especifica, se busca en
            backend/modelo/best.pt relativo a la ubicación de este archivo.
        """
        if ruta_modelo is None:
            ruta_modelo = Path(__file__).parent / "modelo" / "best.pt"

        self.modelo = YOLO(str(ruta_modelo))

        # Los nombres de las clases quedaron guardados dentro del .pt
        # cuando se entrenó el modelo. Se recuperan aquí como diccionario
        # {0: 'comet', 1: 'galaxy', ...} para mapear índices a nombres.
        self.clases = self.modelo.names

        print(f"Caelestis Detector iniciado ✓")
        print(f"  Modelo cargado desde: {ruta_modelo}")
        print(f"  Clases reconocidas: {list(self.clases.values())}")

    def detectar(self, imagen):
        """
        Ejecuta detección sobre una imagen.

        Parámetros
        ----------
        imagen : str | Path | PIL.Image | numpy.ndarray | bytes
            Imagen a procesar. Ultralytics acepta múltiples formatos.

        Retorna
        -------
        list[dict]
            Lista de detecciones con el formato:
                [{"clase": str, "confianza": float, "bbox": [x1, y1, x2, y2]}, ...]
            Las coordenadas están en píxeles absolutos sobre la imagen
            original. Si no hay detecciones sobre el umbral, retorna [].
        """
        resultados = self.modelo(
            imagen,
            conf=self.UMBRAL_CONFIANZA,
            verbose=False
        )

        resultado = resultados[0]
        cajas = resultado.boxes

        if cajas is None or len(cajas) == 0:
            return []

        detecciones = []
        for i in range(len(cajas)):
            # Conversión de tensores PyTorch a tipos nativos de Python
            # para que el JSON del API pueda serializarlos.
            bbox = [round(coord, 2) for coord in cajas.xyxy[i].tolist()]
            confianza = round(float(cajas.conf[i]), 4)
            nombre_clase = self.clases[int(cajas.cls[i])]

            detecciones.append({
                "clase": nombre_clase,
                "confianza": confianza,
                "bbox": bbox,
            })

        return detecciones


if __name__ == "__main__":
    # Prueba 1: verificar que el modelo se carga correctamente.
    detector = CaelestisDetector()

    # Prueba 2: detectar sobre una imagen de ejemplo si existe.
    # Cambiar la ruta a una imagen real disponible localmente.
    ruta_imagen_prueba = "C:/PROYECTOS/IA\CAELESTIS/backend/modelo/1.webp"

    if Path(ruta_imagen_prueba).exists():
        detecciones = detector.detectar(ruta_imagen_prueba)
        print(f"\nSe encontraron {len(detecciones)} detección(es):")
        for det in detecciones:
            print(f"  - {det}")
    else:
        print(f"\nOmitiendo prueba de inferencia: no se encontró {ruta_imagen_prueba}")