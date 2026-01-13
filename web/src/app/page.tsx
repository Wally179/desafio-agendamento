import { User } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-black p-3 rounded-full text-white">
            <User size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-black">
          Ambiente Configurado!
        </h1>
        <p className="text-gray-600">Frontend pronto para receber as telas.</p>
        <button className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">
          Começar
        </button>
      </div>
    </div>
  );
}
