// src/app/contacto/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contacto | Gonzalo Pedrosa",
  description: "Información de contacto y formas de comunicación",
  robots: { index: true, follow: true },
};

export default function Contacto() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Contacto</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8 text-xl">
            Estoy aquí para ayudarte. Puedes contactarme a través de los siguientes medios:
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </h2>
              <p className="text-gray-700 mb-4">Para consultas generales, puedes escribirme a:</p>
              <a
                href="mailto:gpedrosadom@gmail.com"
                className="text-blue-600 hover:text-blue-800 font-medium text-lg"
              >
                gpedrosadom@gmail.com
              </a>
              <p className="text-gray-600 text-sm mt-2">Te responderé en un plazo de 24-48 horas.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                WhatsApp
              </h2>
              <p className="text-gray-700 mb-4">Para comunicación directa y agendamiento:</p>
              <a
                href="https://wa.me/56968257817?text=Hola%20Gonzalo%2C%20quisiera%20agendar%20una%20sesi%C3%B3n"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 font-medium text-lg"
              >
                +56968257817
              </a>
              <p className="text-gray-600 text-sm mt-2">Disponible de lunes a viernes, 9:00 - 18:00 hrs.</p>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Horarios de atención</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <ul className="text-gray-700 space-y-2">
                <li><strong>Lunes a Viernes:</strong> 9:00 - 18:00 hrs</li>
                <li><strong>Sábados:</strong> 9:00 - 13:00 hrs</li>
                <li><strong>Domingos:</strong> Cerrado</li>
              </ul>
              <p className="text-gray-600 text-sm mt-4">
                * Los horarios pueden variar según disponibilidad. Te confirmaré el horario exacto al contactarte.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Información importante</h2>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                <strong>Nota:</strong> Los servicios ofrecidos son de acompañamiento online y no constituyen servicios médicos, psicológicos o terapéuticos profesionales.
              </p>
              <p className="text-gray-700">
                Si necesitas atención médica o psicológica urgente, te recomiendo contactar a los servicios de emergencia correspondientes.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tiempo de respuesta</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-700">24-48 horas</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">WhatsApp</h3>
                <p className="text-gray-700">Durante horarios de atención</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}