"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { EstoqueItem, Categoria } from "../types";
import { useEstoqueUtils } from "../hooks/useEstoqueUtils";

interface EstoqueTableProps {
  itens: EstoqueItem[];
  categorias: Categoria[];
  onEditItem: (item: EstoqueItem) => void;
  onDeleteItem: (id: string) => void;
  onViewItem: (item: EstoqueItem) => void;
}

export const EstoqueTable = ({
  itens,
  categorias,
  onEditItem,
  onDeleteItem,
  onViewItem
}: EstoqueTableProps) => {
  const { getStatusBadge, getStatusIcon, getStatusText } = useEstoqueUtils();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Valor Unit.</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead>Local</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itens.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <Badge className={getStatusBadge(item.status)}>
                    {getStatusText(item.status)}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="font-medium">{item.codigo}</TableCell>
              <TableCell>{item.nome}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-gray-50">
                  {categorias.find(cat => cat.id === item.categoria)?.nome || item.categoria}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className={item.quantidade <= item.quantidadeMinima ? "text-yellow-600" : ""}>
                    {item.quantidade}
                  </span>
                  <span className="text-xs text-gray-500">
                    {item.unidade}
                  </span>
                  {item.quantidade <= item.quantidadeMinima && (
                    <span className="text-xs text-yellow-600">(min: {item.quantidadeMinima})</span>
                  )}
                </div>
              </TableCell>
              <TableCell>R$ {item.valorUnitario.toFixed(2)}</TableCell>
              <TableCell className="font-medium">R$ {item.valorTotal.toFixed(2)}</TableCell>
              <TableCell className="max-w-xs truncate" title={item.local}>
                {item.local}
              </TableCell<dyad-problem-report summary="37 problems">
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="32" column="29" code="1005">'&gt;' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="32" column="38" code="1005">';' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="32" column="65" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="32" column="66" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="34" column="31" code="1005">'&gt;' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="34" column="40" code="1005">';' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="34" column="68" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="34" column="69" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="36" column="31" code="1005">'&gt;' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="36" column="40" code="1005">';' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="36" column="68" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="36" column="69" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="38" column="31" code="1005">'&gt;' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="38" column="40" code="1005">';' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="38" column="65" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="38" column="66" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab.tsx" line="8" column="30" code="2307">Cannot find module './components/EstoqueStats' or its corresponding type declarations.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab.tsx" line="9" column="32" code="2307">Cannot find module './components/EstoqueFilters' or its corresponding type declarations.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab.tsx" line="10" column="30" code="2307">Cannot find module './components/EstoqueTable' or its corresponding type declarations.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab.tsx" line="11" column="28" code="2307">Cannot find module './components/ItemDialog' or its corresponding type declarations.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab.tsx" line="12" column="30" code="2307">Cannot find module './components/ImportDialog' or its corresponding type declarations.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab.tsx" line="13" column="32" code="2307">Cannot find module './hooks/useEstoqueData' or its corresponding type declarations.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab.tsx" line="14" column="33" code="2307">Cannot find module './hooks/useEstoqueUtils' or its corresponding type declarations.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab.tsx" line="15" column="29" code="2307">Cannot find module './types' or its corresponding type declarations.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="530" column="112" code="2345">Argument of type '(prev: Curso) =&gt; { duracaoUnidade: string; id: string; nome: string; descricao: string; categoria: string; modalidade: &quot;presencial&quot; | &quot;online&quot; | &quot;híbrido&quot;; duracao: number; cargaHoraria: number; ... 9 more ...; totalAvaliacoes: number; }' is not assignable to parameter of type 'SetStateAction&lt;Curso&gt;'.
  Type '(prev: Curso) =&gt; { duracaoUnidade: string; id: string; nome: string; descricao: string; categoria: string; modalidade: &quot;presencial&quot; | &quot;online&quot; | &quot;híbrido&quot;; duracao: number; cargaHoraria: number; ... 9 more ...; totalAvaliacoes: number; }' is not assignable to type '(prevState: Curso) =&gt; Curso'.
    Call signature return types '{ duracaoUnidade: string; id: string; nome: string; descricao: string; categoria: string; modalidade: &quot;presencial&quot; | &quot;online&quot; | &quot;híbrido&quot;; duracao: number; cargaHoraria: number; vagas: number; ... 8 more ...; totalAvaliacoes: number; }' and 'Curso' are incompatible.
      The types of 'duracaoUnidade' are incompatible between these types.
        Type 'string' is not assignable to type '&quot;meses&quot; | &quot;anos&quot; | &quot;semanas&quot; | &quot;dias&quot; | &quot;horas&quot;'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="32" column="17" code="2749">'CheckCircle' refers to a value, but is being used as a type here. Did you mean 'typeof CheckCircle'?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="32" column="29" code="2304">Cannot find name 'className'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="32" column="39" code="2362">The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="34" column="17" code="2749">'AlertTriangle' refers to a value, but is being used as a type here. Did you mean 'typeof AlertTriangle'?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="34" column="31" code="2304">Cannot find name 'className'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="34" column="41" code="2362">The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="36" column="17" code="2749">'AlertTriangle' refers to a value, but is being used as a type here. Did you mean 'typeof AlertTriangle'?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="36" column="31" code="2304">Cannot find name 'className'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="36" column="41" code="2362">The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="38" column="17" code="2749">'AlertTriangle' refers to a value, but is being used as a type here. Did you mean 'typeof AlertTriangle'?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="38" column="31" code="2304">Cannot find name 'className'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="38" column="41" code="2362">The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
</dyad-problem-report>
<think></think>
I'll fix all these TypeScript errors:

<dyad-write path="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.tsx" description="Fixed utils hook with proper JSX handling">
import { EstoqueItem } from "../types";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { ReactElement } from "react";

export const useEstoqueUtils = () => {
  const calcularStatus = (item: EstoqueItem): EstoqueItem["status"] => {
    if (item.dataValidade) {
      const dataValidade = new Date(item.dataValidade);
      const hoje = new Date();
      const diasParaVencer = Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diasParaVencer < 0) return "vencido";
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

  const getStatusIcon = (status: string): ReactElement => {
    switch (status) {
      case "disponivel":
        return <CheckCircle key="disponivel" className="h-4 w-4 text-green-600" />;
      case "baixo":
        return <AlertTriangle key="baixo" className="h-4 w-4 text-yellow-600" />;
      case "vencendo":
        return <AlertTriangle key="vencendo" className="h-4 w-4 text-orange-600" />;
      case "vencido":
        return <AlertTriangle key="vencido" className="h-4 w-4 text-red-600" />;
      default:
        return <CheckCircle key="default" className="h-4 w-4 text-gray-600" />;
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