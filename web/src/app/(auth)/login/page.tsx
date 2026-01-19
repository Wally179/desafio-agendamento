"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import Cookies from "js-cookie";
import { Logo } from "@/components/Logo";
import { Toast } from "@/components/Toast"; // Importando Toast

// --- 1. HOOK DE DEBOUNCE ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

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

  // --- ESTADO DE TOAST ---
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const emailValue = watch("email");
  const debouncedEmail = useDebounce(emailValue, 500);

  // Verificação baseada no valor com delay (evita validação a cada tecla)
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(debouncedEmail || "");

  // Helper para exibir Toast
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  async function handleLogin(data: LoginFormData) {
    try {
      setLoading(true); // Bloqueia o botão imediatamente

      const response = await api.post("/auth/login", data);
      const { token, user } = response.data;

      // Salva dados
      Cookies.set("token", token, { expires: 7 });
      Cookies.set("user", JSON.stringify(user), { expires: 7 });

      showToast("Login realizado com sucesso!", "success");

      // Pequeno delay para o usuário ver o sucesso antes de navegar
      setTimeout(() => {
        router.push("/appointments");
      }, 1000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.error || "Erro ao fazer login.";
      showToast(errorMessage, "error");
      setLoading(false); // Libera o botão apenas se der erro
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
      {/* TOAST NOTIFICATION */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* HEADER */}
      <header className="flex justify-between items-center px-8 py-6 w-full">
        <div className="flex items-center gap-2">
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
        <h1 className="text-3xl font-bold mb-8 text-black tracking-tight">
          Entre na sua conta
        </h1>

        <div className="bg-white p-8 rounded-lg border border-gray-200 w-full max-w-[480px] shadow-sm transition-all duration-300">
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

            {/* Renderização Condicional da Senha */}
            {isEmailValid && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-500">
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
            )}

            {/* Botão de Ação com Loading */}
            <button
              type="submit"
              disabled={!isValid || loading}
              className={`w-full py-3.5 rounded font-bold text-sm transition mt-2 flex items-center justify-center gap-2 ${
                isValid && !loading
                  ? "bg-black text-white hover:bg-gray-800 shadow-md"
                  : "bg-[#CCCCCC] text-white cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Entrando...
                </>
              ) : (
                "Acessar conta"
              )}
            </button>

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
