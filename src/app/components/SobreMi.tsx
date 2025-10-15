"use client";

import * as React from "react";

interface SobreMiProps {
  /** Texto completo (sin cortar). */
  content: string;
  /** Prefijo opcional que siempre se muestra antes del botón. */
  introPrefix?: string;
  /** Cantidad de caracteres del adelanto (sin contar el prefijo). */
  previewChars?: number;
  className?: string;
}

const DEFAULT_PREFIX =
  "Hola mi nombre es Gonzalo Pedrosa y tengo más de 8 años de experiencia con";

const SobreMi: React.FC<SobreMiProps> = ({
  content,
  introPrefix = DEFAULT_PREFIX,
  previewChars = 160,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const closeRef = React.useRef<HTMLButtonElement | null>(null);
  const id = React.useId();

  // Si el content ya trae el prefijo, lo recorto para no duplicar.
  const raw = (content || "").trim();
  const rest = raw.toLowerCase().startsWith(introPrefix.toLowerCase())
    ? raw.slice(introPrefix.length).trimStart()
    : raw;

  const preview =
    rest.length > previewChars ? rest.slice(0, previewChars).trimEnd() + "…" : rest;

  // Bloquear scroll y manejar ESC cuando el modal está abierto.
  React.useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    // Enfocar el botón de cerrar al abrir
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      // Devolver foco al trigger
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <section aria-labelledby={`${id}-title`} className={className ?? "mt-12"}>
      <h3
        id={`${id}-title`}
        className="text-xs font-semibold tracking-widest text-gray-500 mb-2"
      >
        SOBRE MÍ
      </h3>

      <p className="text-gray-700 text-lg">
        {introPrefix}
        {rest ? " " : ""}
        {preview}
      </p>

      {rest && (
        <div className="mt-4">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
            aria-haspopup="dialog"
            aria-controls={`${id}-dialog`}
          >
            Ver todo
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Modal */}
      {open && (
        <div
          id={`${id}-dialog`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-modal-title`}
          className="fixed inset-0 z-50"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          {/* Panel */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h4
                  id={`${id}-modal-title`}
                  className="text-lg font-semibold"
                >
                  Sobre mí
                </h4>
                <button
                  ref={closeRef}
                  className="p-2 rounded hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>
              <div className="p-5 max-h-[70vh] overflow-y-auto">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {introPrefix}
                  {rest ? " " : ""}
                  {rest}
                </p>
              </div>
              <div className="p-4 border-t flex justify-end">
                <button
                  className="inline-flex items-center justify-center rounded-xl bg-[#023047] text-white px-5 py-2.5 font-semibold shadow-sm hover:bg-[#03506f] active:scale-95 transition"
                  onClick={() => setOpen(false)}
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SobreMi;