import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | Gonzalo Pedrosa",
  description: "Política de Privacidad y uso de datos personales",
  robots: { index: true, follow: true },
};

export default function Privacidad() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Política de Privacidad
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-CL')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Información que recopilamos
            </h2>
            <p className="text-gray-700 mb-4">
              Recopilamos información que nos proporcionas directamente, como:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Nombre y datos de contacto</li>
              <li>Información de comunicación (email, WhatsApp)</li>
              <li>Cualquier otra información que decidas compartir</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Uso de cookies y tecnologías de seguimiento
            </h2>
            <p className="text-gray-700 mb-4">
              Este sitio web utiliza cookies y tecnologías similares para mejorar tu experiencia de navegación y analizar el uso del sitio.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Facebook Pixel:</strong> Utilizamos Facebook Pixel para medir la efectividad de nuestra publicidad y proporcionar anuncios relevantes. Esta herramienta puede recopilar información sobre tu actividad en el sitio web.
            </p>
            <p className="text-gray-700 mb-4">
              Puedes controlar las cookies a través de la configuración de tu navegador.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Cómo utilizamos tu información
            </h2>
            <p className="text-gray-700 mb-4">
              Utilizamos la información recopilada para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Responder a tus consultas y solicitudes</li>
              <li>Proporcionar el servicio solicitado</li>
              <li>Mejorar nuestro sitio web y servicios</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Compartir información
            </h2>
            <p className="text-gray-700 mb-4">
              No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Cuando sea necesario para proporcionar el servicio</li>
              <li>Cuando sea requerido por ley</li>
              <li>Con tu consentimiento explícito</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Seguridad de los datos
            </h2>
            <p className="text-gray-700 mb-4">
              Implementamos medidas de seguridad apropiadas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Tus derechos
            </h2>
            <p className="text-gray-700 mb-4">
              Tienes derecho a:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Acceder a tu información personal</li>
              <li>Corregir información inexacta</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Retirar tu consentimiento en cualquier momento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Contacto
            </h2>
            <p className="text-gray-700 mb-4">
              Si tienes preguntas sobre esta Política de Privacidad, puedes contactarnos en:
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Email:</strong> gpedrosadom@gmail.com<br />
              <strong>WhatsApp:</strong> +56968257817
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Cambios a esta política
            </h2>
            <p className="text-gray-700 mb-4">
              Nos reservamos el derecho de actualizar esta Política de Privacidad. Te notificaremos sobre cambios significativos publicando la nueva política en esta página.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <a 
            href="/perfil" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
