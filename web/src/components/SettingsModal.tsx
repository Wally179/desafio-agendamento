"use client";

import { X, Clock, Plus, ChevronDown } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity">
      {/* Container do Modal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Ajustes de agendamento
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition p-1 rounded-md hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* CORPO (Scrollável se necessário) */}
        <div className="p-6 space-y-5">
          {/* Nome da Sala */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Nome da sala
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
            />
          </div>

          {/* Horário Inicial & Final */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Horário Inicial & Final da sala
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              />
              <Clock
                size={18}
                className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Bloco de Horários */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Bloco de Horários de agendamento
            </label>
            <div className="relative">
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black appearance-none bg-white cursor-pointer transition"
                defaultValue="30"
              >
                <option value="15">15 minutos</option>
                <option value="30">30 minutos</option>
                <option value="60">1 hora</option>
              </select>
              <ChevronDown
                size={18}
                className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Divisor Visual */}
          <div className="border-t border-gray-100 pt-2">
            <button className="flex items-center gap-2 text-sm font-medium text-black hover:opacity-70 transition">
              <Plus size={18} />
              Adicionar nova sala
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 pt-2">
          <button
            onClick={onClose} // No futuro, aqui vai salvar no banco
            className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition shadow-sm"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
