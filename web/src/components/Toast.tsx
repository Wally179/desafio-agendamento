import { useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Fecha automaticamente após 4s

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-right-10 duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
          type === "success"
            ? "bg-white border-teal-100 text-teal-800"
            : "bg-white border-red-100 text-red-800"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="w-5 h-5 text-teal-500" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-500" />
        )}
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
