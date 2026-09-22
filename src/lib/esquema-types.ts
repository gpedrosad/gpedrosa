export type TipoNodo = "flujo" | "criterio";

export type DimensionEvaluacion = {
  nombre: string;
  puntuacion: number;
  justificacion: string;
};

export type EvaluacionG = {
  puntuacion: number;
  nivel: "baja" | "media" | "alta";
  resumen: string;
  dimensiones: DimensionEvaluacion[];
  aciertos: string[];
  brechas: string[];
  recomendacion: string;
  evaluadoEn: string;
};

export type Nodo = {
  id: string;
  titulo: string;
  archivo: string;
  cuerpo: string;
  x: number;
  y: number;
  tipo: TipoNodo;
};

export type Enlace = {
  id: string;
  desde: string;
  hasta: string;
  criterio: string;
  evaluacion?: EvaluacionG;
};

export type Esquema = {
  nodos: Nodo[];
  enlaces: Enlace[];
};

export type PiezaNodo = {
  id: string;
  titulo: string;
  archivo: string;
  x: number;
  y: number;
  tipo?: TipoNodo;
};

export type PiezaEnlace = {
  id: string;
  desde: string;
  hasta: string;
  criterio?: string;
  archivo?: string;
  evaluacion?: EvaluacionG;
};
