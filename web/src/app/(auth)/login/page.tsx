"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Layers } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import Cookies from "js-cookie";
import { Logo } from "@/components/Logo";

// Schema de validação
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "O e-mail é obrigatório" })
    .email({ message: "Formato de e-mail inválido" }),
  password: z.string().min(1, { message: "A senha é obrigatória" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  async function handleLogin(data: LoginFormData) {
    try {
      setLoading(true);
      const response = await api.post("/auth/login", data);
      const { token, user } = response.data;

      Cookies.set("token", token, { expires: 7 });
      Cookies.set("user", JSON.stringify(user), { expires: 7 });

      router.push("/appointments");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4F1]">
      {/* HEADER */}
      <header className="flex justify-between items-center px-8 py-6 w-full">
        <div className="flex items-center gap-2">
          {/* Logo simples preta */}
          <Logo className="h-8 w-8 text-black" />
        </div>
        <Link
          href="/register"
          className="bg-black text-white px-8 py-2.5 rounded text-sm font-medium hover:bg-gray-800 transition shadow-sm"
        >
          Cadastre-se
        </Link>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {/* 2. TÍTULO FORA DO CARD */}
        <h1 className="text-3xl font-bold mb-8 text-black tracking-tight">
          Entre na sua conta
        </h1>

        {/* 3. CARD BRANCO */}
        <div className="bg-white p-8 rounded-lg border border-gray-200 w-full max-w-[480px] shadow-sm">
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
            {/* Input E-mail */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-900">
                E-mail{" "}
                <span className="text-gray-500 font-normal text-xs ml-1">
                  (Obrigatório)
                </span>
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="Insira seu e-mail"
                className="w-full border border-gray-300 rounded px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition placeholder:text-gray-400"
              />
              {errors.email && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Input Senha */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-900">
                Senha de acesso{" "}
                <span className="text-gray-500 font-normal text-xs ml-1">
                  (Obrigatório)
                </span>
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Insira sua senha"
                  className="w-full border border-gray-300 rounded px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition pr-10 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-black transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Botão de Ação */}
            <button
              type="submit"
              disabled={!isValid || loading}
              className={`w-full py-3.5 rounded font-bold text-sm transition mt-2 ${
                isValid
                  ? "bg-black text-white hover:bg-gray-800 shadow-md"
                  : "bg-[#CCCCCC] text-white cursor-not-allowed" // Cinza claro igual ao design quando desabilitado
              }`}
            >
              {loading ? "Entrando..." : "Acessar conta"}
            </button>

            {/* Link Rodapé do Card */}
            <div className="flex items-center justify-between mt-6 pt-2">
              <p className="text-sm text-gray-600">
                Ainda não tem um cadastro?
              </p>
              <Link
                href="/register"
                className="text-sm font-bold text-black border-b border-black hover:opacity-80 transition pb-0.5"
              >
                Cadastre-se
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
