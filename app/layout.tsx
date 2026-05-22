import type { Metadata } from "next";
import "./globals.css";
import DashboardLayout from "@/components/layout/DashboardLayout";

export const metadata: Metadata = {
  title: "GesEscolar - Gestión Escolar Integral",
  description: "Plataforma de gestión escolar integral con Supabase y Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
