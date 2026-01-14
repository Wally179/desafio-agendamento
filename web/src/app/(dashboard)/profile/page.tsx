"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import api from "@/services/api";
import axios from "axios";
import Cookies from "js-cookie";

// Schema de validação (Senha é opcional na edição)
const profileSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  surname: z.string().min(1, { message: "Sobrenome é obrigatório" }),
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().optional(), // Senha opcional
  zip_code: z.string().min(8, { message: "CEP inválido" }),
  street: z.string().min(1, { message: "Endereço é obrigatório" }),
  number: z.string().min(1, { message: "Número é obrigatório" }),
  complement: z.string().optional(),
  district: z.string().min(1, { message: "Bairro é obrigatório" }),
  city: z.string().min(1, { message: "Cidade é obrigatória" }),
  state: z.string().min(1, { message: "Estado é obrigatório" }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset, // Usado para preencher o formulário com dados do banco
    formState: { errors, isDirty }, // isDirty diz se o usuário mudou algo
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // 1. Carregar dados do usuário ao abrir a tela
  useEffect(() => {
    async function loadProfile() {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        const user = JSON.parse(userCookie);
        setUserId(user.id);

        try {
          // Busca dados atualizados do backend
          const response = await api.get(`/users/${user.id}`);
          const userData = response.data;

          // Preenche o formulário
          reset({
            name: userData.name,
            surname: userData.surname,
            email: userData.email,
            zip_code: userData.zip_code,
            street: userData.street,
            number: userData.number,
            complement: userData.complement,
            district: userData.district,
            city: userData.city,
            state: userData.state,
            password: "", // Senha vem vazia por segurança
          });
        } catch (error) {
          console.error("Erro ao carregar perfil", error);
        }
      }
    }
    loadProfile();
  }, [reset]);

  // 2. Busca de CEP (Igual ao cadastro)
  async function handleBlurCep(e: React.FocusEvent<HTMLInputElement>) {
    const cep = e.target.value.replace(/\D/g, "");
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
        }
      } catch (error) {
        console.error("Erro no CEP", error);
      }
    }
  }

  // 3. Salvar Alterações
  async function handleUpdate(data: ProfileFormData) {
    if (!userId) return;

    try {
      setLoading(true);

      const response = await api.put(`/users/${userId}`, data);

      // Atualiza o cookie com o nome novo (para a Sidebar atualizar se der F5)
      const updatedUser = response.data;
      Cookies.set("user", JSON.stringify(updatedUser), { expires: 7 });

      alert("Perfil atualizado com sucesso!");
      // A senha a gente limpa do form depois de salvar
      setValue("password", "");
    } catch (error) {
      alert("Erro ao atualizar perfil.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    // ADICIONADO: 'max-w-xl mx-auto' para centralizar tudo na tela
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full">
        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Nome{" "}
                <span className="text-gray-400 font-normal">(Obrigatório)</span>
              </label>
              <input
                {...register("name")}
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
                <span className="text-gray-400 font-normal">(Obrigatório)</span>
              </label>
              <input
                {...register("surname")}
                className="w-full border border-gray-200 rounded p-3 text-sm outline-none focus:border-black transition"
              />
              {errors.surname && (
                <span className="text-xs text-red-500">
                  {errors.surname.message}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              E-mail{" "}
              <span className="text-gray-400 font-normal">(Obrigatório)</span>
            </label>
            <input
              {...register("email")}
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
              <span className="text-gray-400 font-normal">(Opcional)</span>
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="************"
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
            <p className="text-xs text-gray-400">
              Preencha apenas se quiser alterar sua senha atual.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              CEP{" "}
              <span className="text-gray-400 font-normal">(Obrigatório)</span>
            </label>
            <input
              {...register("zip_code")}
              onBlur={handleBlurCep}
              className="w-full border border-gray-200 rounded p-3 text-sm outline-none focus:border-black transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Endereço
            </label>
            <input
              {...register("street")}
              readOnly
              className="w-full border border-gray-200 bg-gray-100 rounded p-3 text-sm text-gray-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Número</label>
            <input
              {...register("number")}
              className="w-full border border-gray-200 rounded p-3 text-sm outline-none focus:border-black transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Complemento
            </label>
            <input
              {...register("complement")}
              className="w-full border border-gray-200 rounded p-3 text-sm outline-none focus:border-black transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Bairro</label>
            <input
              {...register("district")}
              readOnly
              className="w-full border border-gray-200 bg-gray-100 rounded p-3 text-sm text-gray-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Cidade
              </label>
              <input
                {...register("city")}
                readOnly
                className="w-full border border-gray-200 bg-gray-100 rounded p-3 text-sm text-gray-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Estado
              </label>
              <input
                {...register("state")}
                readOnly
                className="w-full border border-gray-200 bg-gray-100 rounded p-3 text-sm text-gray-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition mt-4"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </div>
    </div>
  );
}
