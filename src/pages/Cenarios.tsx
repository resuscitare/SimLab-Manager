"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, FileText, Sparkles, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface Cenario {
  id: number;
  nome: string;
  autor: string;
  dataCriacao: string;
  status: "Publicado" | "Rascunho";
  publicoAlvo: string;
  palavrasChave: string[];
  usouIA: boolean;
  tipo: "Prisma" | "Tradicional";
}

const Cenarios = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "Prisma" | "Tradicional">("todos");

  const cenarios: Cenario[] = [
    {
      id: 1,
      nome: "Parada Cardiorrespiratória em AESP",
      autor: "Dra. Mariana Silva",
      dataCriacao: "2024-01-10",
      status: "Publicado",
      publicoAlvo: "Residentes de Medicina",
      palavrasChave: ["RCP", "Emergência", "Cardiologia"],
      usouIA: true,
      tipo: "Prisma"
    },
    {
      id: 2,
      nome: "Infarto Agudo do Miocárdio",
      autor: "Dr. Roberto Costa",
      dataCriacao: "2024-01-08",
      status: "Publicado",
      publicoAlvo: "Enfermeiros",
      palavrasChave: ["IAM", "Cardiologia", "ECG"],
      usouIA: true,
      tipo: "Tradicional"
    },
    {
      id: 3,
      nome: "Sepse em Paciente Pediátrico",
      autor: "Dra. Mariana Silva",
      dataCriacao: "2024-01-05",
      status: "Rascunho",
      publicoAlvo: "Pediatras",
      palavrasChave: ["Sepse", "Pediatria", "Antibioticoterapia"],
      usouIA: false,
      tipo: "Prisma"
    },
    {
      id: 4,
      nome: "Trauma Múltiplo - Acidente Automobilístico",
      autor: "Dr. Paulo Oliveira",
      dataCriacao: "2024-01-03",
      status: "Publicado",
      publicoAlvo: "Médicos Emergencistas",
      palavrasChave: ["Trauma", "Emergência", "ATLS"],
      usouIA: true,
      tipo: "Tradicional"
    },
    {
      id: 5,
      nome: "PCR Avançada com Suporte Avançado de Vida",
      autor: "Dr. Carlos Silva",
      dataCriacao: "2024-01-02",
      status: "Publicado",
      publicoAlvo: "Médicos Intensivistas",
      palavrasChave: ["PCR", "SAV", "Intensiva"],
      usouIA: true,
      tipo: "Prisma"
    },
    {
      id: 6,
      nome: "Desfibrilação e RCP Básica",
      autor: "Dra. Ana Costa",
      dataCriacao: "2024-01-01",
      status: "Publicado",
      publicoAlvo: "Equipe Multiprofissional",
      palavrasChave: ["DEA", "RCP", "Equipe"],
      usouIA: true,
      tipo: "Prisma"
    }
  ];

  // Filtrar cenários com base no termo de busca
  const cenariosFiltrados = cenarios.filter(cenario => {
    const matchesSearch = searchTerm === "" || 
      scenario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.palavrasChave.some(palavra => palavra.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTipo = filtroTipo === "todos" || scenario.tipo === filtroTipo;
    
    return matchesSearch && matchesTipo;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      "Publicado": "bg-green-100 text-green-800",
      "Rascunho": "bg-yellow-100 text-yellow-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getTipoBadge = (tipo: string) => {
    const variants = {
      "Prisma": "bg-blue-100 text-blue-800",
      "Tradicional": "bg-purple-100 text-purple-800"
    };
    return variants[tipo as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const handleVisualizar = (id: number) => {
    navigate(`/cenarios/${id}`);
  };

  const handleEditar = (id: number) => {
    navigate(`/cenarios/${id}/editar`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Cenários</h1>
          <p className="text-gray-600">Crie e gerencie cenários de simulação realística</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate("/ia")}>
            <Sparkles className="w-4 h-4 mr-2" />
            Assistente IA
          </Button>
          <Button onClick={() => navigate("/cenarios/novo-prisma")}>
            <Database className="w-4 h-4 mr-2" />
            Novo Cenário Prisma
          </Button>
          <Button onClick={() => navigate("/cenarios/novo")}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Cenário
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cenários</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-gray-500">+3 este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cenários Publicados</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-gray-500">6 em rascunho</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uso de IA</CardTitle>
            <Sparkles className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-gray-500">Dos cenários usam IA</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cenários Prisma</CardTitle>
            <Database className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-gray-500">Com schema completo</p>
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
                <TableHead>Tipo</TableHead>
                <TableHead>IA</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cenariosFiltrados.map((cenario) => (
                <TableRow key={scenario.id}>
                  <TableCell className="font-medium">{scenario.nome}</TableCell>
                  <TableCell>{scenario.autor}</TableCell>
                  <TableCell>{scenario.dataCriacao}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(scenario.status)}>
                      {scenario.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTipoBadge(scenario.tipo)}>
                      {scenario.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {scenario.usouIA && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        ✨ IA
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleVisualizar(scenario.id)}>
                        Visualizar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditar(scenario.id)}>
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
  );
};

export default Cenarios;