"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { Logo } from "@/components/Logo";
import { Toast } from "@/components/Toast";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const registerSchema = z.object({
  name: z.string().min(2, "Mínimo 2 letras"),
  surname: z.string().min(2, "Mínimo 2 letras"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  zip_code: z.string().min(8, "CEP inválido"),
  street: z.string().min(1, "Obrigatório"),
  number: z.string().min(1, "Obrigatório"),
  complement: z.string().optional(),
  district: z.string().min(1, "Obrigatório"),
  city: z.string().min(1, "Obrigatório"),
  state: z.string().min(2, "Obrigatório"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAddressFields, setShowAddressFields] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const zipCode = watch("zip_code");
  const debouncedZip = useDebounce(zipCode, 500);

  useEffect(() => {
    async function fetchAddress() {
      const cleanZip = debouncedZip?.replace(/\D/g, "");

      if (cleanZip?.length === 8) {
        try {
          const response = await fetch(
            `https://viacep.com.br/ws/${cleanZip}/json/`
          );
          const data = await response.json();

          if (!data.erro) {
            setValue("street", data.logradouro);
            setValue("district", data.bairro);
            setValue("city", data.localidade);
            setValue("state", data.uf);

            setShowAddressFields(true);

            setTimeout(() => setFocus("number"), 100);
          } else {
            setShowAddressFields(false);
          }
        } catch (error) {
          setShowAddressFields(false);
        }
      }
    }
    fetchAddress();
  }, [debouncedZip, setValue, setFocus]);

  async function handleRegister(data: RegisterFormData) {
    try {
      setLoading(true);
      await api.post("/auth/register", data);

      showToast("Cadastro realizado com sucesso!", "success");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.error || "Erro ao cadastrar.";
      showToast(errorMessage, "error");
      setLoading(false);
    }
  }

  const labelStyle = "text-sm font-medium text-gray-900";
  const labelObsStyle = "text-gray-500 font-normal text-xs ml-1";
  const inputStyle =
    "w-full border border-gray-300 rounded px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition placeholder:text-gray-400";
  const inputDisabledStyle = "bg-gray-100 text-gray-600 cursor-not-allowed";

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <header className="flex justify-between items-center px-8 py-6 w-full">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-black" />
        </div>
        <Link
          href="/login"
          className="bg-black text-white px-8 py-2.5 rounded text-sm font-medium hover:bg-gray-800 transition shadow-sm"
        >
          Login
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start pt-10 pb-20 px-4">
        <h1 className="text-3xl font-bold mb-8 text-black tracking-tight">
          Cadastre-se
        </h1>

        <div className="bg-white p-8 rounded-lg border border-gray-200 w-full max-w-[520px] shadow-sm transition-all duration-300">
          <form onSubmit={handleSubmit(handleRegister)} className="space-y-5">
            <div className="flex gap-4">
              <div className="w-1/2 space-y-1.5">
                <label className={labelStyle}>
                  Nome <span className={labelObsStyle}>(Obrigatório)</span>
                </label>
                <input
                  {...register("name")}
                  placeholder="ex.: Jose"
                  className={inputStyle}
                />
              </div>
              <div className="w-1/2 space-y-1.5">
                <label className={labelStyle}>
                  Sobrenome <span className={labelObsStyle}>(Obrigatório)</span>
                </label>
                <input
                  {...register("surname")}
                  placeholder="ex.: Lima"
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelStyle}>
                E-mail <span className={labelObsStyle}>(Obrigatório)</span>
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="Insira seu e-mail"
                className={inputStyle}
              />
              {errors.email && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className={labelStyle}>
                Senha de acesso{" "}
                <span className={labelObsStyle}>(Obrigatório)</span>
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Insira sua senha"
                  className={`${inputStyle} pr-10`}
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

            <div className="space-y-1.5">
              <label className={labelStyle}>
                CEP <span className={labelObsStyle}>(Obrigatório)</span>
              </label>
              <input
                {...register("zip_code")}
                placeholder="Insira seu CEP"
                className={inputStyle}
                maxLength={9}
              />
              {errors.zip_code && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.zip_code.message}
                </span>
              )}
            </div>

            {showAddressFields && (
              <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-1.5">
                  <label className={labelStyle}>Endereço</label>
                  <input
                    {...register("street")}
                    readOnly
                    className={`${inputStyle} ${inputDisabledStyle}`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelStyle}>Número</label>
                  <input {...register("number")} className={inputStyle} />
                </div>

                <div className="space-y-1.5">
                  <label className={labelStyle}>Complemento</label>
                  <input {...register("complement")} className={inputStyle} />
                </div>

                <div className="space-y-1.5">
                  <label className={labelStyle}>Bairro</label>
                  <input
                    {...register("district")}
                    readOnly
                    className={`${inputStyle} ${inputDisabledStyle}`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelStyle}>Cidade</label>
                  <input
                    {...register("city")}
                    readOnly
                    className={`${inputStyle} ${inputDisabledStyle}`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelStyle}>Estado</label>
                  <input
                    {...register("state")}
                    readOnly
                    className={`${inputStyle} ${inputDisabledStyle}`}
                  />
                </div>
              </div>
            )}

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
                  Cadastrando...
                </>
              ) : (
                "Cadastrar-se"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
