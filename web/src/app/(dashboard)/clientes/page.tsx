"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/services/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Search,
  Calendar,
  ToggleRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Loading } from "@/components/Loading";
import { Toast } from "@/components/Toast";
import { EmptyIllustration } from "@/components/EmptyIllustration";

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: string;
  createdAt: string;
  street?: string;
  number?: string;
  district?: string;
  city?: string;
  state?: string;
}

export default function ClientesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao carregar clientes", error);
      showToast("Erro ao carregar lista de clientes.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.name} ${user.surname || ""}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    return (
      fullName.includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const paginatedUsers = sortedUsers.slice(
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
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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
                  type="text"
                  placeholder="Filtre por nome ou e-mail"
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
          </div>
        </div>

        <div className="flex-1 flex flex-col w-full overflow-x-auto">
          {loading ? (
            <Loading />
          ) : paginatedUsers.length > 0 ? (
            <table className="w-full text-left text-sm border-collapse table-fixed min-w-[1000px]">
              <thead>
                <tr className="bg-white border-b border-gray-100">
                  <th
                    className="w-[15%] py-4 pl-4 md:pl-6 pr-2 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors select-none group"
                    onClick={handleSortToggle}
                    title="Clique para ordenar por data"
                  >
                    <div className="flex items-center gap-1">
                      Data de cadastro
                      <span className="text-gray-400 group-hover:text-black transition-colors">
                        {sortOrder === "desc" ? "↓" : "↑"}
                      </span>
                    </div>
                  </th>
                  <th className="w-[20%] py-4 px-4 font-semibold text-gray-900">
                    Nome
                  </th>
                  <th className="w-[30%] py-4 px-4 font-semibold text-gray-900">
                    Endereço
                  </th>
                  <th className="w-[25%] py-4 px-4 font-semibold text-gray-900">
                    Permissões
                  </th>
                  <th className="w-[10%] py-4 pl-2 pr-4 md:pr-6 font-semibold text-gray-900 text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-5 pl-4 md:pl-6 pr-2 text-gray-600 align-middle">
                      {user.createdAt
                        ? format(
                            new Date(user.createdAt),
                            "dd/MM/yyyy 'às' HH:mm",
                            { locale: ptBR },
                          )
                        : "-"}
                    </td>

                    <td className="py-5 px-4 align-middle">
                      <div className="font-bold text-gray-900 text-base truncate">
                        {user.name} {user.surname}
                      </div>
                      <div className="text-gray-500 text-xs mt-0.5">
                        Cliente
                      </div>
                    </td>

                    <td className="py-5 px-4 text-gray-600 align-middle leading-relaxed">
                      {user.street ? (
                        <div
                          className="truncate w-full max-w-[250px]"
                          title={`${user.street}, nº${user.number} - ${user.district}, ${user.city} - ${user.state}`}
                        >
                          {user.street}, nº{user.number}
                          <br />
                          {user.district}, {user.city} - {user.state}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">
                          Endereço não informado
                        </span>
                      )}
                    </td>

                    <td className="py-5 px-4 align-middle">
                      <div className="flex gap-2">
                        <Link
                          href={`/agendamentos?user_id=${user.id}`}
                          className="bg-black text-white px-4 py-1.5 rounded-full text-xs font-medium hover:bg-gray-800 transition whitespace-nowrap"
                        >
                          Agendamentos
                        </Link>
                        <Link
                          href={`/logs?user_id=${user.id}`}
                          className="border border-gray-300 text-gray-700 px-4 py-1.5 rounded-full text-xs font-medium hover:bg-gray-100 transition whitespace-nowrap"
                        >
                          Logs
                        </Link>
                      </div>
                    </td>

                    <td className="py-5 pl-2 pr-4 md:pr-6 text-center align-middle">
                      <button className="text-black hover:opacity-80 transition">
                        <ToggleRight size={32} strokeWidth={1.5} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-300">
              <EmptyIllustration />
              <h3 className="text-xl font-semibold text-gray-900 mt-6">
                Nenhum cliente encontrado.
              </h3>
            </div>
          )}
        </div>
      </div>

      {!loading && sortedUsers.length > 0 && (
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
