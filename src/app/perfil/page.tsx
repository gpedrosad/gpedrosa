// src/app/profile/page.tsx
import type { Metadata } from "next";
import Profile from "../components/Perfil";

export const dynamic = "force-dynamic";

/** Metadatos (versión única) */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Gonzalo Pedrosa",
    description:
      "Espacio online de acompañamiento para reflexionar, tomar decisiones con claridad. Modalidad 100% online.",
    openGraph: {
      title: "Gonzalo Pedrosa",
      description:
        "Más de 7 años de experiencia ofreciendo acompañamiento online",
      images: ["/yo.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/** Render del componente principal (client-side) */
export default function ProfilePage() {
  return <Profile />;
}