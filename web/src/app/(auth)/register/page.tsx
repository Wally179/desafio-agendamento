"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Layers } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import axios from "axios";

// --- SCHEMA DE VALIDAÇÃO (Blindado para Zod v4) ---
const registerSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  surname: z.string().min(1, { message: "Sobrenome é obrigatório" }),
  email: z
    .string()
    .min(1, { message: "E-mail é obrigatório" })
    .email({ message: "E-mail inválido" }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
  zip_code: z.string().min(8, { message: "CEP inválido" }).max(9),
  street: z.string().min(1, { message: "Endereço é obrigatório" }),
  number: z.string().min(1, { message: "Número é obrigatório" }),
  complement: z.string().optional(),
  district: z.string().min(1, { message: "Bairro é obrigatório" }),
  city: z.string().min(1, { message: "Cidade é obrigatória" }),
  state: z.string().min(1, { message: "Estado é obrigatório" }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue, // Usado para preencher o endereço automático
    setFocus, // Usado para pular para o campo "Número"
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  // --- FUNÇÃO MÁGICA DO CEP ---
  async function handleBlurCep(e: React.FocusEvent<HTMLInputElement>) {
    const cep = e.target.value.replace(/\D/g, ""); // Remove traços e pontos

    if (cep.length === 8) {
      try {
        const response = await axios.get(
          `https://viacep.com.br/ws/${cep}/json/`
        );
        if (!response.data.erro) {
          setValue("street", response.data.logradouro);
          setValue("district", response.data.bairro);
          setValue("city", response.data.localidade);
          setValue("state", response.data.uf);
          setFocus("number"); // Joga o foco direto para o número
        }
      } catch (error) {
        console.error("Erro ao buscar CEP", error);
      }
    }
  }

  // --- ENVIAR PARA O BACKEND ---
  async function handleRegister(data: RegisterFormData) {
    try {
      setLoading(true);

      // Envia para nossa API Node.js
      await api.post("/auth/register", data);

      alert("Cadastro realizado com sucesso!");
      router.push("/login"); // Manda o usuário para o login

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Layers className="h-8 w-8 text-black transform rotate-45" />
        </div>
        <Link
          href="/login"
          className="bg-black text-white px-6 py-2 rounded text-sm font-medium hover:bg-gray-800 transition"
        >
          Login
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 py-10">
        <h1 className="text-2xl font-bold mb-8 text-black">Cadastre-se</h1>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 w-full max-w-xl">
          <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
            {/* Linha 1: Nome e Sobrenome */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Nome{" "}
                  <span className="text-gray-400 font-normal">
                    (Obrigatório)
                  </span>
                </label>
                <input
                  {...register("name")}
                  placeholder="ex.: Jose"
                  className="w-full border border-gray-200 rounded p-3 text-sm outline-none focus:border-black transition"
                />
                {errors.name && (
                  <span className="text-xs text-red-500">
                    {errors.name.message}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Sobrenome{" "}
                  <span className="text-gray-400 font-normal">
                    (Obrigatório)
                  </span>
                </label>
                <input
                  {...register("surname")}
                  placeholder="ex.: Lima"
                  className="w-full border border-gray-200 rounded p-3 text-sm outline-none focus:border-black transition"
                />
                {errors.surname && (
                  <span className="text-xs text-red-500">
                    {errors.surname.message}
                  </span>
                )}
              </div>
            </div>

            {/* E-mail */}
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

            {/* Senha */}
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

            {/* CEP */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                CEP{" "}
                <span className="text-gray-400 font-normal">(Obrigatório)</span>
              </label>
              <input
                {...register("zip_code")}
                onBlur={handleBlurCep} // Chama ViaCEP quando sair do campo
                placeholder="Insira seu CEP"
                className="w-full border border-gray-200 rounded p-3 text-sm outline-none focus:border-black transition"
              />
              {errors.zip_code && (
                <span className="text-xs text-red-500">
                  {errors.zip_code.message}
                </span>
              )}
            </div>

            {/* Endereço (Preenchido Automaticamente) */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Endereço
              </label>
              <input
                {...register("street")}
                readOnly
                className="w-full border border-gray-200 bg-gray-100 rounded p-3 text-sm outline-none text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Número */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Número
              </label>
              <input
                {...register("number")}
                className="w-full border border-gray-200 rounded p-3 text-sm outline-none focus:border-black transition"
              />
              {errors.number && (
                <span className="text-xs text-red-500">
                  {errors.number.message}
                </span>
              )}
            </div>

            {/* Complemento */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Complemento
              </label>
              <input
                {...register("complement")}
                className="w-full border border-gray-200 rounded p-3 text-sm outline-none focus:border-black transition"
              />
            </div>

            {/* Bairro */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Bairro
              </label>
              <input
                {...register("district")}
                readOnly
                className="w-full border border-gray-200 bg-gray-100 rounded p-3 text-sm outline-none text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Cidade e Estado */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <input
                  {...register("city")}
                  readOnly
                  className="w-full border border-gray-200 bg-gray-100 rounded p-3 text-sm outline-none text-gray-500 cursor-not-allowed"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Estado
                </label>
                <input
                  {...register("state")}
                  readOnly
                  className="w-full border border-gray-200 bg-gray-100 rounded p-3 text-sm outline-none text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!isValid || loading}
              className={`w-full py-3 rounded font-medium transition mt-4 ${
                isValid
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-300 text-white cursor-not-allowed"
              }`}
            >
              {loading ? "Cadastrando..." : "Cadastrar-se"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
