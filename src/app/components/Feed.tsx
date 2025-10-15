// src/app/components/Feed.tsx
"use client";

import React from "react";
import { AiFillStar } from "react-icons/ai";
import { MdVerified } from "react-icons/md";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";

interface Entry {
  id: string;
  created_at: string; // ISO
  body: string;
  score: number; // 1..5
  author: string;
}

/** Formatea fecha local sencilla */
function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch {
    return "";
  }
}

const Feed: React.FC = () => {
  // DATA con redacción neutra/compatible
  const entries: Entry[] = [
    {
      id: "14",
      created_at: "2025-04-15T11:30:00Z",
      body:
        "Me sentí muy cómoda en las sesiones; la experiencia fue excelente.",
      score: 5,
      author: "Sofia Hernandez",
    },
    {
      id: "13",
      created_at: "2025-04-10T10:45:00Z",
      body:
        "Muy buen profesional, atento y disponible durante el proceso.",
      score: 5,
      author: "Yocelyn",
    },
    {
      id: "12",
      created_at: "2025-04-05T09:30:00Z",
      body:
        "Gonzalo acompaña a mi hijo hace varios meses. Se ha sentido cómodo con las sesiones. Es responsable, puntual y comprometido; conversar con él genera confianza.",
      score: 5,
      author: "Claudia",
    },
    {
      id: "11",
      created_at: "2025-03-30T11:00:00Z",
      body:
        "Lo conocí en un momento complejo y, con su escucha y claridad, pude mirar las situaciones desde otra perspectiva. Trato agradable y profesional.",
      score: 5,
      author: "Karen",
    },
    {
      id: "10",
      created_at: "2025-03-25T10:15:00Z",
      body:
        "Me pareció un profesional excelente. Sus preguntas y orientaciones me ayudaron a ordenar ideas y avanzar. Agradezco la experiencia y lo recomendaría.",
      score: 5,
      author: "Valeska Bravo Montecinos",
    },
    {
      id: "9",
      created_at: "2025-03-20T13:45:00Z",
      body: "Muy buen profesional. Empático. Lo recomiendo.",
      score: 5,
      author: "Emiliana Vera",
    },
    {
      id: "8",
      created_at: "2025-03-15T16:30:00Z",
      body:
        "El acompañamiento me ayudó a reconocer límites, valorar mis recursos y tomar decisiones con mayor claridad. Pude observar situaciones desde distintos puntos de vista y actuar con más seguridad.",
      score: 5,
      author: "Evelyn",
    },
    {
      id: "7",
      created_at: "2025-03-10T14:00:00Z",
      body:
        "Excelente profesional; el proceso me resultó de gran ayuda.",
      score: 5,
      author: "Daniela Quevedo",
    },
    {
      id: "1",
      created_at: "2025-03-01T10:00:00Z",
      body:
        "Las sesiones me sirvieron para recuperar motivación y retomar actividades. La atención fue profesional y personalizada, con resultados visibles en mi día a día.",
      score: 5,
      author: "Paulina Rodriguez",
    },
    {
      id: "2",
      created_at: "2025-02-25T15:30:00Z",
      body:
        "Noté una preocupación genuina por mi proceso y avances. Su guía fue clara y útil. Recomendado.",
      score: 5,
      author: "Nicolás Gresve P.",
    },
    {
      id: "3",
      created_at: "2025-02-20T12:15:00Z",
      body:
        "Profesional abierto y respetuoso. Me ayudó a clarificar rumbo y a poner límites cuando era necesario. Salí de cada encuentro con herramientas prácticas.",
      score: 5,
      author: "Giovanna",
    },
    {
      id: "4",
      created_at: "2025-02-15T09:00:00Z",
      body:
        "Experiencia muy buena. Me sentí respetada y acompañada; el trabajo fue puntual y profesional.",
      score: 5,
      author: "Irene Muñoz Weber",
    },
    {
      id: "5",
      created_at: "2025-02-10T14:45:00Z",
      body:
        "Desde la primera sesión me sentí cómoda. Las conversaciones me ayudaron a ordenar pensamientos y ver el pasado, presente y futuro con mayor perspectiva. Trato amable y preocupado.",
      score: 5,
      author: "Barbara Quijada",
    },
  ];

  const averageScore =
    entries.length > 0
      ? (entries.reduce((acc, e) => acc + e.score, 0) / entries.length).toFixed(1)
      : "0.0";

  const renderStars = (rating: number) => {
    const rounded = Math.round(rating);
    return (
      <div className="flex text-[#FFB703]">
        {Array.from({ length: 5 }, (_, i) => (
          <AiFillStar key={i} size={26} className={i < rounded ? "" : "opacity-40"} />
        ))}
      </div>
    );
  };

  // Animación suave (sin condicionar contenido a UA/interacción)
  const reduceMotion = useReducedMotion();
  const listVariants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.12, delayChildren: 0.12 },
    },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "easeOut" as const } },
  };

  return (
    <div className="mx-auto p-4 m-8">
      {/* Encabezado / Resumen neutral */}
      <h2 className="text-xl font-bold mb-4 text-center">Comentarios</h2>
      <div className="flex flex-col items-center space-y-2 mb-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-3xl font-bold">{averageScore}</span>
            {renderStars(parseFloat(averageScore))}
          </div>
          <p className="text-gray-500 text-md mt-2">Muestra de 281 mensajes</p>
        </div>
      </div>

      <div className="flex items-center bg-blue-50 p-2 rounded-xl text-gray-600 mb-6">
        <MdVerified className="text-black mr-2 w-8 h-8" />
        <span className="text-black">
          Solo quienes asistieron dejaron un mensaje.
        </span>
      </div>

      {/* Lista */}
      <AnimatePresence initial={false}>
        <motion.div className="space-y-8" variants={listVariants} initial="hidden" animate="visible">
          {entries.map((e) => (
            <motion.div key={e.id} className="border-b border-gray-200 pb-4" variants={itemVariants}>
              <div className="flex flex-col items-start space-y-1">
                <span className="font-semibold flex-1 text-lg">{e.author}</span>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center text-[#FFB703] space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <AiFillStar key={i} size={20} className={i < e.score ? "" : "opacity-40"} />
                    ))}
                    <span className="text-gray-500 text-sm ml-2">・{formatDate(e.created_at)}</span>
                  </div>
                </div>
              </div>
              {e.body && (
                <p className="text-gray-600 mt-2 whitespace-pre-line">{e.body}</p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Feed;