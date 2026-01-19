"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/services/api";
import Cookies from "js-cookie";
import {
  Check,
  X,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SettingsModal } from "@/components/SettingsModal";
import { Loading } from "@/components/Loading";
import { Toast } from "@/components/Toast";
import { EmptyIllustration } from "@/components/EmptyIllustration";

interface User {
  id: number;
  name: string;
  surname: string;
  role: string;
}

export default function AgendamentosPage() {
  // --- ESTADOS DE DADOS ---
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);

  // --- ESTADOS DE UI ---
  const [loading, setLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // --- ESTADOS DE PAGINAÇÃO ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Solicitado: 5 itens por página

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      setUser(JSON.parse(userCookie));
    } else {
      setLoading(false);
    }
  }, []);

  // Helper de Toast
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const fetchAppointments = useCallback(async () => {
    if (!user) return;

    let url = "";
    if (user.role === "admin") {
      url = "/appointments";
    } else {
      url = `/appointments/${user.id}`;
    }

    try {
      setLoading(true);
      const response = await api.get(url);
      setAppointments(response.data);
    } catch (err) {
      console.error("Erro ao carregar agendamentos");
      showToast("Erro ao carregar agendamentos.", "error");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  async function handleStatus(id: number, status: "approved" | "canceled") {
    try {
      await api.put(`/appointments/${id}`, { status });

      // Atualiza localmente
      setAppointments((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app))
      );

      showToast(
        status === "approved"
          ? "Agendamento aprovado!"
          : "Agendamento cancelado.",
        "success"
      );
    } catch (err) {
      showToast("Erro ao atualizar status.", "error");
    }
  }

  // --- HELPERS ---
  function getRoomName(appt: any) {
    if (appt.room_details?.name) return appt.room_details.name;
    if (appt.Room?.name) return appt.Room.name;
    const legacyRoom = appt.room || "012";
    return legacyRoom.length < 5 ? `Sala ${legacyRoom}` : legacyRoom;
  }

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

  const filteredAppointments = appointments.filter((item) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();

    const userName = item.user ? `${item.user.name} ${item.user.surname}` : "";
    const roomName = getRoomName(item);

    return (
      userName.toLowerCase().includes(searchLower) ||
      roomName.toLowerCase().includes(searchLower) ||
      item.status.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="w-full md:max-w-full max-w-[calc(100vw-32px)] mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <div className="bg-white border border-[#D7D7D7] rounded-lg flex flex-col w-full shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row gap-4 w-full md:flex-1">
              <div className="border border-gray-300 rounded px-3 py-2.5 w-full md:max-w-md flex items-center focus-within:border-black transition bg-white">
                <Search
                  size={20}
                  className="text-gray-400 mr-3 flex-shrink-0"
                />
                <input
                  placeholder="Filtre por nome"
                  className="outline-none w-full text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="border border-gray-300 rounded px-3 py-2.5 w-full md:w-48 flex items-center justify-between text-gray-500 text-sm cursor-pointer hover:border-gray-400 transition bg-white">
                <span>Selecione</span>
                <Calendar size={18} />
              </div>
            </div>

            {user?.role === "admin" && (
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="bg-black text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-gray-800 transition shadow-sm w-full md:w-auto h-full"
              >
                Ajustes de agendamento
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col w-full overflow-x-auto">
          {loading ? (
            <Loading />
          ) : paginatedAppointments.length > 0 ? (
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
                {paginatedAppointments.map((item) => (
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
                      <div className="text-gray-500 text-xs mt-0.5">
                        Cliente
                      </div>
                    </td>
                    <td className="py-5 px-4 align-middle">
                      <span className="bg-black text-white text-xs px-4 py-1.5 rounded-full font-bold inline-block">
                        {getRoomName(item)}
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
                                onClick={() =>
                                  handleStatus(item.id, "canceled")
                                }
                                className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition shadow-sm"
                                title="Cancelar"
                              >
                                <X size={16} />
                              </button>
                            )}
                            {item.status === "pending" && (
                              <button
                                onClick={() =>
                                  handleStatus(item.id, "approved")
                                }
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
              </tbody>
            </table>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-300">
              <EmptyIllustration />
              <h3 className="text-xl font-semibold text-gray-900 mt-6">
                Nada por aqui ainda...
              </h3>
            </div>
          )}
        </div>
      </div>

      {!loading && filteredAppointments.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-4 select-none">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`w-8 h-8 flex items-center justify-center rounded transition ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-sm font-medium text-gray-700 mx-2">
            {currentPage} de {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 flex items-center justify-center rounded transition ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
