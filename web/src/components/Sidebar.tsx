"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Calendar,
  FileText,
  User as UserIcon,
  LogOut,
  Layers,
  Users,
  Loader2,
  X,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: "admin" | "client";
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMounted(true);
    const userCookie = Cookies.get("user");
    if (userCookie) {
      setUser(JSON.parse(userCookie));
    }
  }, []);

  function handleLogout() {
    Cookies.remove("token");
    Cookies.remove("user");
    router.push("/login");
  }

  const adminMenu = [
    { name: "Agendamentos", href: "/agendamentos", icon: Calendar },
    { name: "Clientes", href: "/clientes", icon: Users },
    { name: "Logs", href: "/logs", icon: FileText },
  ];

  const clientMenu = [
    { name: "Agendamentos", href: "/appointments", icon: Calendar },
    { name: "Logs", href: "/logs", icon: FileText },
    { name: "Minha Conta", href: "/profile", icon: UserIcon },
  ];

  const menuItems =
    !mounted || !user ? [] : user.role === "admin" ? adminMenu : clientMenu;

  return (
    <>
      {/* OVERLAY MOBILE */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-gray-50 border-r border-[#D7D7D7] 
          flex flex-col overflow-hidden transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static
        `}
      >
        {/* 1. TOPO: LOGO */}
        <div className="h-24 flex items-center px-8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Layers className="h-8 w-8 text-black transform rotate-45" />
            <span className="font-bold text-xl tracking-tight text-gray-900">
              Portal
            </span>
          </div>
          <button onClick={onClose} className="md:hidden ml-auto text-gray-500">
            <X size={24} />
          </button>
        </div>

        {/* 2. NAVEGAÇÃO */}
        <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
          {(!mounted || !user) && (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-gray-400" />
            </div>
          )}

          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(item.href) && item.href !== "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition flex-shrink-0 ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* 3. PERFIL (RODAPÉ) */}
        {mounted && user && (
          <div className="px-4 mb-6 flex-shrink-0">
            <div className="border-t border-[#D7D7D7] w-full mb-4"></div>
            <div className="flex items-center justify-between px-2 py-2 hover:bg-gray-100 rounded-md transition cursor-pointer group">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 truncate w-32">
                  {user.name}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {user.role === "admin" ? "Administrador" : "Cliente"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Sair"
                className="text-gray-400 hover:text-black transition flex items-center justify-center w-8 h-8"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
