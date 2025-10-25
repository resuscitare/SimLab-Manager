"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, CheckSquare, FileText, Edit, Trash2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface Checklist {
  id: string;
  titulo: string;
  tipo: "debriefing" | "materiais";
  autor: string;
  dataCriacao: string;
  cenariosAssociados: number;
  itens: number;
  secoes: Array<{
    titulo: string;
    itens: Array<{
      nome: string;
      quantidade?: string;
    }>;
  }>;
}

const Checklists = () => {
  const navigate = useNavigate();
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "debriefing" | "materiais">("todos");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    // Carregar checklists do localStorage (mock)
    try {
      const checklistsSalvos = JSON.parse(localStorage.getItem('checklists') || '[]');
      
      // Adicionar dados mock para demonstração
      const mockChecklists: Checklist[] = [
        {
          id: "1",
          titulo: "Checklist de Debriefing - RCP Básica",
          tipo: "debriefing",
          autor: "Dra. Mariana Silva",
          dataCriacao: "2024-01-10",
          cenariosAssociados: 3,
          itens: 12,
          secoes: [
            {
              titulo: "Aspectos Técnicos",
              itens: [
                { nome: "Verificação de vias aéreas" },
                { nome: "Compressões torácicas" },
                { nome: "Uso do DEA" }
              ]
            },
            {
              titulo: "Aspectos Não Técnicos",
              itens: [
                { nome: "Comunicação em equipe" },
                { nome: "Liderança" }
              ]
            }
          ]
        },
        {
          id: "2",
          titulo: "Checklist de Materiais - Sala A",
          tipo: "materiais",
          autor: "Dr. Roberto Costa",
          dataCriacao: "2024-01-08",
          cenariosAssociados: 5,
          itens: 25,
          secoes: [
            {
              titulo: "Equipamentos",
              itens: [
                { nome: "Simulador adulto", quantidade: "1" },
                { nome: "Desfibrilador", quantidade: "1" },
                { nome: "Monitor multiparâmetros", quantidade: "1" }
              ]
            },
            {
              titulo: "Medicamentos",
              itens: [
                { nome: "Adrenalina", quantidade: "5 ampolas" },
                { nome: "Atropina", quantidade: "3 ampolas" }
              ]
            }
          ]
        },
        {
          id: "3",
          titulo: "Checklist de Debriefing - Trauma",
          tipo: "debriefing",
          autor: "Dr. Paulo Oliveira",
          dataCriacao: "2024-01-05",
          cenariosAssociados: 2,
          itens: 15,
          secoes: [
            {
              titulo: "Avaliação Primária",
              itens: [
                { nome: "ABCDE completo" },
                { nome: "Identificação de lesões" }
              ]
            }
          ]
        },
        {
          id: "4",
          titulo: "Checklist de Materiais - Sala B",
          tipo: "materiais",
          autor: "Dra. Ana Costa",
          dataCriacao: "2024-01-03",
          cenariosAssociados: 4,
          itens: 18,
          secoes: [
            {
              titulo: "Ventilação",
              itens: [
                { nome: "Ventilador mecânico", quantidade: "1" },
                { nome: "Tubos endotraqueais", quantidade: "3 tamanhos" }
              ]
            }
          ]
        }
      ];

      // Combinar dados mock com dados salvos
      const todosChecklists = [...mockChecklists, ...checklistsSalvos];
      setChecklists(todosChecklists);
    } catch (error) {
      console.error("Erro ao carregar checklists:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const checklistsFiltrados = checklists.filter(checklist => {
    const filtroTipoMatch = filtroTipo === "todos" || checklist.tipo === filtroTipo;
    const buscaMatch = busca === "" || 
      checklist.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      checklist.autor.toLowerCase().includes(busca.toLowerCase());
    
    return filtroTipoMatch && buscaMatch;
  });

  const getTipoBadge = (tipo: string) => {
    const variants = {
      "debriefing": "bg-blue-100 text-blue-800",
      "materiais": "bg-green-100 text-green-800"
    };
    return variants[tipo as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const handleEdit = (id: string) => {
    navigate(`/checklists/editar/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/checklists/visualizar/${id}`);
  };

  const handleDelete = (id: string, titulo: string) => {
    if (confirm(`Tem certeza que deseja excluir o checklist "${titulo}"?`)) {
      try {
        const checklistsAtualizados = checklists.filter(c => c.id !== id);
        setChecklists(checklistsAtualizados);
        localStorage.setItem('checklists', JSON.stringify(checklistsAtualizados));
      } catch (error) {
        console.error("Erro ao excluir checklist:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

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
            <div className="text-2xl font-bold">{checklists.length}</div>
            <p className="text-xs text-gray-500">+2 este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checklists Debriefing</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {checklists.filter(c => c.tipo === "debriefing").length}
            </div>
            <p className="text-xs text-gray-500">Para diferentes cenários</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checklists Materiais</CardTitle>
            <CheckSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {checklists.filter(c => c.tipo === "materiais").length}
            </div>
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
              <Input 
                placeholder="Buscar checklists..." 
                className="pl-10"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filtroTipo === "todos" ? "default" : "outline"}
                onClick={() => setFiltroTipo("todos")}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={filtroTipo === "debriefing" ? "default" : "outline"}
                onClick={() => setFiltroTipo("debriefing")}
                size="sm"
              >
                Debriefing
              </Button>
              <Button
                variant={filtroTipo === "materiais" ? "default" : "outline"}
                onClick={() => setFiltroTipo("materiais")}
                size="sm"
              >
                Materiais
              </Button>
            </div>
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
              {checklistsFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-gray-500">
                      {busca || filtroTipo !== "todos" 
                        ? "Nenhum checklist encontrado com os filtros selecionados."
                        : "Nenhum checklist criado ainda."
                      }
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                checklistsFiltrados.map((checklist) => (
                  <TableRow key={checklist.id}>
                    <TableCell className="font-medium">{checklist.titulo}</TableCell>
                    <TableCell>
                      <Badge className={getTipoBadge(checklist.tipo)}>
                        {checklist.tipo === "debriefing" ? "Debriefing" : "Materiais"}
                      </Badge>
                    </TableCell>
                    <TableCell>{checklist.autor}</TableCell>
                    <TableCell>{new Date(checklist.dataCriacao).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{checklist.cenariosAssociados}</TableCell>
                    <TableCell>{checklist.itens}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleView(checklist.id)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(checklist.id)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(checklist.id, checklist.titulo)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Checklists;