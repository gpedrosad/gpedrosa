// src/app/profile/page.tsx
import type { Metadata } from "next";
import Profile from "../components/Perfil";

export const dynamic = "force-dynamic";

/** Metadatos (versión única) */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Gonzalo Pedrosa",
    description: "Acompañamiento online. Sesiones individuales de 50 minutos.",
    openGraph: {
      title: "Gonzalo Pedrosa",
      description: "Acompañamiento online.",
      images: ["/yo.png"],
    },
    twitter: {
      title: "Gonzalo Pedrosa",
      description: "Acompañamiento online.",
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