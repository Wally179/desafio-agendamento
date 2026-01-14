"use client";

import { useState, useEffect } from "react";
import { X, Clock, Plus, ChevronDown, ArrowLeft } from "lucide-react";
import api from "@/services/api";

interface RoomFromAPI {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  slot_duration: number;
  active: boolean;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [rooms, setRooms] = useState<RoomFromAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    timeRange: "",
    duration: "30",
  });

  async function fetchRooms() {
    try {
      setIsLoading(true);
      const response = await api.get("/rooms");
      const data: RoomFromAPI[] = response.data;

      setRooms(data);

      if (data.length > 0 && !isCreating) {
        selectRoom(data[0]);
      }
    } catch (error) {
      console.error("Erro ao buscar salas:", error);
      alert("Erro ao carregar as salas.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchRooms();
    }
  }, [isOpen]);

  function selectRoom(room: RoomFromAPI) {
    setFormData({
      id: room.id,
      name: room.name,
      timeRange: `${room.start_time} - ${room.end_time}`,
      duration: String(room.slot_duration),
    });
  }

  function handleRoomChange(roomIdStr: string) {
    const roomId = Number(roomIdStr);
    const selectedRoom = rooms.find((r) => r.id === roomId);
    if (selectedRoom) {
      selectRoom(selectedRoom);
    }
  }

  function handleAddRoomClick() {
    setIsCreating(true);
    setFormData({
      id: 0,
      name: "",
      timeRange: "08:00 - 18:00",
      duration: "30",
    });
  }

  function handleCancelCreation() {
    setIsCreating(false);

    if (rooms.length > 0) {
      selectRoom(rooms[0]);
    }
  }

  async function handleSave() {
    try {
      const [startTime, endTime] = formData.timeRange.split(" - ");

      if (!startTime || !endTime) {
        return alert("Formato de horário inválido. Use 'HH:mm - HH:mm'");
      }

      const payload = {
        name: formData.name,
        start_time: startTime.trim(),
        end_time: endTime.trim(),
        slot_duration: Number(formData.duration),
      };

      if (isCreating) {
        if (!formData.name) return alert("Dê um nome para a sala.");

        await api.post("/rooms", payload);
        alert("Sala criada com sucesso!");

        setIsCreating(false);
        fetchRooms();
      } else {
        await api.put(`/rooms/${formData.id}`, {
          start_time: payload.start_time,
          end_time: payload.end_time,
          slot_duration: payload.slot_duration,
        });

        alert("Sala atualizada com sucesso!");
        fetchRooms();
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar as alterações.");
    }
  }

  if (!isOpen) return null;

  return (
    // 1. ALTERAÇÃO AQUI: onClick={onClose} no container pai (fundo preto)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity"
      onClick={onClose}
    >
      {/* 2. ALTERAÇÃO AQUI: onClick stopPropagation no filho (conteúdo branco) */}
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {isCreating ? "Nova Sala" : "Ajustes de agendamento"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition p-1 rounded-md hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* CORPO */}
        <div className="p-6 space-y-5">
          {/* NOME DA SALA (Select ou Input) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                Nome da sala
              </label>
              {isCreating && (
                <button
                  onClick={handleCancelCreation}
                  className="text-xs text-red-500 hover:underline flex items-center gap-1"
                >
                  <ArrowLeft size={12} /> Cancelar criação
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="h-10 w-full bg-gray-100 animate-pulse rounded-lg" />
            ) : isCreating ? (
              <input
                type="text"
                placeholder="Ex: Sala de Reunião 2"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                autoFocus
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition bg-gray-50"
              />
            ) : (
              <div className="relative">
                <select
                  value={formData.id}
                  onChange={(e) => handleRoomChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black appearance-none bg-white cursor-pointer transition pr-10"
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
                />
              </div>
            )}
          </div>

          {/* HORÁRIO (Start - End) */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Horário Inicial & Final da sala
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.timeRange}
                onChange={(e) =>
                  setFormData({ ...formData, timeRange: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              />
              <Clock
                size={18}
                className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
              />
            </div>
            <p className="text-[10px] text-gray-400">Formato: HH:mm - HH:mm</p>
          </div>

          {/* DURAÇÃO (Slot) */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Bloco de Horários de agendamento
            </label>
            <div className="relative">
              <select
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black appearance-none bg-white cursor-pointer transition"
              >
                <option value="15">15 minutos</option>
                <option value="30">30 minutos</option>
                <option value="45">45 minutos</option>
                <option value="60">1 hora</option>
                <option value="120">2 horas</option>
              </select>
              <ChevronDown
                size={18}
                className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* BOTÃO ADICIONAR (Some se já estiver criando) */}
          {!isCreating && (
            <div className="border-t border-gray-100 pt-2">
              <button
                onClick={handleAddRoomClick}
                className="flex items-center gap-2 text-sm font-medium text-black hover:opacity-70 transition"
              >
                <Plus size={18} />
                Adicionar nova sala
              </button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 pt-2">
          <button
            onClick={handleSave}
            className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition shadow-sm"
          >
            {isCreating ? "Criar Sala" : "Salvar Alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}
