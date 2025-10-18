// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-white">
      <main className="max-w-2xl flex flex-col items-center gap-6">
        <Image
          src="/yo.png"
          alt="Foto de Gonzalo Pedrosa"
          width={180}
          height={180}
          className="rounded-full shadow-md"
          priority
        />
        <h1 className="text-3xl font-bold text-gray-900">Gonzalo Pedrosa</h1>
        <p className="text-gray-600 text-lg">
          Espacio de acompañamiento online y gestión personal.
        </p>

        <Link
          href="/perfil"
          className="mt-4 bg-[#023047] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#03506f] transition"
        >
          Ver perfil
        </Link>
      </main>

      <footer className="mt-16 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
        <Link href="/contacto" className="hover:underline">
          Contacto
        </Link>
        <Link href="/privacidad" className="hover:underline">
          Privacidad
        </Link>
        <Link href="/terminos" className="hover:underline">
          Términos
        </Link>
      </footer>
    </div>
  );
}