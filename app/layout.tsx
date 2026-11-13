import type { Metadata } from "next";
import "./globals.css";
import "./identity.css";
import "./courses.css";
import "./depth-hero.css";
import "./course-transitions.css";
import "./course-hub.css";
import "./community.css";
import "./word-reveal.css";
import "./learning-steps-motion.css";
import "./learning-photography.css";
import "./public-design.css";
import "./public-motion.css";
import "./interaction-motion.css";

export const metadata: Metadata = {
  title: "Sala de Maestros",
  description: "Un espacio propio para encontrarse, aprender y prepararse entre docentes. Cursos en línea para la práctica docente y el desarrollo profesional, a tu ritmo.",
  icons: {
    icon: "/assets/identity/favicon.svg",
    shortcut: "/assets/identity/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <body className="antialiased">{children}</body>
    </html>
  );
}
