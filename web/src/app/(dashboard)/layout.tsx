"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { Menu, Layers } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // 1. h-screen: Ocupa exatamente a altura da janela
    // 2. overflow-hidden: Remove a barra de rolagem da janela inteira
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar Fixa */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col h-full transition-all duration-300 md:ml-0">
        {/* Header Mobile (Fixo no topo da área principal se precisar, ou rolando junto) */}
        <div className="md:hidden bg-white border-b border-[#D7D7D7] p-4 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-black transform rotate-45" />
            <span className="font-bold text-lg">Portal</span>
          </div>
          <div className="w-10"></div>
        </div>

        {/* AQUI ESTÁ O TRUQUE: 
           O PageHeader e o conteúdo estão dentro de uma div que permite scroll (overflow-y-auto).
           Isso faz com que o Sidebar fique parado e só esse miolo role.
        */}
        <div className="flex-1 overflow-y-auto">
          <PageHeader />

          <div className="p-4 md:p-8 bg-white">{children}</div>
        </div>
      </main>
    </div>
  );
}
