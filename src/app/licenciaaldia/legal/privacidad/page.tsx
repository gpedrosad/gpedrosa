import Link from "next/link";
import { AiOutlineArrowLeft } from "react-icons/ai";

export default function PrivacidadPage() {
  return (
    <div className="px-6 py-12 md:px-12 max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/licenciaaldia" className="inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors group">
          <AiOutlineArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Volver
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-8 text-black tracking-tight">Política de Privacidad</h1>
      
      <div className="prose prose-gray prose-headings:font-bold prose-headings:text-black prose-p:text-gray-600 prose-li:text-gray-600 max-w-none">
        <p>
          Respetamos tu privacidad. Así manejamos tus datos:
        </p>

        <h3>1. Recopilación</h3>
        <p>
          Solo pedimos lo necesario para redactar tu reclamo (contacto, datos del rechazo, documentos).
        </p>

        <h3>2. Uso</h3>
        <p>
          Generar el documento y contactarte. No vendemos datos.
        </p>

        <h3>3. Contacto</h3>
        <p>
          Para borrar tus datos escribe a contacto@gpedrosa.cl
        </p>
      </div>
    </div>
  );
}
