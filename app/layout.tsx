import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Peluquería | El arte de cuidarte",
  description: "Servicios de peluquería y una reserva interactiva de demostración.",
  robots: { index: false, follow: false },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
