"use client";

import { useState, useEffect } from "react";
import { List, Search, Calendar } from "lucide-react";
import api from "@/services/api";
import Cookies from "js-cookie";

interface Log {
  id: number;
  action: string;
  module: string;
  createdAt: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    // Definimos a função aqui dentro para evitar dependências externas
    async function fetchLogs() {
      try {
        const userCookie = Cookies.get("user");
        if (userCookie) {
          const user = JSON.parse(userCookie);
          const response = await api.get(`/logs/${user.id}`);
          setLogs(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar logs", error);
      }
    }

    fetchLogs();
  }, []); // Array vazio = roda apenas uma vez ao montar a tela

  // Formata data (Ex: 04/06/2025 às 22:00)
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-1">Logs</h1>
        <p className="text-gray-500">
          Acompanhe todo o histórico de atividades da sua conta
        </p>
      </div>

      {/* Filtro Visual */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Filtre por tipo de atividade ou Módulo"
            className="w-full border border-gray-200 rounded p-3 pl-10 text-sm outline-none focus:border-black"
          />
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="relative w-48">
          <input
            type="text"
            placeholder="Selecione data"
            className="w-full border border-gray-200 rounded p-3 pl-4 text-sm outline-none focus:border-black"
            readOnly
          />
          <Calendar
            size={18}
            className="absolute right-3 top-3 text-gray-400"
          />
        </div>
      </div>

      {/* Tabela */}
      {logs.length === 0 ? (
        <div className="border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-center h-64 bg-white shadow-sm">
          <List size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500">
            Nenhum registro de atividade encontrado.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-xs text-gray-900 font-bold">
                <th className="p-4 font-medium">Tipo de atividade</th>
                <th className="p-4 font-medium">Módulo</th>
                <th className="p-4 font-medium text-right">Data e horário ↕</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium border border-gray-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 flex items-center gap-2">
                    {log.module === "Agendamento" ? (
                      <Calendar size={14} />
                    ) : (
                      <List size={14} />
                    )}
                    {log.module}
                  </td>
                  <td className="p-4 text-sm text-gray-500 text-right">
                    <span className="bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                      {formatDate(log.createdAt)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
