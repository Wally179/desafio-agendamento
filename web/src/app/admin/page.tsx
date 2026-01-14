"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import Cookies from "js-cookie";

// Schema de validação
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "O e-mail é obrigatório" })
    .email({ message: "Formato de e-mail inválido" }),
  password: z.string().min(1, { message: "A senha é obrigatória" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  async function handleLogin(data: LoginFormData) {
    try {
      setLoading(true);

      const response = await api.post("/auth/login", data);
      const { token, user } = response.data;

      // TRAVA DE SEGURANÇA: Só deixa passar se for ADMIN
      if (user.role !== "admin") {
        alert("Acesso negado. Apenas administradores.");
        setLoading(false);
        return;
      }

      // Salva cookie e redireciona
      Cookies.set("token", token, { expires: 1 });
      Cookies.set("user", JSON.stringify(user), { expires: 1 });

      router.push("/agendamentos");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    // Fundo bege exato do design (#F5F3EF)
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F3EF] p-4">
      {/* Ícone Logo (Centralizado acima do título) */}
      <div className="mb-6">
        {/* Usando Layers rotacionado para simular o logo do print. 
            Se tiver o SVG exato, troque aqui. */}
        <Layers
          className="h-12 w-12 text-black transform rotate-45"
          strokeWidth={2.5}
        />
      </div>

      <h1 className="text-3xl font-bold mb-8 text-black tracking-tight">
        Login Admin
      </h1>

      <div className="bg-white p-10 rounded-lg shadow-sm w-full max-w-[480px]">
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
          {/* Input Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              E-mail{" "}
              <span className="font-normal text-gray-600">(Obrigatorio)</span>
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="mateus@goldspell.com.br"
              className="w-full border border-gray-200 rounded p-3 text-gray-700 outline-none focus:border-black transition placeholder:text-gray-400"
            />
            {errors.email && (
              <span className="text-xs text-red-500 block mt-1">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Input Senha */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              Senha de acesso{" "}
              <span className="font-normal text-gray-600">(Obrigatorio)</span>
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="***************"
                className="w-full border border-gray-200 rounded p-3 text-gray-700 outline-none focus:border-black transition pr-10 placeholder:text-gray-400 tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-black hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-red-500 block mt-1">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Botão Preto Full Width */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded font-medium text-sm hover:bg-gray-900 transition mt-4"
          >
            {loading ? "Entrando..." : "Acessar conta"}
          </button>
        </form>
      </div>
    </div>
  );
}
