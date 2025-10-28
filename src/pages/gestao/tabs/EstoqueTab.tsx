"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { EstoqueStats } from "./components/EstoqueStats";
import { EstoqueFilters } from "./components/EstoqueFilters";
import { EstoqueTable } from "./components/EstoqueTable";
import { ItemDialog } from "./components/ItemDialog";
import { ImportDialog } from "./components/ImportDialog";
import { useEstoqueData } from "./hooks/useEstoqueData";
import { useEstoqueUtils } from "./hooks/useEstoqueUtils";
import { EstoqueItem } from "./types";

const EstoqueTab = () => {
  const {
    itens,
    categorias,
    locais,
    loading,
    salvarItem,
    excluirItem
  } = useEstoqueData();

  const { calcularStatus } = useEstoqueUtils();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("nome");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [itemEditando, setItemEditando] = useState<EstoqueItem | null>(null);

  // Filter and sort items
  const itensFiltrados = useMemo(() => {
    return itens.filter(item => {
      const matchSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.marca.toLowerCase().includes(searchTerm.toLowerCase);
      
      const matchCategoria = categoriaFiltro === "todas" || item.categoria === categoriaFiltro;
      const matchStatus = statusFiltro === "todos" || item.status === statusFiltro;
      
      return matchSearch && matchCategoria && matchStatus;
    });
  }, [itens, searchTerm, categoriaFiltro, statusFiltro]);

  const itensOrdenados = useMemo(() => {
    return [...itensFiltrados].sort((a, b) => {
      switch (ordenacao) {
        case "nome":
          return a.nome.localeCompare(b.nome);
        case "codigo":
          return a.codigo.localeCompare(b.codigo);
        case "quantidade":
          return b.quantidade - a.quantidade;
        case "valor":
          return a.valorTotal - b.valorTotal;
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  }, [itensFiltrados, ordenacao]);

  // Calculate statistics
  const estatisticas = useMemo(() => {
    return {
      total: itens.length,
      disponivel: itens.filter(item => item.status === "disponivel").length,
      baixo: itens.filter(item => item.status === "baixo").length,
      vencendo: itens.filter(item => item.status === "vencendo").length,
      vencido: itens.filter(item => item.status === "vencido").length,
      valorTotal: itens.reduce((acc, item) => acc + item.valorTotal, 0)
    };
  }, [itens]);

  const handleExportarCSV = () => {
    try {
      const headers = [
        'Código',
        'Nome',
        'Categoria',
        'Marca',
        'Modelo',
        'Quantidade',
        'Quantidade Mínima',
        'Unidade',
        'Valor Unitário',
        'Valor Total',
        'Local',
        'Data de Validade',
        'Status',
        'Observações'
      ];

      const csvContent = [
        headers.join(','),
        ...itensOrdenados.map(item => [
          item.codigo,
          item.nome,
          item.categoria,
          item.marca,
          item.modelo,
          item.quantidade,
          item.quantidadeMinima,
          item.unidade,
          item.valorUnitario,
          item.valorTotal,
          item.local,
          item.dataValidade,
          item.status,
          item.observacoes
        ].join(',')
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "estoque_" + new Date().toISOString().split('T')[0] + ".csv";
      document.body.appendChild(link);
      URL.revokeObjectURL(url);

      showSuccess("Arquivo CSV exportado com sucesso!");
    } catch (error) {
      showError("Erro ao exportar arquivo CSV");
    }
  };

  const handleAbrirDialog = (item?: EstoqueItem) => {
    setItemEditando(item || null);
    setIsDialogOpen(true);
  };

  const handleFecharDialog = () => {
    setIsDialogOpen(false);
    setItemEditando(null);
  };

  const handleSalvarItem = (item: EstoqueItem) => {
    if (!item.codigo || !item.nome || !item.categoria) {
      return;
    }
    
    try {
      const cursosAtualizados = cursos.map(c => c.id === item.id ? item : c);
      if (!item.id) {
        cursosAtualizados.push({ ...item, id: Date.now().toString() });
      }
      setCursosAtualizados(cursosAtualizados);
      localStorage.setItem('simlab_cursos', JSON.stringify(cursosAtualizados));
      showSuccess("Curso salvo com sucesso!");
      setIsDialogOpen(false);
      setCursoEditando(null);
    } catch (error) {
      showError("Erro ao salvar curso");
    }
  };

  const handleExcluirCurso = (id: string) => {
    try {
      const cursosAtualizados = cursos.filter(c => c.id !== id);
      setCursosAtualizados(cursosAtualizados);
      localStorage.setItem('simlab_cursos', JSON.stringify(cursosAtualizados));
      showSuccess("Curso excluído com sucesso!");
    } catch (error) {
      showError("Erro ao excluir curso");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ativo: "bg-green-100 text-green-800 border-green-200",
      inativo: "bg-gray-100 text-gray-800 border-gray-200",
      suspenso: "bg-yellow-100 text-yellow-800 border-yellow-200",
      encerrado: "bg-red-100 text-red-800 border-red-200"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const textos = {
      ativo: "Ativo",
      inativo: "Inativo",
      suspenso: "Suspenso",
      encerrado: "Encerrado"
    };
    return textos[status as keyof typeof textos] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-2 text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cursos</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.total}</div>
            <p className="text-xs text-gray-500">Cursos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Ativos</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estatisticas.ativos}</div>
            <p className="text-xs text-gray-500">Em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vagas Totais</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.vagasTotais}</div>
            <p className="text-xs text-gray-500">Total de vagas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vagas Disponíveis</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{estatisticas.vagasDisponiveis}</div>
            <p className="text-xs text-gray-500">Vagas abertas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nota Média</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{estatisticas.notaMedia.toFixed(1)}</div>
            <p className="text-xs text-gray-500">Avaliação geral</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Ações</CardTitle>
          <CardDescription>Filtre e gerencie os cursos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as categorias</SelectItem>
                {categorias.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={modalidadeFiltro} onValueChange={setModalidadeFiltro}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Modalidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="híbrido">Híbrido</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFiltro} onValueChange={setStatusFiltro}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="suspenso">Suspenso</SelectItem>
                <SelectItem value="encerrado">Encerrado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ordenacao} onValueChange={setOrdenacao}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nome">Nome</SelectItem>
                <SelectItem value="vagas">Vagas</SelectItem>
                <SelectItem value="preco">Preço</SelectItem>
                <SelectItem value="nota">Nota Média</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Curso
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cursos</CardTitle>
          <CardDescription>Gerencie todos os cursos do centro de simulação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Modalidade</TableHead>
                  <TableHead>Vagas</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cursosOrdenados.map((curso) => (
                  <TableRow key={curso.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(curso.status)}
                        <Badge className={getStatusBadge(curso.status)}>
                          {getStatusText(curso.status)}
                        </Badge>
                      </TableCell>
                    <TableCell>
                      <div className="font-medium">{curso.codigo}</TableCell>
                      <TableCell>{curso.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-50">
                          {categorias.find(cat => cat.id === curso.categoria)?.nome || curso.categoria}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={item.quantidade <= item.quantidadeMinima ? "text-yellow-600" : ""}>
                            {item.quantidade}
                          <span className="text-xs text-gray-500">
                            {item.unidade}
                          </span>
                          {item.quantidade <= item.quantidadeMinima && (
                            <span className="text-xs text-yellow-600">(min: {item.quantidadeMinima})</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={item.quantidade <= item.quantidadeMinima ? "text-yellow-600" : ""}>
                            {item.quantidade}
                          <span className="text-xs text-gray-500">
                            {item.unidade}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span>R$ {curso.preco.toFixed(2)}</span>
                        </TableCell>
                      <TableCell className="font-medium">R$ {curso.valorTotal.toFixed(2)}</TableCell>
                      <TableCell className="max-w-xs truncate" title={item.local}>
                        {item.local}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => onViewItem(curso)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onEditItem(curso)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleExcluirCurso(curso.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Course Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {cursoEditando?.id ? "Editar Curso" : "Novo Curso"}
            </DialogTitle>
            <DialogDescription>
              {cursoEditando?.id ? "Edite as informações do curso existente" : "Cadastre um novo curso"}
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Curso *</Label>
                  <Input
                    id="nome"
                    value={cursoEditando?.nome || ""}
                    onChange={(e) => setCursoEditando(prev => prev ? { ...prev, nome: e.target.value } : null)}
                    placeholder="Ex: Suporte Básico de Vida"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Textarea
                    id="descricao"
                    value={cursoEditando?.descricao || ""}
                    onChange={(e) => setCursoEditando(prev => prev ? { ...prev, descricao: e.target.value } : null)}
                    placeholder="Descreva o curso"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select value={cursoEditando?.categoria || ""} onValueChange={(value) => setCursoEditando(prev => prev ? { ...prev, categoria: value } : null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="modalidade">Modalidade *</Label>
                  <Select value={cursoEditando?.modalidade || ""} onValueChange={(value) => setCursoEditando(prev => prev ? { ...prev, modalidade: value } : null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meses">Meses</SelectItem>
                      <SelectItem value="anos">Anos</SelectItem>
                      <SelectItem value="semanas">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duracao">Duração *</Label>
                  <Input
                    id="duracao"
                    type="number"
                    value={cursoEditando?.duracao || ""}
                    onChange={(e) => setCursoEditando(prev => prev ? { ...prev, duracao: parseInt(e.target.value) || 0 } : null)}
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duracaoUnidade">Unidade *</Label>
                  <Select value={cursoEditando?.duracaoUnidade || ""} onValueChange={(value) => setCursoEditando(prev => prev ? { ...prev, duracaoUnidade: value as "meses" | "anos" | "semanas" | "dias" | "horas" } : null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meses">Meses</SelectItem>
                      <SelectItem value="anos">Anos</SelectItem>
                      <SelectItem value="semanas">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cargaHoraria">Carga Horária</Label>
                  <Input
                    id="cargaHoraria"
                    type="number"
                    value={cursoEditando?.cargaHoraria || ""}
                    onChange={(e) => setCursoEditando(prev => prev ? { ...prev, cargaHoraria: parseInt(e.target.value) || 0 } : null)}
                    placeholder="0"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vagas">Vagas Totais *</Label>
                    <Input
                      id="vagas"
                      type="number"
                      value={cursoEditando?.vagas || ""}
                      onChange={(e) => setCursoEditando(prev => prev ? { ...prev, vagas: parseInt(e.target.value) || 0 } : null)}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vagasDisponiveis">Vagas Disponíveis *</Label>
                    <Input
                      id="vagasDisponiveis"
                      type="number"
                      value={cursoEditando?.vagasDisponiveis || ""}
                      onChange={(e) => setCursoEditando(prev => prev ? { ...prev, vagasDisponiveis: parseInt(e.target.value) || 0 } : null)}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="preco">Preço (R$) *</Label>
                    <Input
                      id="preco"
                      type="number"
                      value={cursoEditando?.preco || ""}
                      onChange={(e) => setCursoEditando(prev => prev ? { ...prev, preco: parseFloat(e.target.value) || 0 } : null)}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataInicio">Data Início *</Label>
                      <Input
                        id="dataInicio"
                        type="date"
                        value={cursoEditando?.dataInicio || ""}
                        onChange={(e) => setCursoEditando(prev => prev ? { ...prev, dataInicio: e.target.value } : null)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dataFim">Data Fim *</Label>
                      <Input
                        id="dataFim"
                        type="date"
                        value={cursoEditando?.dataFim || ""}
                        onChange={(e) => setCursoEditando(prev => prev ? { ...prev, dataFim: e.target.value } : null)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                      <Label htmlFor="local">Local</Label>
                      <LocationCombobox
                        locais={locais}
                        value={cursoEditando?.local || ""}
                        onValueChange={(value) => setCursoEditando(prev => prev ? { ...prev, local: e.target.value } : null)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={cursoEditando?.status || ""} onValueChange={(value) => setCursoEditando(prev => prev ? { ...prev, status: value as any } : null)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        <SelectContent>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
                          <SelectItem value="suspenso">Suspenso</SelectItem>
                          <SelectItem value="encerrado">Encerrado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={cursoEditando?.observacoes || ""}
                      onChange={(e) => setCursoEditando(prev => prev ? { ...prev, observacoes: e.target.value } : null)}
                      placeholder="Observações adicionais sobre o curso"
                      rows={3}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 px-6 py-4 border-t">
                <Button variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  setCursoEditando(null);
                }}>
                  Cancelar
                </Button>
                <Button onClick={handleSalvarCurso}>
                  {cursoEditando?.id ? "Salvar Alterações" : "Adicionar Curso"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
  );
};

export default CursosTab;