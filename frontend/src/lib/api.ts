// URL base del backend. Cambia automáticamente entre desarrollo y producción.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// === Tipos de TypeScript ===
// Estos describen la estructura exacta de los datos que vienen del backend.
// TypeScript nos ayudará a no equivocarnos al usarlos.

export type NivelCerteza = "alta" | "media" | "baja" | "neutra";

export type Deteccion = {
  clase: string;
  nombre: string;
  descripcion_corta: string;
  confianza: number;
  confianza_pct: string;
  nivel_certeza: NivelCerteza;
  bbox: [number, number, number, number]; // [x1, y1, x2, y2]
};

export type RespuestaDeteccion = {
  total: number;
  imagen_ancho: number;
  imagen_alto: number;
  detecciones: Deteccion[];
};

export type DescripcionObjeto = {
  nombre: string;
  descripcion_larga: string;
  caracteristicas: string[];
  ejemplos: string[];
  dato_curioso: string;
  registro: string;
  fuente: string;
  nivel_certeza: NivelCerteza;
  advertencia?: string;
};

export type RespuestaReporte = {
  reporte: string;
};

export type Metricas = {
  modelo: string;
  epochs: number;
  global: {
    mAP50: number;
    mAP50_95: number;
    precision: number;
    recall: number;
  };
  por_clase: Record<string, { mAP50: number }>;
};

// === Funciones que llaman al backend ===

/**
 * Sube una imagen al backend y recibe las detecciones enriquecidas
 * con metadatos del agente.
 */
export async function detectarImagen(archivo: File): Promise<RespuestaDeteccion> {
  const formData = new FormData();
  formData.append("archivo", archivo);

  const respuesta = await fetch(`${API_URL}/detectar`, {
    method: "POST",
    body: formData,
  });

  if (!respuesta.ok) {
    throw new Error(`Error al detectar: ${respuesta.statusText}`);
  }

  return respuesta.json();
}

/**
 * Pide al agente la descripción detallada de un objeto detectado.
 * Se usa al hacer hover sobre un bounding box.
 */
export async function describirObjeto(
  clase: string,
  confianza: number
): Promise<DescripcionObjeto> {
  const respuesta = await fetch(`${API_URL}/describir`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clase, confianza }),
  });

  if (!respuesta.ok) {
    throw new Error(`Error al describir: ${respuesta.statusText}`);
  }

  return respuesta.json();
}

/**
 * Pide al agente un reporte agregado de todas las detecciones.
 */
export async function generarReporte(
  detecciones: Array<{ clase: string; confianza: number }>
): Promise<RespuestaReporte> {
  const respuesta = await fetch(`${API_URL}/reporte`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ detecciones }),
  });

  if (!respuesta.ok) {
    throw new Error(`Error al generar reporte: ${respuesta.statusText}`);
  }

  return respuesta.json();
}

/**
 * Obtiene las métricas del modelo (mAP, precision, recall, etc.).
 */
export async function obtenerMetricas(): Promise<Metricas> {
  const respuesta = await fetch(`${API_URL}/metricas`);

  if (!respuesta.ok) {
    throw new Error(`Error al obtener métricas: ${respuesta.statusText}`);
  }

  return respuesta.json();
}