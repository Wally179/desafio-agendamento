import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-64 gap-3 animate-in fade-in duration-300">
      <Loader2 className="w-10 h-10 text-black animate-spin" />
      <span className="text-sm text-gray-500 font-medium">
        Carregando dados...
      </span>
    </div>
  );
}
