import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Gonzalo Pedrosa",
  description: "Términos y Condiciones de uso del servicio",
  robots: { index: true, follow: true },
};

export default function Terminos() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Términos y Condiciones
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-CL')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Aceptación de los términos
            </h2>
            <p className="text-gray-700 mb-4">
              Al acceder y utilizar este sitio web, aceptas estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar este sitio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Descripción del servicio
            </h2>
            <p className="text-gray-700 mb-4">
              Este sitio web proporciona información sobre servicios de acompañamiento online. Los servicios ofrecidos son de carácter informativo y de acompañamiento, no constituyen servicios médicos, psicológicos o terapéuticos profesionales.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Uso del sitio web
            </h2>
            <p className="text-gray-700 mb-4">
              Te comprometes a utilizar este sitio web de manera responsable y legal. No debes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Utilizar el sitio para actividades ilegales o no autorizadas</li>
              <li>Interferir con el funcionamiento del sitio</li>
              <li>Intentar acceder a áreas restringidas del sitio</li>
              <li>Transmitir virus, malware o código malicioso</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Limitación de responsabilidad
            </h2>
            <p className="text-gray-700 mb-4">
              Este sitio web se proporciona "tal como está" sin garantías de ningún tipo. No nos hacemos responsables de:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>La exactitud, completitud o actualidad de la información</li>
              <li>Daños directos, indirectos o consecuenciales</li>
              <li>Pérdida de datos o interrupciones del servicio</li>
              <li>Decisiones tomadas basándose en la información del sitio</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Propiedad intelectual
            </h2>
            <p className="text-gray-700 mb-4">
              Todo el contenido de este sitio web, incluyendo textos, imágenes, logos y diseño, está protegido por derechos de autor y otras leyes de propiedad intelectual. No puedes reproducir, distribuir o modificar este contenido sin autorización expresa.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Enlaces a terceros
            </h2>
            <p className="text-gray-700 mb-4">
              Este sitio puede contener enlaces a sitios web de terceros. No somos responsables del contenido, políticas de privacidad o prácticas de estos sitios externos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Modificaciones
            </h2>
            <p className="text-gray-700 mb-4">
              Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Terminación
            </h2>
            <p className="text-gray-700 mb-4">
              Podemos suspender o terminar tu acceso al sitio web en cualquier momento, sin previo aviso, por cualquier motivo, incluyendo la violación de estos términos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Ley aplicable
            </h2>
            <p className="text-gray-700 mb-4">
              Estos términos se rigen por las leyes de Chile. Cualquier disputa será resuelta en los tribunales competentes de Chile.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Contacto
            </h2>
            <p className="text-gray-700 mb-4">
              Si tienes preguntas sobre estos Términos y Condiciones, puedes contactarnos en:
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Email:</strong> gpedrosadom@gmail.com<br />
              <strong>WhatsApp:</strong> +56968257817
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
