import { ReactElement } from "react";
import { EstoqueItem } from "../types";
import { CheckCircle, AlertTriangle } from "lucide-react";

export const useEstoqueUtils = () => {
  const calcularStatus = (item: EstoqueItem): EstoqueItem["status"] => {
    if (item.dataValidade) {
      const dataValidade = new Date(item.dataValidade);
      const hoje = new Date();
      // Add 1 day to today to correctly handle "vencendo hoje"
      const diasParaVencer = Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      if (diasParaVencer <= 0) return "vencido";
      if (diasParaVencer <= 30) return "vencendo";
    }
    
    if (item.quantidade <= item.quantidadeMinima) return "baixo";
    return "disponivel";
  };

  const getStatusBadge = (status: string): string => {
    const variants = {
      disponivel: "bg-green-100 text-green-800 border-green-200",
      baixo: "bg-yellow-100 text-yellow-800 border-yellow-200",
      vencendo: "bg-orange-100 text-orange-800 border-orange-200",
      vencido: "bg-red-100 text-red-800 border-red-200"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string): ReactElement | null => {
    switch (status) {
      case "disponivel":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "baixo":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "vencendo":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "vencido":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string): string => {
    const textos = {
      disponivel: "Disponível",
      baixo: "Estoque Baixo",
      vencendo: "Vencendo",
      vencido: "Vencido"
    };
    return textos[status as keyof typeof textos] || status;
  };

  return {
    calcularStatus,
    getStatusBadge,
    getStatusIcon,
    getStatusText
  };
};