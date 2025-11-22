import Link from "next/link";
import { 
  AiOutlineArrowRight, 
  AiOutlineCheck, 
  AiOutlineFileText, 
  AiOutlineCloudUpload, 
  AiOutlineSafety,
  AiOutlineQuestionCircle
} from "react-icons/ai";
import { SuccessRate, Testimonials } from "./components/LandingComponents";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Navbar Minimalista */}
      <nav className="border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="font-bold text-lg tracking-tight">LicenciaAlDia</div>
        <Link href="/licenciaaldia/caso" className="text-sm font-medium hover:text-gray-600 transition-colors">
          Iniciar reclamo
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32 text-center max-w-5xl mx-auto">
        <SuccessRate />
        <h1 className="text-5xl md:text-7xl font-extrabold text-black mb-8 tracking-tighter leading-[1.1]">
          Tu licencia médica rechazada, <br className="hidden md:block" />
          <span className="text-gray-500">tu reclamo listo en minutos.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Generamos un texto formal y estructurado para presentar ante Isapre, Compin o SUSESO. Sin complicaciones.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link
            href="/licenciaaldia/caso"
            className="group flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-all active:scale-95"
          >
            Iniciar reclamo
            <AiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#como-funciona"
            className="px-8 py-4 rounded-full font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
          >
            Cómo funciona
          </a>
        </div>

        <p className="text-xs text-gray-400 max-w-lg mx-auto mb-10">
          LicenciaAlDia es una herramienta de autogestión documental. No reemplaza asesoría jurídica ni atención médica. Servicio válido para licencias médicas emitidas en Chile.
        </p>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-gray-500">
          <div className="flex items-center gap-2">
            <AiOutlineCheck className="text-black" /> Texto listo para presentar
          </div>
          <div className="flex items-center gap-2">
            <AiOutlineCheck className="text-black" /> Checklist de documentos habituales
          </div>
          <div className="flex items-center gap-2">
            <AiOutlineCheck className="text-black" /> Sin ir a oficina, 100% online
          </div>
          <div className="flex items-center gap-2">
            <AiOutlineCheck className="text-black" /> PDF formal en 24hrs hábiles
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="px-6 py-24 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl text-black border border-gray-100">
                1
              </div>
              <h3 className="text-xl font-bold">Cuéntanos el caso</h3>
              <p className="text-gray-600 leading-relaxed">
                Indica quién rechazó tu licencia (Isapre/Compin) y la causal del rechazo.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl text-black border border-gray-100">
                2
              </div>
              <h3 className="text-xl font-bold">Aporta detalles</h3>
              <p className="text-gray-600 leading-relaxed">
                Ingresa tus antecedentes y adjunta los documentos clave de forma segura.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl text-black border border-gray-100">
                3
              </div>
              <h3 className="text-xl font-bold">Recibe tu documento</h3>
              <p className="text-gray-600 leading-relaxed">
                En menos de 24hrs hábiles te entregamos un PDF formal listo para ser presentado.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Feature / Value Prop */}
      <section className="px-6 py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Más que una plantilla</h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            No somos un estudio jurídico. Somos una herramienta de autogestión que ordena tus argumentos y documentos para maximizar la claridad de tu reclamo.
          </p>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl mx-auto mb-12 text-center shadow-sm">
            <h3 className="font-semibold text-black mb-2">Respaldo y Transparencia</h3>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Proyecto independiente. No somos Isapre, Compin ni SUSESO.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-sm mx-auto hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Pago Único</span>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold text-black">$14.990</span>
                <span className="text-lg text-gray-400 line-through">$19.990</span>
              </div>
              <ul className="text-left space-y-3 mb-8 w-full px-4">
                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <AiOutlineFileText className="text-black text-lg" /> PDF listo para presentar
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <AiOutlineCloudUpload className="text-black text-lg" /> Adjunta tus documentos
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <AiOutlineSafety className="text-black text-lg" /> Datos confidenciales
                </li>
              </ul>
              <Link
                href="/licenciaaldia/caso"
                className="w-full block bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Iniciar reclamo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24 max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-10 text-center">Preguntas Frecuentes</h2>
        <div className="space-y-4">
          <details className="group border border-gray-200 rounded-lg open:bg-gray-50 transition-colors">
            <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-black outline-none">
              <span>¿LicenciaAlDia es un estudio jurídico?</span>
              <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                <AiOutlineQuestionCircle />
              </span>
            </summary>
            <div className="px-6 pb-6 text-gray-600">
              No. LicenciaAlDia es una herramienta de autogestión documental. No prestamos servicios de representación legal ni asesoría jurídica personalizada.
            </div>
          </details>
          
          <details className="group border border-gray-200 rounded-lg open:bg-gray-50 transition-colors">
            <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-black outline-none">
              <span>¿Garantizan el éxito del reclamo?</span>
              <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                <AiOutlineQuestionCircle />
              </span>
            </summary>
            <div className="px-6 pb-6 text-gray-600">
              No. La decisión depende exclusivamente de la entidad (Isapre, Compin, SUSESO). Nosotros aseguramos que tu presentación sea clara, completa y profesional.
            </div>
          </details>

          <details className="group border border-gray-200 rounded-lg open:bg-gray-50 transition-colors">
            <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-black outline-none">
              <span>¿Qué datos necesito?</span>
              <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                <AiOutlineQuestionCircle />
              </span>
            </summary>
            <div className="px-6 pb-6 text-gray-600">
              Carta de rechazo, fechas clave, y tus antecedentes (informes o recetas) digitalizados para adjuntar. También puedes adjuntar otros documentos que creas relevantes.
            </div>
          </details>

          <details className="group border border-gray-200 rounded-lg open:bg-gray-50 transition-colors">
            <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-black outline-none">
              <span>¿En cuánto tiempo recibo mi documento?</span>
              <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                <AiOutlineQuestionCircle />
              </span>
            </summary>
            <div className="px-6 pb-6 text-gray-600">
              Dentro de 24 horas hábiles desde que completas el formulario y confirmas el pago.
            </div>
          </details>
        </div>

        <div className="text-center mt-16 mb-8">
            <Link
                href="/licenciaaldia/caso"
                className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
            >
                Iniciar mi reclamo ahora
                <AiOutlineArrowRight />
            </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} LicenciaAlDia. Todos los derechos reservados.
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <Link href="/licenciaaldia/legal/terminos" className="text-gray-600 hover:text-black">
              Términos
            </Link>
            <Link href="/licenciaaldia/legal/privacidad" className="text-gray-600 hover:text-black">
              Privacidad
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
