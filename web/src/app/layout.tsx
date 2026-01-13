import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // eslint-disable-line
// Configuração da fonte Inter (Google Fonts)
const inter = Inter({ subsets: ["latin"] });

// Título da aba do navegador
export const metadata: Metadata = {
  title: "Portal de Agendamentos",
  description: "Gerencie seus horários com facilidade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
