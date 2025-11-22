"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AiOutlineWhatsApp, AiOutlineCheckCircle, AiOutlineCopy } from "react-icons/ai";

function GraciasContent() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");
  const [whatsappLink, setWhatsappLink] = useState("#");

  useEffect(() => {
    if (caseId) {
      // TODO: Number
      const phoneNumber = "56968257817"; 
      const message = `Hola, quisiera finalizar mi reclamo de licencia médica. Mi ID de caso es: ${caseId}`;
      setWhatsappLink(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
    }
  }, [caseId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center max-w-lg mx-auto">
      <div className="mb-8 text-black">
        <AiOutlineCheckCircle className="text-6xl mx-auto" />
      </div>
      
      <h1 className="text-3xl font-bold text-black mb-4 tracking-tight">
        Caso Recibido
      </h1>

      <p className="text-gray-600 mb-8">
        Hemos recibido tus antecedentes correctamente. Finaliza el proceso contactándonos por WhatsApp para coordinar el pago y la entrega.
      </p>

      <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl w-full mb-8">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">ID de Caso</div>
        <div className="flex items-center justify-center gap-2">
            <code className="text-2xl font-mono font-bold text-black">{caseId || "..."}</code>
        </div>
      </div>

      <div className="flex flex-col w-full gap-4">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-black text-white font-medium py-4 px-6 rounded-xl hover:bg-gray-800 transition-all active:scale-95"
        >
          <AiOutlineWhatsApp className="text-xl" />
          Finalizar por WhatsApp
        </a>
        <p className="text-xs text-gray-400">
            Coordinamos el pago de $14.990 vía transferencia.
        </p>
      </div>
    </div>
  );
}

export default function GraciasPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Cargando...</div>}>
      <GraciasContent />
    </Suspense>
  );
}
