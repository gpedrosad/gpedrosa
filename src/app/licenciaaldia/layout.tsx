import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LicenciaAlDia | Gestión de Reclamos",
  description: "Te ayudamos a preparar tu reclamo de licencia médica rechazada.",
};

export default function LicenciaAlDiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-black selection:text-white">
      <main className="mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
