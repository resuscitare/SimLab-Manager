"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, FileText, Sparkles, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import LayoutWrapper from "@/components/LayoutWrapper";
import { useAuthStore } from "@/store/authStore";

interface Cenario {
  id: number;
  nome: string;
  autor: string;
  dataCriacao: string;
  status: "Publicado" | "Rascunho";
  publicoAlvo: string;
  palavrasChave: string[];
  usouIA: boolean;
}

export default function CenariosPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router, isAuthenticated]);

  const cenarios: Cenario[] = [
    {
      id: 1,
      nome: "Parada Cardiorrespiratória em AESP",
      autor: "Dra. Mariana Silva",
      dataCriacao: "10/01/2024",
      status: "Publicado",
      publicoAlvo: "Residentes de Medicina",
      palavrasChave: ["RCP", "Emergência", "Cardiologia"],
      usouIA: true,
    },
    {
      id: 2,
      nome: "Infarto Agudo do Miocárdio",
      autor: "Dr. Roberto Costa",
      dataCriacao: "08/01/2024",
      status: "Publicado",
      publicoAlvo: "Enfermeiros",
      palavrasChave: ["IAM", "Cardiologia", "ECG"],
      usouIA: true,
    },
    {
      id: 3,
      nome: "Sepse em Paciente Pediátrico",
      autor: "Dra. Mariana Silva",
      dataCriacao: "05/01/2024",
      status: "Rascunho",
      publicoAlvo: "Pediatras",
      palavrasChave: ["Sepse", "Pediatria", "Antibioticoterapia"],
      usouIA: false,
    },
    {
      id: 4,
      nome: "Trauma Múltiplo - Acidente Automobilístico",
      autor: "Dr. Paulo Oliveira",
      dataCriacao: "03/01/2024",
      status: "Publicado",
      publicoAlvo: "Médicos Emergencistas",
      palavrasChave: ["Trauma", "Emergência", "ATLS"],
      usouIA: true,
    }
  ];

  const cenariosFiltrados = cenarios.filter(cenario => {
    return searchTerm === "" ||
      cenario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cenario.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cenario.palavrasChave.some(palavra => palavra.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      "Publicado": "bg-green-100 text-green-800",
      "Rascunho": "bg-yellow-100 text-yellow-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const handleVisualizar = (id: number) => {
    router.push(`/cenarios/${id}`);
  };

  const handleEditar = (id: number) => {
    router.push(`/cenarios/${id}/editar`);
  };

  return (
    <LayoutWrapper>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Cenários</h1>
            <p className="text-gray-600">Crie e gerencie cenários de simulação realística</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => router.push("/ia")}>
              <Sparkles className="w-4 h-4 mr-2" />
              Assistente IA
            </Button>
            <Button onClick={() => router.push("/cenarios/novo")}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Cenário
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Cenários</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cenarios.length}</div>
              <p className="text-xs text-gray-500">+2 este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cenários Publicados</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cenarios.filter(c => c.status === 'Publicado').length}</div>
              <p className="text-xs text-gray-500">{cenarios.filter(c => c.status === 'Rascunho').length} em rascunho</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uso de IA</CardTitle>
              <Sparkles className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round((cenarios.filter(c => c.usouIA).length / cenarios.length) * 100)}%</div>
              <p className="text-xs text-gray-500">Dos cenários usam IA</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Cenários</CardTitle>
            <CardDescription>Cenários de simulação criados no laboratório</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por nome, palavras-chave ou autor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrar
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Cenário</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IA</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cenariosFiltrados.map((cenario) => (
                  <TableRow key={cenario.id}>
                    <TableCell className="font-medium">{cenario.nome}</TableCell>
                    <TableCell>{cenario.autor}</TableCell>
                    <TableCell>{cenario.dataCriacao}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(cenario.status)}>
                        {cenario.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {cenario.usouIA && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          ✨ IA
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleVisualizar(cenario.id)}>
                          Visualizar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditar(cenario.id)}>
                          Editar
                        </Button>
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
