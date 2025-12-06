"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, Filter, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import LayoutWrapper from "@/components/LayoutWrapper";
import { useAuthStore } from "@/store/authStore";

export default function InstrutoresPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router, isAuthenticated]);

  const instrutores = [
    {
      id: 1,
      nome: "Dr. Carlos Silva",
      email: "carlos.silva@resuscitare.com",
      telefone: "(11) 99999-9999",
      especialidades: ["RCP", "Trauma"],
      status: "Ativo",
      agendamentos: 12
    },
    {
      id: 2,
      nome: "Dra. Ana Costa",
      email: "ana.costa@resuscitare.com",
      telefone: "(11) 98888-8888",
      especialidades: ["Ventilação", "Pediatria"],
      status: "Ativo",
      agendamentos: 8
    },
    {
      id: 3,
      nome: "Dr. Roberto Santos",
      email: "roberto.santos@resuscitare.com",
      telefone: "(11) 97777-7777",
      especialidades: ["RCP Avançada", "Cardiologia"],
      status: "Férias",
      agendamentos: 0
    },
    {
      id: 4,
      nome: "Dr. Paulo Oliveira",
      email: "paulo.oliveira@resuscitare.com",
      telefone: "(11) 96666-6666",
      especialidades: ["Trauma", "Emergências"],
      status: "Ativo",
      agendamentos: 6
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      "Ativo": "bg-green-100 text-green-800",
      "Férias": "bg-yellow-100 text-yellow-800",
      "Inativo": "bg-red-100 text-red-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <LayoutWrapper>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Instrutores</h1>
            <p className="text-gray-600">Cadastro e controle dos instrutores do laboratório</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Instrutor
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Instrutores</CardTitle>
              <span className="text-2xl">👨‍⚕️</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-gray-500">+1 este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Instrutores Ativos</CardTitle>
              <span className="text-2xl">✅</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-gray-500">2 em férias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos/Mês</CardTitle>
              <span className="text-2xl">📅</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-gray-500">Média por instrutor: 7</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Instrutores</CardTitle>
            <CardDescription>Equipe de instrutores do laboratório</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input placeholder="Buscar instrutores..." className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instrutor</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Especialidades</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Agendamentos</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instrutores.map((instrutor) => (
                  <TableRow key={instrutor.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={`/avatars/${instrutor.id}.jpg`} />
                          <AvatarFallback>{getInitials(instrutor.nome)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{instrutor.nome}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {instrutor.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-3 w-3 mr-1" />
                          {instrutor.telefone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {instrutor.especialidades.map((especialidade, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {especialidade}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(instrutor.status)}>
                        {instrutor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-center font-medium">{instrutor.agendamentos}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="outline" size="sm">Agenda</Button>
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
