"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Layers, Calendar, List, User, LogOut, ChevronUp } from "lucide-react"; // Ícones
import Cookies from "js-cookie";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; surname: string } | null>(
    null
  );

  useEffect(() => {
    const userCookie = Cookies.get("user");

    if (userCookie) {
      if (!user) {
        setUser(JSON.parse(userCookie));
      }
    } else {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLogout() {
    Cookies.remove("token");
    Cookies.remove("user");
    router.push("/login");
  }

  // Itens do Menu
  const menuItems = [
    { name: "Agendamentos", href: "/appointments", icon: Calendar },
    { name: "Logs", href: "/logs", icon: List },
    { name: "Minha Conta", href: "/profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      {/* --- SIDEBAR (Barra Lateral) --- */}
      <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col justify-between fixed h-full z-10">
        {/* Topo: Logo */}
        <div>
          <div className="p-8">
            <Layers className="h-10 w-10 text-black transform rotate-45" />
          </div>

          {/* Navegação */}
          <nav className="flex flex-col gap-1 px-4 mt-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition ${
                    isActive
                      ? "bg-black text-white" // Estilo do item selecionado
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Rodapé: Perfil do Usuário */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-200 cursor-pointer group transition">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900">
                {user ? `${user.name} ${user.surname}` : "Carregando..."}
              </span>
              <span className="text-xs text-gray-500">Cliente</span>
            </div>

            {/* Botão Sair (aparece ao passar o mouse ou clicar) */}
            <button
              onClick={handleLogout}
              title="Sair"
              className="text-gray-400 hover:text-red-500 transition"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL (Direita) --- */}
      <main className="flex-1 ml-64 p-8 bg-white min-h-screen">{children}</main>
    </div>
  );
}
