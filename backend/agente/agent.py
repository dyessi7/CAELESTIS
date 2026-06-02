"""
================================================================================
CAELESTIS AGENT — Sistema de razonamiento basado en reglas
================================================================================

Este módulo implementa el agente del sistema CAELESTIS. El agente recibe las
detecciones generadas por el modelo YOLOv8 (clase + confianza por cada objeto
detectado en la imagen astronómica) y selecciona acciones de respuesta
diferenciadas según el estado del entorno percibido.

CLASIFICACIÓN DEL AGENTE
------------------------
Bajo la jerarquía de Russell & Norvig (2010), CAELESTIS implementa un
**agente reactivo simple**:
    - PERCIBE el entorno → lista de detecciones (clase, confianza)
    - EVALÚA el estado  → reglas sobre clase, confianza y composición
    - ACTÚA            → selecciona respuesta (descripción corta / detallada /
                          reporte agregado), filtra ruido y modula el lenguaje

Análogo al ejemplo clásico de la aspiradora robótica: ésta percibe suciedad
mediante sensores y ejecuta reglas condición-acción (si hay suciedad, succiona).
CAELESTIS percibe detecciones de YOLOv8 (su "sensor") y ejecuta reglas
condición-acción sobre ellas. La complejidad de las reglas o el origen de las
mismas no determina la categoría; lo que define a un agente reactivo es la
estructura percepción → decisión → acción sobre un entorno cuyo estado cambia.

POR QUÉ NO SE USA UN LLM
------------------------
La precisión científica de la información astronómica es crítica en un contexto
educativo. Un agente generativo basado en LLM introduciría riesgo de
alucinación incompatible con esa precisión. Por eso el agente opera sobre una
base de conocimiento curada manualmente y verificada contra fuentes oficiales
de NASA, garantizando que toda información presentada al usuario sea correcta.

SEPARACIÓN DE RESPONSABILIDADES
-------------------------------
    YOLOv8  → componente perceptivo (reconoce qué objetos hay y dónde)
    Agente  → componente decisorio (interpreta la salida del modelo y la
              convierte en respuestas adaptadas al estado de la escena)
    Frontend → componente de presentación (renderiza bounding boxes, paneles,
              reportes según los datos que el agente le entrega)
================================================================================
"""

import json
from pathlib import Path


