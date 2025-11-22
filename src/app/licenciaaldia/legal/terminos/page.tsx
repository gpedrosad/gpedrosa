import Link from "next/link";
import { AiOutlineArrowLeft } from "react-icons/ai";

export default function TerminosPage() {
  return (
    <div className="px-6 py-12 md:px-12 max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/licenciaaldia" className="inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors group">
          <AiOutlineArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Volver
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-8 text-black tracking-tight">Términos y Condiciones</h1>
      
      <div className="prose prose-gray prose-headings:font-bold prose-headings:text-black prose-p:text-gray-600 prose-li:text-gray-600 max-w-none">
        <p>
          Bienvenido a LicenciaAlDia. Al utilizar nuestro servicio, aceptas los siguientes términos:
        </p>

        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Naturaleza del servicio:</strong> Herramienta de autogestión documental. No somos estudio jurídico.
          </li>
          <li>
            <strong>Responsabilidad:</strong> Tú eres responsable de revisar y presentar el reclamo.
          </li>
          <li>
            <strong>Sin garantías:</strong> No aseguramos el pago de la licencia, solo la correcta formulación del reclamo.
          </li>
          <li>
            <strong>Independencia:</strong> No pertenecemos a Isapres ni al Estado.
          </li>
        </ul>
      </div>
    </div>
  );
}
