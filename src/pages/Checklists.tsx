"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, CheckSquare, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const Checklists = () => {
  const navigate = useNavigate();

  const checklists = [
    {
      id: 1,
      titulo: "Checklist de Debriefing - RCP Básica",
      tipo: "Debriefing",
      autor: "Dra. Mariana Silva",
      dataCriacao: "2024-01-10",
      cenariosAssociados: 3,
      itens: 12
    },
    {
      id: 2,
      titulo: "Checklist de Materiais - Sala A",
      tipo: "Materiais",
      autor: "Dr. Roberto Costa",
      dataCriacao: "2024-01-08",
      cenariosAssociados: 5,
      itens: 25
    },
    {
      id: 3,
      titulo: "Checklist de Debriefing - Trauma",
      tipo: "Debriefing",
      autor: "Dr. Paulo Oliveira",
      dataCriacao: "2024-01-05",
      cenariosAssociados: 2,
      itens: 15
    },
    {
      id: 4,
      titulo: "Checklist de Materiais - Sala B",
      tipo: "Materiais",
      autor: "Dra. Ana Costa",
      dataCriacao: "2024-01-03",
      cenariosAssociados: 4,
      itens: 18
    }
  ];

  const getTipoBadge = (tipo: string) => {
    const variants = {
      "Debriefing": "bg-blue-100 text-blue-800",
      "Materiais": "bg-green-100 text-green-800"
    };
    return variants[tipo as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Checklists</h1>
          <p className="text-gray-600">Checklists de debriefing e materiais para simulações</p>
        </div>
        <Button onClick={() => navigate("/checklists/novo")}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Checklist
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Checklists</CardTitle>
            <CheckSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-gray-500">+2 este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checklists Debriefing</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-gray-500">Para diferentes cenários</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checklists Materiais</CardTitle>
            <CheckSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-gray-500">Por sala e especialidade</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Checklists</CardTitle>
          <CardDescription>Checklists disponíveis para uso nas simulações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input placeholder="Buscar checklists..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Cenários</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checklists.map((checklist) => (
                <TableRow key={checklist.id}>
                  <TableCell className="font-medium">{checklist.titulo}</TableCell>
                  <TableCell>
                    <Badge className={getTipoBadge(checklist.tipo)}>
                      {checklist.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>{checklist.autor}</TableCell>
                  <TableCell>{checklist.dataCriacao}</TableCell>
                  <TableCell>{checklist.cenariosAssociados}</TableCell>
                  <TableCell>{checklist.itens}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Visualizar</Button>
                      <Button variant="outline" size="sm">Editar</Button>
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

export default Checklists;