class CaelestisAgent:
    """
    Agente reactivo basado en reglas y conocimiento estructurado.

    No usa LLM. Opera bajo el ciclo clásico percepción → evaluación → acción
    sobre una base de conocimiento curada (knowledge_base.json).

    El agente expone cuatro acciones públicas, cada una correspondiente a un
    punto distinto del flujo UX del sistema:

        descripcion_corta(clase)
            → alimenta la etiqueta sobre el bounding box.

        metadatos_deteccion(clase, confianza)
            → paquete liviano para que el frontend dibuje cada box con su
              color, nombre, descripción breve y porcentaje de confianza.

        describir_objeto(clase, confianza)
            → respuesta completa para el panel lateral cuando el usuario
              hace hover sostenido sobre un bounding box.

        generar_reporte(detecciones)
            → reporte agregado de la escena completa, generado al presionar
              el botón "Generar informe".
    """

    # --------------------------------------------------------------------------
    # UMBRALES DE DECISIÓN
    # --------------------------------------------------------------------------
    # Estos umbrales definen las zonas de confianza sobre las que el agente
    # razona. Se declaran como constantes de clase (no como números mágicos
    # dispersos por el código) para que sean explícitos, ajustables en un solo
    # lugar y señalables durante la sustentación.
    #
    # El umbral medio (0.50) está informado por las métricas globales del
    # modelo: la clase galaxia mostró el desempeño más bajo (mAP50 = 0.564),
    # por lo que descartar detecciones bajo 0.50 reduce el riesgo de presentar
    # clasificaciones poco fiables al usuario.
    # --------------------------------------------------------------------------
    UMBRAL_ALTO = 0.85    # ≥ 0.85 → certeza alta (lenguaje afirmativo)
    UMBRAL_MEDIO = 0.50   # ≥ 0.50 → certeza media (info plausible con reservas)
                          # <  0.50 → certeza baja (descartar como ruido en reporte)

    # --------------------------------------------------------------------------
    # INICIALIZACIÓN
    # --------------------------------------------------------------------------
    def __init__(self, knowledge_path=None):
        """
        Constructor del agente. Carga la base de conocimiento una sola vez,
        al instanciarse, y la mantiene en memoria durante toda la vida del
        proceso. El backend FastAPI debe crear UNA sola instancia al arrancar
        y reutilizarla en cada petición.

        Parámetros
        ----------
        knowledge_path : str | Path, opcional
            Ruta al archivo JSON con la base de conocimiento. Si no se
            especifica, busca knowledge_base.json en la misma carpeta
            donde reside este archivo agent.py.
        """
        if knowledge_path is None:
            # Path(__file__).parent es robusto: funciona aunque el script se
            # ejecute desde otra carpeta o se importe como módulo.
            knowledge_path = Path(__file__).parent / "agentBD.json"

        with open(knowledge_path, 'r', encoding='utf-8') as f:
            self.knowledge = json.load(f)

        # Mensaje de confirmación útil al arrancar el backend: confirma que
        # la base se cargó correctamente y cuántas clases incluye.
        print(f"Caelestis Agent iniciado ✓ ({len(self.knowledge)} clases cargadas)")

    # --------------------------------------------------------------------------
    # MÉTODO INTERNO: EVALUACIÓN DE CERTEZA
    # --------------------------------------------------------------------------
    def _evaluar_certeza(self, confianza):
        """
        Convierte un valor numérico de confianza en una categoría discreta.
        Este método es el núcleo de evaluación del agente: traduce la
        percepción cruda (un float entre 0 y 1) en un estado sobre el cual
        las reglas pueden razonar.

        El guion bajo inicial es una convención de Python: indica que el
        método es de uso interno (no se llama desde fuera de la clase).

        La misma lógica se reutiliza en tres lugares (describir_objeto,
        metadatos_deteccion, y el filtrado de generar_reporte), por lo que
        centralizarla aquí evita duplicación (principio DRY).

        Returns
        -------
        str: "alta", "media", "baja" o "neutra" (si no se proporcionó confianza)
        """
        if confianza is None:
            return "neutra"
        if confianza >= self.UMBRAL_ALTO:
            return "alta"
        if confianza >= self.UMBRAL_MEDIO:
            return "media"
        return "baja"

    # --------------------------------------------------------------------------
    # ACCIÓN 1 — DESCRIPCIÓN CORTA (etiqueta sobre el bounding box)
    # --------------------------------------------------------------------------
    def descripcion_corta(self, clase):
        """
        Devuelve el texto breve que se renderiza sobre el bounding box.

        Es deliberadamente simple y siempre afirmativo. La incertidumbre NO
        se comunica aquí — se comunica visualmente mediante el color del box
        (decidido por metadatos_deteccion) y el porcentaje de confianza que
        el frontend muestra al lado. Mezclar advertencias en este texto
        rompería la UX porque el espacio sobre el box es mínimo.

        Manejo defensivo: si YOLO devolviera una clase no presente en la
        base de conocimiento (por ejemplo tras re-entrenar con más clases
        sin actualizar el JSON), el agente devuelve un texto genérico en
        lugar de fallar.

        Ejemplo de salida
        -----------------
            descripcion_corta("galaxy") → "Sistema estelar masivo"
        """
        if clase not in self.knowledge:
            return "Objeto celeste no identificado"
        return self.knowledge[clase]["descripcion_corta"]

    # --------------------------------------------------------------------------
    # ACCIÓN 2 — METADATOS DE DETECCIÓN (paquete liviano para el frontend)
    # --------------------------------------------------------------------------
    def metadatos_deteccion(self, clase, confianza):
        """
        Devuelve el paquete mínimo que el frontend necesita para dibujar un
        bounding box: nombre, descripción breve, confianza formateada y
        nivel de certeza (que la UI traduce a color de borde).

        Por qué es un método aparte de describir_objeto:
            Cuando YOLO detecta 8 objetos en una imagen, el frontend llama
            a este método 8 veces (una por box) solo para renderizarlos.
            Devolver aquí la descripción larga, características, ejemplos,
            etc., sería sobrecargar la respuesta inicial. Esa info se carga
            bajo demanda al hacer hover (lazy loading), llamando entonces
            a describir_objeto solo del objeto específico.

        El campo nivel_certeza es lo que permite al frontend decidir el
        estilo visual del box (por ejemplo: alta → verde, media → amarillo,
        baja → rojo o punteado).

        Ejemplo de salida
        -----------------
            {
              "clase": "galaxy",
              "nombre": "Galaxia",
              "descripcion_corta": "Sistema estelar masivo",
              "confianza": 0.94,
              "confianza_pct": "94.0%",
              "nivel_certeza": "alta"
            }
        """
        return {
            "clase": clase,
            "nombre": self.knowledge.get(clase, {}).get("nombre", "Desconocido"),
            "descripcion_corta": self.descripcion_corta(clase),
            "confianza": confianza,
            "confianza_pct": f"{confianza * 100:.1f}%",
            "nivel_certeza": self._evaluar_certeza(confianza),
        }

    # --------------------------------------------------------------------------
    # ACCIÓN 3 — DESCRIPCIÓN DETALLADA (panel lateral en hover sostenido)
    # --------------------------------------------------------------------------
    def describir_objeto(self, clase, confianza=None):
        """
        Devuelve la información completa para el panel lateral derecho:
        nombre, descripciones corta y larga, características, ejemplos,
        dato curioso, registro poético y fuente NASA.

        Aquí está una de las decisiones reactivas del agente: si la
        confianza de la detección es baja, añade un campo `advertencia`
        SEPARADO. El frontend lo renderiza como banner amarillo, ícono,
        o como prefiera la UI — pero la descripción principal NO se
        contamina, sigue siendo la información verificada tal cual.

        Misma clase, misma información base, pero respuesta diferente
        según la confianza. Esa es la regla condición-acción característica
        de un agente reactivo.

        Manejo defensivo: si la clase no existe en la base de conocimiento,
        retorna un dict de error en lugar de fallar.
        """
        if clase not in self.knowledge:
            return {"error": "Clase no reconocida"}

        info = self.knowledge[clase]
        certeza = self._evaluar_certeza(confianza)

        # Empaqueta toda la información del objeto desde la base de
        # conocimiento, más el nivel de certeza derivado.
        respuesta = {
            "nombre": info["nombre"],
            "descripcion_corta": info["descripcion_corta"],
            "descripcion_larga": info["descripcion_larga"],
            "caracteristicas": info["caracteristicas"],
            "ejemplos": info["ejemplos"],
            "dato_curioso": info["dato_curioso"],
            "registro": info["registro"],
            "fuente": info["fuente"],
            "nivel_certeza": certeza,
        }

        # Formatea la confianza como porcentaje legible para mostrar en
        # el panel lateral (ej: "94.0%").
        if confianza is not None:
            respuesta["confianza"] = f"{confianza * 100:.1f}%"

        # DECISIÓN REACTIVA: añadir advertencia solo cuando la certeza
        # es baja. El campo va aparte para que el frontend lo renderice
        # como banner sin alterar la descripción científica principal.
        if certeza == "baja":
            respuesta["advertencia"] = (
                "La confianza de esta detección es baja. "
                "Considera verificar con otras fuentes antes de asumir la clasificación."
            )

        return respuesta

    # --------------------------------------------------------------------------
    # ACCIÓN 4 — REPORTE GENERAL (botón "Generar informe")
    # --------------------------------------------------------------------------
    def generar_reporte(self, detecciones):
        """
        Produce un texto descriptivo de la escena completa, generado a partir
        de la lista de detecciones de YOLO. Es el método más complejo del
        agente y contiene cuatro caminos de decisión distintos según el
        estado de la entrada.

        Parámetros
        ----------
        detecciones : list[dict]
            Lista de detecciones con formato:
                [{"clase": "galaxy", "confianza": 0.94}, ...]

        Decisiones que ejecuta este método
        ----------------------------------
            1. Si la lista está vacía → mensaje orientativo explicando
               posibles causas (cumple un requerimiento funcional explícito).
            2. Filtra detecciones bajo UMBRAL_MEDIO como ruido.
            3. Si tras filtrar no queda nada → declara explícitamente que
               no se reporta clasificación, antes que dar info engañosa.
            4. Si queda una sola detección → reporte enfocado individual.
            5. Si quedan varias → reporte agregado con conteos, ordenadas
               por confianza máxima descendente.
            6. Reporta cuántas detecciones se descartaron (transparencia).
        """
        # --- CAMINO 1: lista vacía ---
        # El agente no devuelve "[]" en seco — explica al usuario qué pudo
        # haber pasado. Cumple el requerimiento funcional de mostrar mensaje
        # orientativo cuando no hay detecciones confiables.
        if not detecciones:
            return (
                "No se identificaron objetos celestes en la imagen.\n"
                "Esto puede deberse a: baja resolución, ausencia de objetos "
                "dentro de las clases entrenadas (cometa, galaxia, cúmulo globular, "
                "nebulosa), o exposición/contraste insuficientes."
            )

        # --- CAMINO 2: filtrado de ruido ---
        # Descarta detecciones bajo el umbral medio. d.get('confianza', 1.0)
        # es defensivo: si una detección no trae el campo confianza, asume
        # 1.0 para no descartarla por accidente.
        detecciones_validas = [
            d for d in detecciones
            if d.get('confianza', 1.0) >= self.UMBRAL_MEDIO
        ]
        descartadas = len(detecciones) - len(detecciones_validas)

        # Si TODAS las detecciones cayeron bajo el umbral, el agente
        # decide explícitamente no clasificar — prefiere callar a
        # presentar información poco fiable. Decisión científica.
        if not detecciones_validas:
            return (
                f"Se detectaron {len(detecciones)} candidatos, pero ninguno "
                f"supera el umbral mínimo de confianza ({self.UMBRAL_MEDIO}). "
                "No se reporta clasificación para evitar información engañosa."
            )

        # Ordena por confianza descendente: las detecciones más fiables
        # aparecerán primero en el reporte.
        detecciones_validas.sort(key=lambda d: d.get('confianza', 0), reverse=True)

        # --- CAMINO 3: una sola detección válida ---
        # Reporte enfocado, sin formato de lista (no tiene sentido
        # para un único objeto).
        if len(detecciones_validas) == 1:
            det = detecciones_validas[0]
            info = self.knowledge.get(det['clase'])
            if not info:
                return "Objeto detectado pero no identificable."
            return (
                f"Caelestis identificó un único objeto en la imagen: "
                f"{info['nombre']} (confianza {det['confianza']*100:.1f}%).\n\n"
                f"{info['descripcion_larga']}"
            )

        # --- CAMINO 4: múltiples detecciones (reporte agregado) ---
        # Paso A: contar instancias por clase y registrar la confianza
        # máxima alcanzada por cada clase (la mejor detección de cada tipo).
        conteo = {}
        confianza_max = {}
        for det in detecciones_validas:
            clase = det['clase']
            conteo[clase] = conteo.get(clase, 0) + 1
            confianza_max[clase] = max(
                confianza_max.get(clase, 0), det.get('confianza', 0)
            )

        total = sum(conteo.values())
        lineas = [
            f"Caelestis identificó {total} objeto(s) celeste(s) en la imagen "
            f"({len(conteo)} clase(s) distinta(s))."
        ]

        # Paso B: ordenar las CLASES por su confianza máxima descendente.
        # La clase con la mejor detección aparece primero, no la más
        # numerosa ni la alfabéticamente primera.
        clases_ordenadas = sorted(
            conteo.keys(), key=lambda c: confianza_max[c], reverse=True
        )

        # Paso C: armar una viñeta por clase con cantidad, confianza máxima
        # y descripción larga desde la base de conocimiento.
        for clase in clases_ordenadas:
            info = self.knowledge.get(clase)
            if not info:
                continue  # clase no reconocida → omitir
            cantidad = conteo[clase]
            plural = "s" if cantidad > 1 else ""
            lineas.append(
                f"\n• {cantidad} {info['nombre']}{plural} "
                f"(confianza máxima {confianza_max[clase]*100:.1f}%): "
                f"{info['descripcion_larga']}"
            )

        # Paso D: si hubo detecciones descartadas, informar al usuario
        # cuántas fueron. Transparencia del agente.
        if descartadas > 0:
            lineas.append(
                f"Nota: se descartaron {descartadas} detección(es) "
                f"por debajo del umbral mínimo de confianza."
            )

        return "\n".join(lineas)


