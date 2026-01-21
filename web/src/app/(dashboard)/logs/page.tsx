"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  User as UserIcon,
  List,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import api from "@/services/api";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loading } from "@/components/Loading";

interface UserData {
  name: string;
  surname: string;
  role: string;
}

interface Log {
  id: number;
  action: string;
  module: string;
  createdAt: string;
  user?: UserData;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    async function fetchLogs() {
      try {
        const userCookie = Cookies.get("user");
        if (userCookie) {
          const user = JSON.parse(userCookie);
          const isUserAdmin = user.role === "admin";
          setIsAdmin(isUserAdmin);

          const url = isUserAdmin ? "/logs" : `/logs/${user.id}`;
          const response = await api.get(url);
          setLogs(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar logs", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    const actionMatch = log.action.toLowerCase().includes(term);
    const moduleMatch = log.module.toLowerCase().includes(term);
    const userMatch = log.user
      ? `${log.user.name} ${log.user.surname}`.toLowerCase().includes(term)
      : false;

    return actionMatch || moduleMatch || userMatch;
  });

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);

  const paginatedLogs = sortedLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
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

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  return (
    <div className="w-full md:max-w-full max-w-[calc(100vw-32px)] mx-auto">
      <div className="bg-white border border-[#D7D7D7] rounded-lg flex flex-col w-full shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row gap-4 w-full md:flex-1">
              <div className="border border-gray-300 rounded px-3 py-2.5 w-full md:max-w-md flex items-center focus-within:border-black transition bg-white">
                <Search
                  size={20}
                  className="text-gray-400 mr-3 flex-shrink-0"
                />
                <input
                  type="text"
                  placeholder="Filtre por cliente, atividade ou módulo"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="outline-none w-full text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
                />
              </div>
              <div className="border border-gray-300 rounded px-3 py-2.5 w-full md:w-48 flex items-center justify-between text-gray-500 text-sm cursor-pointer hover:border-gray-400 transition bg-white">
                <span>Selecione</span>
                <Calendar size={18} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col w-full overflow-x-auto">
          {loading ? (
            <Loading />
          ) : (
            <table className="w-full text-left text-sm border-collapse table-fixed min-w-[1000px]">
              <thead>
                <tr>
                  {isAdmin && (
                    <th className="w-[25%] py-4 px-6 font-semibold text-gray-900 border-b border-[#D7D7D7]">
                      Cliente
                    </th>
                  )}
                  <th
                    className={`${
                      isAdmin ? "w-[25%]" : "w-[35%]"
                    } py-4 px-4 font-semibold text-gray-900 border-b border-[#D7D7D7]`}
                  >
                    Tipo de atividade
                  </th>
                  <th className="w-[25%] py-4 px-4 font-semibold text-gray-900 border-b border-[#D7D7D7]">
                    Módulo
                  </th>
                  <th
                    className="w-[25%] py-4 px-6 font-semibold text-gray-900 text-right border-b border-[#D7D7D7] cursor-pointer hover:bg-gray-50 transition-colors select-none group"
                    onClick={handleSortToggle}
                    title="Clique para ordenar por data"
                  >
                    <div className="flex items-center justify-end gap-1">
                      Data e horário
                      <span className="text-gray-400 group-hover:text-black transition-colors">
                        {sortOrder === "desc" ? "↓" : "↑"}
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-[#F9FAFB] transition-colors border-b border-[#D7D7D7] last:border-0"
                  >
                    {isAdmin && (
                      <td className="py-5 px-6 align-middle">
                        {log.user ? (
                          <>
                            <div className="font-bold text-gray-900 text-base truncate">
                              {log.user.name} {log.user.surname}
                            </div>
                            <div className="text-gray-500 text-xs mt-0.5">
                              Cliente
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-400 italic">Sistema</span>
                        )}
                      </td>
                    )}
                    <td className="py-5 px-4 align-middle">
                      <span className="bg-gray-100 text-gray-700 text-xs px-4 py-1.5 rounded-full font-medium border border-gray-200 inline-block whitespace-nowrap">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-5 px-4 align-middle">
                      <span className="bg-gray-100 text-gray-700 text-xs px-4 py-1.5 rounded-full font-medium border border-gray-200 inline-flex items-center gap-2 whitespace-nowrap">
                        {log.module === "Agendamento" ? (
                          <Calendar size={14} className="text-gray-500" />
                        ) : (
                          <UserIcon size={14} className="text-gray-500" />
                        )}
                        {log.module}
                      </span>
                    </td>
                    <td className="py-5 px-6 align-middle text-right">
                      <span className="bg-gray-100 text-gray-600 text-xs px-4 py-1.5 rounded-full border border-gray-200 inline-block whitespace-nowrap">
                        {format(
                          new Date(log.createdAt),
                          "dd/MM/yyyy 'às' HH:mm",
                          { locale: ptBR },
                        )}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredLogs.length === 0 && (
                  <tr>
                    <td
                      colSpan={isAdmin ? 4 : 3}
                      className="py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <List size={40} className="text-gray-300 mb-2" />
                        <p>Nenhum registro encontrado.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {!loading && filteredLogs.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-4 select-none">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="w-6 h-6 flex items-center justify-center rounded-md bg-black text-white transition hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="w-8 h-8 flex items-center justify-center rounded-md bg-black text-white text-sm font-bold">
            {currentPage}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="w-6 h-6 flex items-center justify-center rounded-md bg-black text-white transition hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
