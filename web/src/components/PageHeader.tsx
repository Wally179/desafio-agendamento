"use client";

import { usePathname } from "next/navigation";

// Mapeamento: Rota -> Título e Subtítulo
const pageData: Record<string, { title: string; subtitle: string }> = {
  "/agendamentos": {
    title: "Agendamentos",
    subtitle: "Acompanhe todos os agendamentos de clientes de forma simples",
  },
  "/clientes": {
    title: "Clientes",
    subtitle: "Overview de todos os clientes",
  },
  "/logs": {
    title: "Logs",
    subtitle: "Acompanhe todo o histórico de atividades da sua conta",
  },
  "/profile": {
    title: "Minha Conta",
    subtitle: "Gerencie seus dados pessoais",
  },
  "/appointments": {
    title: "Agendamentos",
    subtitle: "Acompanhe todos os seus agendamentos de forma simples",
  },
};

export function PageHeader() {
  const pathname = usePathname();

  const currentData = pageData[pathname];

  if (!currentData) return null;

  return (
    <div className="w-full bg-white border-b border-[#D7D7D7] py-4 px-6">
      <h1 className="text-3xl font-bold text-gray-900">{currentData.title}</h1>
      <p className="text-gray-500 mt-1">{currentData.subtitle}</p>
    </div>
  );
}
