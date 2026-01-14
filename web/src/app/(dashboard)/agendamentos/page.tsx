"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/services/api";
import Cookies from "js-cookie";
import { Check, X, Calendar, Search } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
// 1. IMPORTAR O MODAL
import { SettingsModal } from "@/components/SettingsModal";

interface User {
  id: number;
  name: string;
  surname: string;
  role: string;
}

export default function AgendamentosPage() {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. ESTADO DO MODAL
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      setUser(JSON.parse(userCookie));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      if (!user) return;

      let url = "";
      if (user.role === "admin") {
        url = "/appointments";
      } else {
        url = `/appointments/${user.id}`;
      }

      try {
        const response = await api.get(url);
        setAppointments(response.data);
      } catch (err) {
        console.error("Erro ao carregar agendamentos");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  async function handleStatus(id: number, status: "approved" | "canceled") {
    try {
      await api.put(`/appointments/${id}`, { status });
      setAppointments((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app))
      );
    } catch (err) {
      alert("Erro ao atualizar status");
    }
  }

  // --- ESTILOS VISUAIS ---
  function getRowBackground(status: string) {
    switch (status) {
      case "approved":
        return "bg-[#F0FDFA]";
      case "canceled":
        return "bg-[#FEF2F2]";
      default:
        return "bg-white";
    }
  }

  function getBadgeStyle(status: string) {
    switch (status) {
      case "approved":
        return "border-teal-400 text-teal-600 bg-white";
      case "canceled":
        return "border-red-400 text-red-600 bg-white";
      default:
        return "border-[#D7D7D7] text-gray-500 bg-white";
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case "approved":
        return "Agendado";
      case "canceled":
        return "Cancelado";
      default:
        return "Em análise";
    }
  }

  if (loading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="w-full md:max-w-full max-w-[calc(100vw-32px)] mx-auto">
      {/* 3. COMPONENTE MODAL */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <div className="bg-white border border-[#D7D7D7] rounded-lg flex flex-col w-full shadow-sm overflow-hidden">
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row gap-4 w-full md:flex-1">
              <div className="border border-[#D7D7D7] rounded px-3 py-2.5 w-full md:max-w-md flex items-center focus-within:border-black transition bg-white">
                <Search
                  size={20}
                  className="text-gray-400 mr-3 flex-shrink-0"
                />
                <input
                  placeholder="Filtre por nome"
                  className="outline-none w-full text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
                />
              </div>
              <div className="border border-[#D7D7D7] rounded px-3 py-2.5 w-full md:w-48 flex items-center justify-between text-gray-500 text-sm cursor-pointer hover:border-gray-400 transition bg-white">
                <span>Selecione</span>
                <Calendar size={18} />
              </div>
            </div>

            {user?.role === "admin" && (
              <button
                // 4. ABRIR MODAL AO CLICAR
                onClick={() => setIsSettingsOpen(true)}
                className="bg-black text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-gray-800 transition shadow-sm w-full md:w-auto h-full"
              >
                Ajustes de agendamento
              </button>
            )}
          </div>
        </div>

        <div className="w-full overflow-x-auto border-t border-[#D7D7D7] md:border-t-0">
          <table className="w-full text-left text-sm border-collapse table-fixed min-w-[1000px]">
            <thead>
              <tr>
                <th className="w-[20%] py-4 px-6 font-semibold text-gray-900 border-b border-[#D7D7D7]">
                  Data agendamento ↕
                </th>
                <th className="w-[25%] py-4 px-4 font-semibold text-gray-900 border-b border-[#D7D7D7]">
                  Nome
                </th>
                <th className="w-[20%] py-4 px-4 font-semibold text-gray-900 border-b border-[#D7D7D7]">
                  Sala de agendamento
                </th>
                <th className="w-[20%] py-4 px-4 font-semibold text-gray-900 border-b border-[#D7D7D7]">
                  Status
                </th>
                <th className="w-[15%] py-4 px-6 font-semibold text-gray-900 text-center border-b border-[#D7D7D7]">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item) => (
                <tr
                  key={item.id}
                  className={`${getRowBackground(
                    item.status
                  )} border-b border-[#D7D7D7] last:border-0 transition-colors`}
                >
                  <td className="py-5 px-6 text-gray-600 align-middle">
                    {format(new Date(item.date), "dd/MM/yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </td>
                  <td className="py-5 px-4 align-middle">
                    <div className="font-bold text-gray-900 text-base truncate">
                      {item.user?.name} {item.user?.surname}
                    </div>
                    <div className="text-gray-500 text-xs mt-0.5">Cliente</div>
                  </td>
                  <td className="py-5 px-4 align-middle">
                    <span className="bg-black text-white text-xs px-4 py-1.5 rounded-full font-bold inline-block">
                      Sala {item.room || "012"}
                    </span>
                  </td>
                  <td className="py-5 px-4 align-middle">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-medium border inline-block whitespace-nowrap ${getBadgeStyle(
                        item.status
                      )}`}
                    >
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td className="py-5 px-6 align-middle">
                    <div className="flex justify-center items-center gap-2">
                      {user?.role === "admin" && (
                        <>
                          {item.status !== "canceled" && (
                            <button
                              onClick={() => handleStatus(item.id, "canceled")}
                              className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition shadow-sm"
                              title="Cancelar"
                            >
                              <X size={16} />
                            </button>
                          )}
                          {item.status === "pending" && (
                            <button
                              onClick={() => handleStatus(item.id, "approved")}
                              className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition shadow-sm"
                              title="Aprovar"
                            >
                              <Check size={16} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    Nenhum agendamento encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
