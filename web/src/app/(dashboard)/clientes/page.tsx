"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, Calendar, ToggleRight } from "lucide-react";
import Link from "next/link";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao carregar clientes", error);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.name} ${user.surname || ""}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <div className="p-8 text-gray-500">Carregando clientes...</div>;
  }

  return (
    // 1. CONTAINER RAIZ BLINDADO
    <div className="w-full md:max-w-full max-w-[calc(100vw-32px)] mx-auto">
      {/* 2. CARD PRINCIPAL */}
      <div className="bg-white border border-[#D7D7D7] rounded-lg flex flex-col w-full shadow-sm overflow-hidden">
        {/* HEADER (Filtros) */}
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Grupo de Inputs */}
            <div className="flex flex-col md:flex-row gap-4 w-full md:flex-1">
              {/* Input Busca */}
              <div className="border border-[#D7D7D7] rounded px-3 py-2.5 w-full md:max-w-md flex items-center focus-within:border-black transition bg-white">
                <Search
                  size={20}
                  className="text-gray-400 mr-3 flex-shrink-0"
                />
                <input
                  type="text"
                  placeholder="Filtre por nome"
                  className="outline-none w-full text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Input Data */}
              <div className="border border-[#D7D7D7] rounded px-3 py-2.5 w-full md:w-48 flex items-center justify-between text-gray-500 text-sm cursor-pointer hover:border-gray-400 transition bg-white">
                <span>Selecione</span>
                <Calendar size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* 3. WRAPPER DA TABELA (SCROLL) */}
        <div className="w-full overflow-x-auto border-t border-[#D7D7D7] md:border-t-0">
          {/* TABELA (min-w para ativar scroll) */}
          <table className="w-full text-left text-sm border-collapse table-fixed min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 border-b border-[#D7D7D7]">
                <th className="w-[15%] py-4 pl-4 md:pl-6 pr-2 font-medium text-gray-500">
                  Data de cadastro ↕
                </th>
                <th className="w-[20%] py-4 px-4 font-medium text-gray-500">
                  Nome
                </th>
                <th className="w-[30%] py-4 px-4 font-medium text-gray-500">
                  Endereço
                </th>
                <th className="w-[25%] py-4 px-4 font-medium text-gray-500">
                  Permissões
                </th>
                <th className="w-[10%] py-4 pl-2 pr-4 md:pr-6 font-medium text-gray-500 text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors border-b border-[#D7D7D7] last:border-0"
                >
                  {/* Data */}
                  <td className="py-5 pl-4 md:pl-6 pr-2 text-gray-600 align-middle">
                    {user.createdAt
                      ? format(
                          new Date(user.createdAt),
                          "dd/MM/yyyy 'às' HH:mm",
                          { locale: ptBR }
                        )
                      : "-"}
                  </td>

                  {/* Nome */}
                  <td className="py-5 px-4 align-middle">
                    <div className="font-semibold text-gray-900 text-base truncate">
                      {user.name} {user.surname}
                    </div>
                    <div className="text-gray-400 text-xs mt-0.5">Cliente</div>
                  </td>

                  {/* Endereço */}
                  <td className="py-5 px-4 text-gray-600 align-middle leading-relaxed">
                    {user.street ? (
                      <div
                        className="truncate w-full"
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

                  {/* Permissões */}
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

                  {/* Status */}
                  <td className="py-5 pl-2 pr-4 md:pr-6 text-center align-middle">
                    <button className="text-black hover:opacity-80 transition">
                      <ToggleRight size={32} strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginação */}
      <div className="flex justify-end gap-2 mt-4 px-1">
        <button className="w-8 h-8 flex items-center justify-center bg-black text-white rounded text-sm hover:bg-gray-800 transition">
          &lt;
        </button>
        <button className="w-8 h-8 flex items-center justify-center bg-black text-white rounded text-sm hover:bg-gray-800 transition">
          1
        </button>
        <button className="w-8 h-8 flex items-center justify-center bg-black text-white rounded text-sm hover:bg-gray-800 transition">
          &gt;
        </button>
      </div>
    </div>
  );
}
