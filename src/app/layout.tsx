import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/src/components/Header"
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simulador de Cortes com IA | Cacique's Barber",
  description:
    "Veja como você ficaria com diferentes cortes de cabelo usando inteligência artificial. Teste antes de cortar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
  <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#07070c] text-white flex flex-col min-h-screen`}>
    <Header />
    {/* Removi o <main> daqui porque ele já existe no page.tsx, 
        ou você pode manter aqui e remover do page.tsx. 
        Vou manter aqui para garantir que o Header/Footer fiquem fixos. */}
    <main className="flex-1">
      {children}
    </main>
    <Footer />
  </body>
</html>
  );
}