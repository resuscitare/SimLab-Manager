"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Wrench, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import LayoutWrapper from "@/components/LayoutWrapper";
import { useAuthStore } from "@/store/authStore";

export default function EquipamentosPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router, isAuthenticated]);

  const equipamentos = [
    {
      id: 1,
      nome: "Simulador Adulto High-Fidelity",
      tipo: "Simulador",
      sala: "Sala A",
      status: "Disponível",
      ultimaManutencao: "2024-01-10",
      proximaManutencao: "2024-04-10"
    },
    {
      id: 2,
      nome: "Simulador Pediátrico",
      tipo: "Simulador",
      sala: "Sala B",
      status: "Em Uso",
      ultimaManutencao: "2024-01-05",
      proximaManutencao: "2024-04-05"
    },
    {
      id: 3,
      nome: "Desfibrilador AED",
      tipo: "Equipamento",
      sala: "Central",
      status: "Manutenção",
      ultimaManutencao: "2023-12-15",
      proximaManutencao: "2024-03-15"
    },
    {
      id: 4,
      nome: "Ventilador Mecânico",
      tipo: "Equipamento",
      sala: "Sala C",
      status: "Disponível",
      ultimaManutencao: "2024-01-08",
      proximaManutencao: "2024-04-08"
    },
    {
      id: 5,
      nome: "Monitor Multiparâmetros",
      tipo: "Equipamento",
      sala: "Sala A",
      status: "Disponível",
      ultimaManutencao: "2024-01-12",
      proximaManutencao: "2024-04-12"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      "Disponível": "bg-green-100 text-green-800",
      "Em Uso": "bg-yellow-100 text-yellow-800",
      "Manutenção": "bg-red-100 text-red-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      "Disponível": <CheckCircle className="h-4 w-4 text-green-600" />,
      "Em Uso": <Wrench className="h-4 w-4 text-yellow-600" />,
      "Manutenção": <XCircle className="h-4 w-4 text-red-600" />
    };
    return icons[status as keyof typeof icons];
  };

  return (
    <LayoutWrapper>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Equipamentos</h1>
            <p className="text-gray-600">Controle dos simuladores e equipamentos do laboratório</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Equipamento
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Equipamentos</CardTitle>
              <Wrench className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-gray-500">+2 este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Manutenção</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-gray-500">2 programadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-500">8 em uso no momento</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Equipamentos</CardTitle>
            <CardDescription>Inventário completo do laboratório</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input placeholder="Buscar equipamentos..." className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipamento</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Sala</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Manutenção</TableHead>
                  <TableHead>Próxima Manutenção</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipamentos.map((equipamento) => (
                  <TableRow key={equipamento.id}>
                    <TableCell className="font-medium">{equipamento.nome}</TableCell>
                    <TableCell>{equipamento.tipo}</TableCell>
                    <TableCell>{equipamento.sala}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(equipamento.status)}
                        <Badge className={getStatusBadge(equipamento.status)}>
                          {equipamento.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{equipamento.ultimaManutencao}</TableCell>
                    <TableCell>{equipamento.proximaManutencao}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="outline" size="sm">Histórico</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </LayoutWrapper>
  );
}
