"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import LayoutWrapper from "@/components/LayoutWrapper";
import { useAuthStore } from "@/store/authStore";

export default function AgendamentosPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router, isAuthenticated]);

  const agendamentos = [
    {
      id: 1,
      data: "2024-01-15",
      horario: "09:00 - 11:00",
      tipo: "RCP Básica",
      instrutor: "Dr. Carlos Silva",
      sala: "Sala A",
      status: "Confirmado",
      participantes: 8
    },
    {
      id: 2,
      data: "2024-01-15",
      horario: "11:00 - 13:00",
      tipo: "Ventilação Mecânica",
      instrutor: "Dra. Ana Costa",
      sala: "Sala B",
      status: "Confirmado",
      participantes: 6
    },
    {
      id: 3,
      data: "2024-01-15",
      horario: "14:30 - 16:30",
      tipo: "RCP Avançada",
      instrutor: "Dr. Roberto Santos",
      sala: "Sala A",
      status: "Pendente",
      participantes: 10
    },
    {
      id: 4,
      data: "2024-01-16",
      horario: "08:00 - 10:00",
      tipo: "Trauma",
      instrutor: "Dr. Paulo Oliveira",
      sala: "Sala C",
      status: "Confirmado",
      participantes: 12
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      Confirmado: "bg-green-100 text-green-800",
      Pendente: "bg-yellow-100 text-yellow-800",
      Cancelado: "bg-red-100 text-red-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  return (
    <LayoutWrapper>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Agendamentos</h1>
            <p className="text-gray-600">Gerencie as sessões de simulação do laboratório</p>
          </div>
          <Button onClick={() => router.push("/agendamentos/novo")}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros e Busca</CardTitle>
            <CardDescription>Encontre agendamentos específicos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input placeholder="Buscar por tipo, instrutor ou sala..." className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Agendamentos</CardTitle>
            <CardDescription>Próximas sessões agendadas no laboratório</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Tipo de Sessão</TableHead>
                  <TableHead>Instrutor</TableHead>
                  <TableHead>Sala</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Participantes</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agendamentos.map((agendamento) => (
                  <TableRow key={agendamento.id}>
                    <TableCell className="font-medium">{agendamento.data}</TableCell>
                    <TableCell>{agendamento.horario}</TableCell>
                    <TableCell>{agendamento.tipo}</TableCell>
                    <TableCell>{agendamento.instrutor}</TableCell>
                    <TableCell>{agendamento.sala}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(agendamento.status)}>
                        {agendamento.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{agendamento.participantes}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="outline" size="sm">Detalhes</Button>
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
