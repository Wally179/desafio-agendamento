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

// --- CORREÇÃO DO ZOD AQUI ---
// A versão nova exige que a mensagem seja um objeto { message: '...' }
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

      // Faz o login no backend
      const response = await api.post("/auth/login", data);
      const { token, user } = response.data;

      // Salva token e usuário nos cookies
      Cookies.set("token", token, { expires: 7 });
      Cookies.set("user", JSON.stringify(user), { expires: 7 });

      // Redireciona (vamos criar essa rota depois)
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
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Layers className="h-8 w-8 text-black transform rotate-45" />
        </div>
        <Link
          href="/register"
          className="bg-black text-white px-6 py-2 rounded text-sm font-medium hover:bg-gray-800 transition"
        >
          Cadastre-se
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-8 text-black">
          Entre na sua conta
        </h1>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 w-full max-w-md">
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                E-mail{" "}
                <span className="text-gray-400 font-normal">(Obrigatório)</span>
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="Insira seu e-mail"
                className="w-full border border-gray-200 rounded p-3 text-sm outline-none focus:border-black transition"
              />
              {errors.email && (
                <span className="text-xs text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Senha de acesso{" "}
                <span className="text-gray-400 font-normal">(Obrigatório)</span>
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Insira sua senha"
                  className="w-full border border-gray-200 rounded p-3 text-sm outline-none focus:border-black transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid || loading}
              className={`w-full py-3 rounded font-medium transition ${
                isValid
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-300 text-white cursor-not-allowed"
              }`}
            >
              {loading ? "Entrando..." : "Acessar conta"}
            </button>

            <div className="text-center text-sm text-gray-600 mt-4">
              Ainda não tem um cadastro?{" "}
              <Link
                href="/register"
                className="font-bold text-black underline hover:text-gray-800"
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
