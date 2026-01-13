"use client";

import { useState, useEffect, useCallback } from "react"; // Adicionei useCallback
import { Calendar as CalendarIcon, Plus, X, Clock, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/services/api";
import Cookies from "js-cookie";

// --- TIPO DO DADO QUE VEM DO BACKEND ---
interface Appointment {
  id: number;
  date: string;
  room: string;
  status: "agendado" | "cancelado" | "em_analise" | "concluido";
  User: {
    name: string;
    surname: string;
  };
}

// --- VALIDAÇÃO DO FORMULÁRIO (Modal) ---
const appointmentSchema = z.object({
  date: z.string().min(1, { message: "Selecione uma data" }),
  time: z.string().min(1, { message: "Selecione um horário" }),
  room: z.string().min(1, { message: "Selecione uma sala" }),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // React Hook Form para o Modal
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  // --- 1. BUSCAR AGENDAMENTOS (Listar) ---
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
    }
  }, []);

  // Carrega a lista assim que a página abre
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // --- 2. CRIAR NOVO AGENDAMENTO ---
  async function handleCreate(data: AppointmentFormData) {
    try {
      setLoading(true);
      const userCookie = Cookies.get("user");
      if (!userCookie) return;
      const user = JSON.parse(userCookie);

      // Junta Data e Hora num formato ISO para o Banco (YYYY-MM-DDTHH:mm:00)
      const finalDate = `${data.date}T${data.time}:00`;

      await api.post(`/appointments/${user.id}`, {
        date: finalDate,
        room: data.room,
      });

      alert("Agendamento realizado com sucesso!");
      setIsModalOpen(false); // Fecha o modal
      reset(); // Limpa o formulário
      fetchAppointments(); // Atualiza a lista na hora
    } catch (error) {
      alert("Erro ao agendar. Tente novamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // --- 3. CANCELAR AGENDAMENTO ---
  async function handleCancel(id: number) {
    if (!confirm("Tem certeza que deseja cancelar este agendamento?")) return;

    try {
      await api.patch(`/appointments/${id}/cancel`);
      fetchAppointments(); // Atualiza a lista
    } catch (error) {
      alert("Erro ao cancelar.");
    }
  }

  // Função auxiliar para formatar data bonita (Ex: 22/01/2025 às 16:00)
  function formatDate(isoString: string) {
    const date = new Date(isoString);
    return (
      date.toLocaleDateString("pt-BR") +
      " às " +
      date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    );
  }

  return (
    <div>
      {/* --- HEADER --- */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-1">Agendamento</h1>
          <p className="text-gray-500">Acompanhe todos os seus agendamentos</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition"
        >
          <Plus size={20} />
          Novo Agendamento
        </button>
      </div>

      {/* --- LISTA VAZIA (Se não tiver nada) --- */}
      {appointments.length === 0 ? (
        <div className="border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-center h-96 bg-white shadow-sm">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <CalendarIcon size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Nada por aqui ainda...
          </h3>
          <p className="text-gray-500 max-w-sm">
            Você ainda não realizou nenhum agendamento. Clique no botão acima
            para começar.
          </p>
        </div>
      ) : (
        /* --- TABELA DE AGENDAMENTOS --- */
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase">
                <th className="p-4 font-medium">Data agendamento</th>
                <th className="p-4 font-medium">Nome</th>
                <th className="p-4 font-medium">Sala</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 text-sm text-gray-700">
                    {formatDate(appt.date)}
                  </td>
                  <td className="p-4 text-sm text-gray-900 font-medium">
                    {appt.User?.name} {appt.User?.surname}
                    <br />
                    <span className="text-xs text-gray-400 font-normal">
                      Cliente
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="bg-black text-white text-xs px-2 py-1 rounded-full font-bold">
                      {appt.room}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full border ${
                        appt.status === "agendado"
                          ? "bg-green-50 text-green-600 border-green-200"
                          : appt.status === "cancelado"
                          ? "bg-red-50 text-red-600 border-red-200"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                    >
                      {appt.status === "agendado"
                        ? "Agendado"
                        : appt.status === "cancelado"
                        ? "Cancelado"
                        : "Em análise"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {appt.status !== "cancelado" && (
                      <button
                        onClick={() => handleCancel(appt.id)}
                        className="text-gray-400 hover:text-black transition"
                        title="Cancelar"
                      >
                        <X
                          size={20}
                          className="bg-black text-white rounded-full p-1"
                        />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODAL (Novo Agendamento) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
              {/* Data */}
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

              {/* Horário */}
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

              {/* Sala */}
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
                    <option value="Sala 012">Sala 012</option>
                    <option value="Sala 013">Sala 013</option>
                    <option value="Auditorio">Auditório</option>
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
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition mt-4"
              >
                {loading ? "Confirmando..." : "Confirmar Agendamento"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
