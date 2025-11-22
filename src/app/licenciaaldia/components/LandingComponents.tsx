"use client";

import { motion } from "framer-motion";

export function SuccessRate() {
  return (
    <div className="w-full flex justify-center mb-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="inline-flex items-center gap-3 bg-green-50 border border-green-100 px-6 py-3 rounded-full shadow-sm"
      >
        <div className="flex -space-x-1">
        </div>
        <span className="text-black font-semibold text-sm md:text-base">
          El 97% de las licencias rechazadas han sido apeladas con éxito
        </span>
      </motion.div>
    </div>
  );
}

export function Testimonials() {
  const comments = [
    {
      text: "No pensé que fuera tan rápido. Envié los datos en la mañana y en la tarde ya tenía el documento listo en mi correo. Me ahorré semanas de estrés.",
      author: "Camila R.",
      role: "Licencia rechazada por Isapre",
    },
    {
      text: "Cotizé con abogados y me cobraban una fortuna. Acá pagué una vez y el reclamo quedó súper profesional. Lo presenté y me lo aceptaron.",
      author: "Felipe M.",
      role: "Licencia rechazada por Compin",
    },
    {
      text: "Súper claro y fácil. No sabía qué poner en la carta de apelación y esto me solucionó todo. El formato es justo lo que piden.",
      author: "Andrea S.",
      role: "Licencia rechazada por Isapre",
    }
  ];

  return (
    <section className="py-20 bg-white border-t border-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 tracking-tight">Lo que dicen quienes ya apelaron</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {comments.map((comment, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
            >
              <p className="text-gray-700 mb-6 leading-relaxed">"{comment.text}"</p>
              <div>
                <div className="font-bold text-black">{comment.author}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">{comment.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

