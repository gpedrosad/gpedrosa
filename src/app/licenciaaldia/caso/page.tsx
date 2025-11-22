"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AiOutlineArrowLeft, AiOutlineLoading3Quarters, AiOutlineCloudUpload } from "react-icons/ai";

export default function CaseFormPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejector, setRejector] = useState("");
  const [causal, setCausal] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simular API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const caseId = `LIC-${Date.now()}`;
    router.push(`/licenciaaldia/caso/gracias?caseId=${caseId}`);
  };

  const inputClasses = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all";
  const labelClasses = "block text-sm font-medium text-gray-900 mb-2";
  const sectionClasses = "bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 mb-8";
  const sectionTitleClasses = "text-lg font-semibold text-black border-b border-gray-100 pb-4 mb-6";

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
            <Link href="/licenciaaldia" className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-6 transition-colors group">
              <AiOutlineArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Volver
            </Link>
            <h1 className="text-3xl font-bold text-black mb-3 tracking-tight">
              Detalles del Caso
            </h1>
            <p className="text-gray-500">
              Completa la información para generar tu documento de reclamo.
            </p>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* 1. Contacto */}
          <section className={sectionClasses}>
            <h2 className={sectionTitleClasses}>1. Datos de contacto</h2>
            <div className="grid gap-6">
              <div>
                <label className={labelClasses} htmlFor="nombreCompleto">Nombre Completo</label>
                <input type="text" id="nombreCompleto" name="nombreCompleto" required className={inputClasses} placeholder="Nombre Apellido" />
              </div>
              <div>
                <label className={labelClasses} htmlFor="email">Correo Electrónico</label>
                <input type="email" id="email" name="email" required className={inputClasses} placeholder="nombre@ejemplo.com" />
              </div>
            </div>
          </section>

          {/* 2. Licencia */}
          <section className={sectionClasses}>
            <h2 className={sectionTitleClasses}>2. Sobre la licencia</h2>
            <div className="grid gap-6">
              <div>
                <label className={labelClasses} htmlFor="quienRechazo">¿Quién rechazó?</label>
                <div className="relative">
                  <select
                    id="quienRechazo"
                    name="quienRechazo"
                    required
                    value={rejector}
                    onChange={(e) => setRejector(e.target.value)}
                    className={`${inputClasses} appearance-none bg-white`}
                  >
                    <option value="">Seleccionar entidad</option>
                    <option value="Isapre">Isapre</option>
                    <option value="Compin">Compin</option>
                    <option value="SUSESO">SUSESO</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              {rejector === "Isapre" && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className={labelClasses} htmlFor="cualIsapre">Nombre de la Isapre</label>
                  <input type="text" id="cualIsapre" name="cualIsapre" className={inputClasses} placeholder="Ej: Colmena" />
                </div>
              )}

              <div>
                <label className={labelClasses} htmlFor="fechaNotificacion">Fecha de notificación</label>
                <input type="date" id="fechaNotificacion" name="fechaNotificacion" required className={inputClasses} />
              </div>

              <div>
                <label className={labelClasses} htmlFor="cantidadLicencias">Licencias previas (mismo diagnóstico)</label>
                <div className="relative">
                    <select id="cantidadLicencias" name="cantidadLicencias" className={`${inputClasses} appearance-none bg-white`}>
                    <option value="Primera">Ninguna (Es la primera)</option>
                    <option value="2-3">Entre 2 y 3</option>
                    <option value="4+">4 o más</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
              </div>

              <div>
                <label className={labelClasses} htmlFor="causalRechazo">Causal de rechazo</label>
                <div className="relative">
                    <select
                    id="causalRechazo"
                    name="causalRechazo"
                    required
                    value={causal}
                    onChange={(e) => setCausal(e.target.value)}
                    className={`${inputClasses} appearance-none bg-white`}
                    >
                    <option value="">Seleccionar causal</option>
                    <option value="no_acredita">No se acredita incapacidad</option>
                    <option value="reposo_injustificado">Reposo injustificado</option>
                    <option value="falta_antecedentes">Falta de antecedentes</option>
                    <option value="incumplimiento_reposo">Incumplimiento de reposo</option>
                    <option value="otra">Otra</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
              </div>

              {causal === "otra" && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className={labelClasses} htmlFor="otraCausal">Especificar causal</label>
                  <input type="text" id="otraCausal" name="otraCausal" className={inputClasses} />
                </div>
              )}

              <div>
                <label className={labelClasses} htmlFor="textoCarta">Texto relevante de la carta (Opcional)</label>
                <textarea id="textoCarta" name="textoCarta" rows={3} className={inputClasses} placeholder="Copia y pega fragmentos clave..."></textarea>
              </div>
            </div>
          </section>

          {/* 3. Salud */}
          <section className={sectionClasses}>
            <h2 className={sectionTitleClasses}>3. Información Clínica (Confidencial)</h2>
            <div className="grid gap-6">
              <div>
                <label className={labelClasses} htmlFor="motivoLicencia">Diagnóstico principal</label>
                <input type="text" id="motivoLicencia" name="motivoLicencia" className={inputClasses} placeholder="Ej: Trastorno adaptativo" />
              </div>

              <div>
                <span className={labelClasses}>Categoría</span>
                <div className="flex flex-col gap-3 mt-2">
                  {["Salud mental", "Enfermedad física", "Embarazo / Postnatal", "Otro"].map((opt) => (
                    <label key={opt} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <input type="radio" name="tipoProblema" value={opt} className="w-4 h-4 text-black border-gray-300 focus:ring-black" />
                        <span className="text-gray-700 text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClasses} htmlFor="impactoTrabajo">Impacto en capacidad laboral</label>
                <textarea id="impactoTrabajo" name="impactoTrabajo" rows={3} className={inputClasses} placeholder="Describe brevemente..."></textarea>
              </div>

              <div>
                <span className={labelClasses}>Tratamiento actual</span>
                <div className="grid sm:grid-cols-2 gap-3 mt-2">
                  {["Medicación", "Médico/a", "Psicólogo/a", "Otro"].map((opt) => (
                    <label key={opt} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input type="checkbox" name="tratamiento" value={opt} className="w-4 h-4 rounded text-black border-gray-300 focus:ring-black" />
                      <span className="text-gray-700 text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 4. Laboral */}
          <section className={sectionClasses}>
            <h2 className={sectionTitleClasses}>4. Antecedentes Laborales</h2>
            <div className="grid gap-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses} htmlFor="tipoTrabajo">Tipo de trabajador</label>
                    <div className="relative">
                        <select id="tipoTrabajo" name="tipoTrabajo" className={`${inputClasses} appearance-none bg-white`}>
                        <option value="dependiente">Dependiente</option>
                        <option value="independiente">Independiente</option>
                        <option value="otro">Otro</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
                <div>
                    <label className={labelClasses} htmlFor="tipoContrato">Contrato</label>
                    <div className="relative">
                        <select id="tipoContrato" name="tipoContrato" className={`${inputClasses} appearance-none bg-white`}>
                        <option value="indefinido">Indefinido</option>
                        <option value="plazo_fijo">Plazo fijo</option>
                        <option value="honorarios">Honorarios</option>
                        <option value="otro">Otro</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
              </div>
              <div>
                <label className={labelClasses} htmlFor="impactoEconomico">Impacto económico si no pagan</label>
                <textarea id="impactoEconomico" name="impactoEconomico" rows={2} className={inputClasses} placeholder="Consecuencias económicas..."></textarea>
              </div>
            </div>
          </section>

          {/* 5. Documentos */}
          <section className={sectionClasses}>
            <h2 className={sectionTitleClasses}>5. Adjuntar Documentos</h2>
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors">
                <AiOutlineCloudUpload className="mx-auto text-4xl text-gray-400 mb-2" />
                <label htmlFor="docResolucion" className="block text-sm font-medium text-black cursor-pointer hover:underline">
                  Sube la Resolución de Rechazo
                </label>
                <span className="text-xs text-gray-500 block mt-1">PDF, JPG o PNG</span>
                <input type="file" id="docResolucion" name="docResolucion" accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors">
                <AiOutlineCloudUpload className="mx-auto text-4xl text-gray-400 mb-2" />
                <label htmlFor="docOtros" className="block text-sm font-medium text-black cursor-pointer hover:underline">
                  Otros documentos (Médicos/Exámenes)
                </label>
                <span className="text-xs text-gray-500 block mt-1">Selecciona múltiples archivos</span>
                <input type="file" id="docOtros" name="docOtros" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
              </div>
            </div>
          </section>

          {/* Legal */}
          <div className="space-y-4 mb-8 text-sm text-gray-600">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="mt-1 rounded text-black focus:ring-black border-gray-300" />
              <span>La información es verdadera.</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="mt-1 rounded text-black focus:ring-black border-gray-300" />
              <span>
                Acepto los <Link href="/licenciaaldia/legal/terminos" className="text-black underline">Términos</Link> y <Link href="/licenciaaldia/legal/privacidad" className="text-black underline">Privacidad</Link>.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white font-medium py-4 rounded-xl text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin" /> Procesando...
              </>
            ) : (
              "Enviar Caso"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
