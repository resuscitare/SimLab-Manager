"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

// Import das abas do Centro de Custos
import EstoqueTab from "./tabs/EstoqueTab";
import CursosTab from "./tabs/CursosTab";
import RelatoriosTab from "./tabs/RelatoriosTab";
import ConfiguracoesTab from "./tabs/ConfiguracoesTab";

const Gestao = () => {
  const [activeTab, setActiveTab] = useState("estoque");

  // Dados mock para o dashboard
  const dashboardData = {
    estoque: {
      valorTotal: 125000,
      itensAtivos: 2847,
      alertas: 3,
      movimentacoesMes: 156,
      tendencia: "up"
    },
    cursos: {
      receitaTotal: 45000,
      custosTotais: 38000,
      margem: 7000,
      cursosAtivos: 12,
      tendencia: "up"
    },
    financeiro: {
      desvioOrcamento: 8.5,
      economiaPotencial: 15000,
      status: "positivo"
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Centro de Custos</h1>
          <p className="text-gray-600">Gestão financeira e controle de estoque do laboratório</p>
        </div>
        <Button>
          <BarChart3 className="h-4 w-4 mr-2" />
          Gerar Relatório Completo
        </Button>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 125.000</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              {dashboardData.estoque.tendencia}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Cursos em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margem Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 7.000</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              {dashboardData.cursos.tendencia}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.estoque.alertas}</div>
            <p className="text-xs text-muted-foreground">Itens críticos</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Movimentação do Estoque</CardTitle>
            <CardDescription>Entradas vs Saídas nos últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              <p className="text-sm">Gráfico de movimentação</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Itens por Valor</CardTitle>
            <CardDescription>Itens com maior valor em estoque</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Simulador Adulto</span>
                <span className="text-sm font-medium">R$ 45.000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Monitor Multiparâmetros</span>
                <span className="text-sm font-medium">R$ 32.000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Kit de Intubação</span>
                <span className="text-sm font-medium">R$ 28.000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Desfibrilador</span>
                <span className="text-sm font-medium">R$ 20.000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navegação por Abas */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="estoque">Estoque</TabsTrigger>
              <TabsTrigger value="cursos">Cursos</TabsTrigger>
              <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
              <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <TabsContent value="estoque" className="mt-6">
            <EstoqueTab />
          </TabsContent>
          
          <TabsContent value="cursos" className="mt-6">
            <CursosTab />
          </TabsContent>
          
          <TabsContent value="relatorios" className="mt-6">
            <RelatoriosTab />
          </TabsContent>
          
          <TabsContent value="configuracoes" className="mt-6">
            <ConfiguracoesTab />
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default Gestao;