import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-white p-6 font-sans text-black selection:bg-gray-200">
      <main className="flex w-full max-w-md flex-col items-center gap-8 text-center animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
        <div className="relative h-32 w-32 overflow-hidden rounded-full border border-gray-100 shadow-sm sm:h-40 sm:w-40 ring-1 ring-gray-100 ring-offset-2">
          <Image
            src="/yo.png"
            alt="Gonzalo Pedrosa"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Gonzalo Pedrosa
          </h1>
          <p className="mx-auto text-lg text-gray-500 font-medium">
            Sesiones online individuales. 
            <br />50 minutos.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
          <Link
            href="https://wa.me/56968257817"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-8 text-base font-medium text-white transition-all hover:bg-gray-800 hover:shadow-lg active:scale-95 sm:w-auto"
          >
            <FaWhatsapp className="text-xl" />
            <span>Agendar sesión</span>
          </Link>
          <Link
            href="/perfil"
            className="inline-flex h-12 w-full items-center justify-center rounded-full border border-gray-200 bg-white px-8 text-base font-medium text-black transition-all hover:border-gray-400 hover:bg-gray-50 active:scale-95 sm:w-auto"
          >
            Ver perfil
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-8 flex gap-6 text-sm font-medium text-gray-400">
        <Link href="/contacto" className="hover:text-black transition-colors">
          Contacto
        </Link>
        <Link href="/privacidad" className="hover:text-black transition-colors">
          Privacidad
        </Link>
        <Link href="/terminos" className="hover:text-black transition-colors">
          Términos
        </Link>
      </footer>
    </div>
  );
}