# ==============================================================================
# PRUEBAS RÁPIDAS
# ==============================================================================
# Se ejecutan solo cuando este archivo se corre directamente con:
#     python agent.py
#
# Cuando el archivo se importa desde otro módulo (por ejemplo desde el backend
# FastAPI), este bloque NO se ejecuta — gracias a la condición __name__ == "__main__".
#
# Estas pruebas verifican que cada uno de los caminos de decisión del agente
# se comporta como se espera. Si algo no se ve bien, se ajusta antes de
# conectar el agente al backend.
# ==============================================================================
if __name__ == "__main__":
    agent = CaelestisAgent()

    print("\n--- Prueba 1: descripción corta (texto limpio para bounding box) ---")
    print(agent.descripcion_corta("galaxy"))

    print("\n--- Prueba 2: metadatos para el frontend (confianza alta) ---")
    print(json.dumps(
        agent.metadatos_deteccion("galaxy", 0.94),
        indent=2, ensure_ascii=False
    ))

    print("\n--- Prueba 3: metadatos para el frontend (confianza baja) ---")
    print(json.dumps(
        agent.metadatos_deteccion("comet", 0.42),
        indent=2, ensure_ascii=False
    ))

    print("\n--- Prueba 4: panel lateral con baja confianza (incluye advertencia) ---")
    info = agent.describir_objeto("nebula", confianza=0.40)
    print(json.dumps(info, indent=2, ensure_ascii=False))

    print("\n--- Prueba 5: reporte sin detecciones (mensaje orientativo) ---")
    print(agent.generar_reporte([]))

    print("\n--- Prueba 6: reporte con una sola detección (formato enfocado) ---")
    print(agent.generar_reporte([{"clase": "nebula", "confianza": 0.87}]))

    print("\n--- Prueba 7: reporte agregado con descarte de ruido ---")
    detecciones = [
        {"clase": "galaxy", "confianza": 0.94},
        {"clase": "galaxy", "confianza": 0.87},
        {"clase": "nebula", "confianza": 0.81},
        {"clase": "comet", "confianza": 0.45},  # bajo umbral → se descarta
    ]
    print(agent.generar_reporte(detecciones))