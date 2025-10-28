"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, DollarSign, TrendingUp, AlertTriangle, Package } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface CostCenterItem {
  id: string;
  nome: string;
  categoria: string;
  localizacao: string;
  status: "ativo" | "baixo" | "critico" | "inativo";
  custoMensal: number;
  custoAnual: number;
  itens: number;
  ultimaAtualizacao: string;
}

const CentroDeCustos = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [items, setItems] = useState<CostCenterItem[]>([]);

  const categories = [
    "Equipamentos Médicos",
    "Medicamentos",
    "Material de Consumo",
    "Simuladores",
    "Manutenção",
    "Outros"
  ];

  const statusColors = {
    ativo: "bg-green-100 text-green-800",
    baixo: "bg-yellow-100 text-yellow-800",
    critico: "bg-red-100 text-red-800",
    inativo: "bg-gray-100 text-gray-800"
  };

  const statusIcons = {
    ativo: <TrendingUp className="h-4 w-4" />,
    baixo: <AlertTriangle className="h-4 w-4" />,
    critico: <AlertTriangle className="h-4 w-4" />,
    inativo: <Package className="h-4 w-4" />
  };

  useEffect(() => {
    const mockData: CostCenterItem[] = [
      {
        id: "1",
        nome: "Manequim de RCP Adulto",
        categoria: "Equipamentos Médicos",
        localizacao: "Sala de Emergência",
        status: "ativo",
        custoMensal: 1500,
        custoAnual: 18000,
        itens: 5,
        ultimaAtualizacao: "2024-01-15"
      },
      {
        id: "2",
        nome: "Desfibrilador",
        categoria: "Equipamentos Médicos",
        localizacao: "Sala de Emergência",
        status: "ativo",
        custoMensal: 800,
        custoAnual: 9600,
        itens: 3,
        ultimaAtualizacao: "2024-01-14"
      },
      {
        id: "3",
        nome: "Adrenalina",
        categoria: "Medicamentos",
        localizacao: "Almoxarifado",
        status: "baixo",
        custoMensal: 500,
        custoAnual: 6000,
        itens: 50,
        ultimaAtualizacao: "2024-01-10"
      }
    ];
    setItems(mockData);
  }, []);

  const totalMonthlyCost = items.reduce((sum, item) => sum + item.custoMensal, 0);
  const totalAnnualCost = items.reduce((sum, item) => sum + item.custoAnual, 0);
  const totalItems = items.reduce((sum, item) => sum + item.itens, 0);

  const getStatusBadge = (status: string) => {
    return (
      <Badge className={statusColors[status as keyof typeof statusColors]}>
        {statusIcons[status as keyof typeof statusIcons]}
        <span className="ml-1">{status}</span>
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Centro de Custos</h1>
          <p className="text-muted-foreground">Gerencie e visualize os custos operacionais do centro de simulação</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Item
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="items">Itens</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Custo Mensal</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {totalMonthlyCost.toLocaleString('pt-BR')}</div>
                <p className="text-xs text-muted-foreground">Total mensal</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Custo Anual</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {totalAnnualCost.toLocaleString('pt-BR')}</div>
                <p className="text-xs text-muted-foreground">Total anual</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalItems}</div>
                <p className="text-xs text-muted-foreground">Itens cadastrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Itens Críticos</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{items.filter(item => item.status === "critico").length}</div>
                <p className="text-xs text-red-600">Precisam atenção imediatamente</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Itens Baixos</CardTitle>
              <TrendingDown className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{items.filter(item => item.status === "baixo").length}</div>
              <p className="text-xs text-yellow-600">Precisam atenção imediatamente</p>
              </CardContent>
            </Card>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise por Categoria</CardTitle>
              <CardDescription>Visualize os custos detalhados por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category) => {
                  const categoryItems = items.filter(item => item.categoria === category);
                  const categoryCost = categoryItems.reduce((sum, item) => sum + item.custoMensal, 0);
                  const categoryItemsCount = categoryItems.reduce((sum, item) => sum + item.itens, 0);

                  return (
                    <div key={category} className="flex items-center justify-between space-y-2">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm text-muted-foreground">
                        R$ {categoryCost.toLocaleString('pt-BR')}/mês
                      </span>
                    </div>
                    </div>
                  );
                })}
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Custos</CardTitle>
              <CardDescription>Gere relatórios detalhados dos custos operacionais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Relatório Mensal
                </Button>
                <Button className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Relatório Anual
                </Button>
                <Button className="w-full justify-start">
                  Relatório por Categoria
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CentroDeCustos;