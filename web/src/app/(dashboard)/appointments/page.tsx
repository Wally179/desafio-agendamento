"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Calendar as CalendarIcon,
  X,
  Clock,
  MapPin,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/services/api";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EmptyIllustration } from "@/components/EmptyIllustration";
import { Loading } from "@/components/Loading";
import { Toast } from "@/components/Toast";

interface Appointment {
  id: number;
  date: string;
  room: string;
  Room?: {
    name: string;
  };
  status: "agendado" | "cancelado" | "pending" | "approved" | "canceled";
  user: {
    name: string;
    surname: string;
  };
}

interface Room {
  id: number;
  name: string;
  active: boolean;
}

const appointmentSchema = z.object({
  date: z.string().min(1, { message: "Selecione uma data" }),
  time: z.string().min(1, { message: "Selecione um horário" }),
  room: z.string().min(1, { message: "Selecione uma sala" }),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export default function ClientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading da página (tabela)
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading do botão (modal)
  const [searchTerm, setSearchTerm] = useState("");

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const fetchAppointments = useCallback(async () => {
    try {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        const user = JSON.parse(userCookie);
        const response = await api.get(`/appointments/${user.id}`);
        setAppointments(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar agendamentos", error);
      showToast("Não foi possível carregar os agendamentos.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRooms = useCallback(async () => {
    try {
      const response = await api.get("/rooms");
      setRooms(response.data.filter((r: Room) => r.active !== false));
    } catch (error) {
      console.error("Erro ao buscar salas", error);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
    fetchRooms();
  }, [fetchAppointments, fetchRooms]);

  const filteredAppointments = appointments.filter((appt) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const roomName = appt.Room?.name || appt.room || "";

    return (
      roomName.toLowerCase().includes(searchLower) ||
      appt.status.toLowerCase().includes(searchLower)
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

  async function handleCreate(data: AppointmentFormData) {
    try {
      setIsSubmitting(true);
      const userCookie = Cookies.get("user");
      if (!userCookie) return;
      const user = JSON.parse(userCookie);
      const finalDate = `${data.date}T${data.time}:00`;

      await api.post(`/appointments/${user.id}`, {
        date: finalDate,
        room_id: Number(data.room),
      });

      showToast("Agendamento realizado com sucesso!", "success");
      setIsModalOpen(false);
      reset();
      fetchAppointments();
    } catch (error) {
      console.error(error);
      showToast("Erro ao realizar agendamento.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCancel(id: number) {
    if (!confirm("Deseja cancelar este agendamento?")) return;
    try {
      await api.put(`/appointments/${id}`, { status: "canceled" });
      showToast("Agendamento cancelado.", "success");
      fetchAppointments();
    } catch (error) {
      showToast("Erro ao cancelar.", "error");
    }
  }

  function getRowBackground(status: string) {
    const s = status.toLowerCase();
    if (s === "agendado" || s === "approved") return "bg-[#F0FDFA]";
    if (s === "cancelado" || s === "canceled") return "bg-[#FEF2F2]";
    return "bg-white";
  }

  function getBadgeStyle(status: string) {
    const s = status.toLowerCase();
    if (s === "agendado" || s === "approved")
      return "border-teal-400 text-teal-600 bg-white";
    if (s === "cancelado" || s === "canceled")
      return "border-red-400 text-red-600 bg-white";
    return "border-[#D7D7D7] text-gray-500 bg-white";
  }

  function getStatusText(status: string) {
    const s = status.toLowerCase();
    if (s === "agendado" || s === "approved") return "Agendado";
    if (s === "cancelado" || s === "canceled") return "Cancelado";
    return "Em análise";
  }

  function getRoomName(appt: Appointment) {
    if (appt.Room?.name) return appt.Room.name;
    const legacyName = appt.room || "Sala não definida";
    return legacyName.length < 5 ? `Sala ${legacyName}` : legacyName;
  }

  return (
    <div className="w-full md:max-w-full max-w-[calc(100vw-32px)] mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="bg-white border border-[#D7D7D7] rounded-lg flex flex-col w-full shadow-sm overflow-hidden max-h-[500px]">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row gap-4 w-full md:flex-1">
              <div className="border border-gray-300 rounded px-3 py-2.5 w-full md:max-w-md flex items-center focus-within:border-black transition bg-white">
                <Search
                  size={20}
                  className="text-gray-400 mr-3 flex-shrink-0"
                />
                <input
                  placeholder="Filtre por sala ou status"
                  className="outline-none w-full text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="border border-gray-300 rounded px-3 py-2.5 w-full md:w-48 flex items-center justify-between text-gray-500 text-sm cursor-pointer hover:border-gray-400 transition bg-white">
                <span>Selecione</span>
                <CalendarIcon size={18} />
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-gray-800 transition shadow-sm w-full md:w-auto flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Novo Agendamento
            </button>
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
                    Status transação
                  </th>
                  <th className="w-[15%] py-4 px-6 font-semibold text-gray-900 text-right border-b border-[#D7D7D7]">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedAppointments.map((appt) => (
                  <tr
                    key={appt.id}
                    className={`${getRowBackground(
                      appt.status
                    )} border-b border-[#D7D7D7] last:border-0 transition-colors`}
                  >
                    <td className="py-5 px-6 text-gray-600 align-middle">
                      {format(new Date(appt.date), "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </td>
                    <td className="py-5 px-4 align-middle">
                      <div className="font-bold text-gray-900 text-base truncate">
                        {appt.user?.name} {appt.user?.surname}
                      </div>
                      <div className="text-gray-500 text-xs mt-0.5">
                        Cliente
                      </div>
                    </td>
                    <td className="py-5 px-4 align-middle">
                      <span className="bg-black text-white text-xs px-4 py-1.5 rounded-full inline-block">
                        Sala <b>{getRoomName(appt)}</b>
                      </span>
                    </td>
                    <td className="py-5 px-4 align-middle">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-medium border inline-block whitespace-nowrap ${getBadgeStyle(
                          appt.status
                        )}`}
                      >
                        {getStatusText(appt.status)}
                      </span>
                    </td>
                    <td className="py-5 px-6 align-middle text-right">
                      {getStatusText(appt.status) !== "Cancelado" && (
                        <button
                          onClick={() => handleCancel(appt.id)}
                          className="w-8 h-8 rounded-full bg-black text-white inline-flex items-center justify-center hover:bg-gray-800 transition shadow-sm"
                          title="Cancelar"
                        >
                          <X size={16} />
                        </button>
                      )}
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Novo Agendamento</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-black"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selecione uma data
                </label>
                <div className="relative">
                  <input
                    type="date"
                    {...register("date")}
                    className="w-full border border-gray-300 rounded p-2 pl-10 outline-none focus:border-black"
                  />
                  <CalendarIcon
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                </div>
                {errors.date && (
                  <span className="text-xs text-red-500">
                    {errors.date.message}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selecione um horário
                </label>
                <div className="relative">
                  <input
                    type="time"
                    {...register("time")}
                    className="w-full border border-gray-300 rounded p-2 pl-10 outline-none focus:border-black"
                  />
                  <Clock
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                </div>
                {errors.time && (
                  <span className="text-xs text-red-500">
                    {errors.time.message}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selecione uma sala
                </label>
                <div className="relative">
                  <select
                    {...register("room")}
                    className="w-full border border-gray-300 rounded p-2 pl-10 outline-none focus:border-black appearance-none bg-white"
                  >
                    <option value="">Selecione...</option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name}
                      </option>
                    ))}
                  </select>
                  <MapPin
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                </div>
                {errors.room && (
                  <span className="text-xs text-red-500">
                    {errors.room.message}
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-black text-white py-3 rounded font-bold transition mt-4 flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "opacity-75 cursor-not-allowed"
                    : "hover:bg-gray-800"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    Agendando...
                  </>
                ) : (
                  "Confirmar Agendamento"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
