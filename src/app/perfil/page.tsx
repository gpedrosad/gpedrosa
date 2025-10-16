import type { Metadata } from "next";
import Perfil from "@/app/components/Perfil";

export const dynamic = "force-dynamic";

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
    robots: { index: true, follow: true },
  };
}

export default function ProfilePage() {
  // Renderiza el componente cliente real
  return <Perfil />;
}