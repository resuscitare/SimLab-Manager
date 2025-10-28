"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Users, Clock, DollarSign, Star, Calendar, MapPin } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface CategoriaCurso {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
}

interface Curso {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  modalidade: "presencial" | "online" | "híbrido";
  duracao: number;
  duracaoUnidade: "meses" | "anos" | "semanas" | "dias" | "horas";
  cargaHoraria: number;
  vagas: number;
  vagasDisponiveis: number;
  preco: number;
  dataInicio: string;
  dataFim: string;
  local: string;
  status: "ativo" | "inativo" | "suspenso" | "encerrado";
  observacoes: string;
  notaMedia: number;
  totalAvaliacoes: number;
}

const CursosTab = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [categorias, setCategorias] = useState<CategoriaCurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [modalidadeFiltro, setModalidadeFiltro] = useState("todas");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("nome");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cursoEditando, setCursoEditando] = useState<Curso | null>(null);

  const categoriasPredefinidas: CategoriaCurso[] = [
    { id: "enfermagem", nome: "Enfermagem", descricao: "Cursos de enfermagem", cor: "bg-blue-100 text-blue-800" },
    { id: "medicina", nome: "Medicina", descricao: "Cursos de medicina", cor: "bg-red-100 text-red-800" },
    { id: "fisioterapia", nome: "Fisioterapia", descricao: "Cursos de fisioterapia", cor: "bg-green-100 text-green-800" },
    { id: "gestao", nome: "Gestão", descricao: "Cursos de gestão em saúde", cor: "bg-yellow-100 text-yellow-800" },
    { id: "tecnologia", nome: "Tecnologia em saúde", descricao: "Cursos de tecnologia em saúde", cor: "bg-indigo-100 text-indigo-800" },
  ];

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    try {
      // Carregar cursos
      const cursosSalvos = localStorage.getItem('simlab_cursos');
      if (cursosSalvos) {
        setCursos(JSON.parse(cursosSalvos));
      } else {
        // Dados mock para demonstração
        const cursosMock: Curso[] = [
          {
            id: "1",
            nome: "Suporte Básico de Vida",
            descricao: "Curso completo de suporte básico de vida com técnicas de RCP",
            categoria: "enfermagem",
            modalidade: "presencial",
            duracao: 2,
            duracaoUnidade: "dias",
            cargaHoraria: 16,
            vagas: 30,
            vagasDisponiveis: 15,
            preco: 350,
            dataInicio: "2024-02-01",
            dataFim: "2024-02-02",
            local: "Laboratório Térreo",
            status: "ativo",
            observacoes: "Material didático incluído",
            notaMedia: 4.5,
            totalAvaliacoes: 20
          },
          {
            id: "2",
            nome: "Ventilação Mecânica",
            descricao: "Curso avançado de ventilação mecânica",
            categoria: "medicina",
            modalidade: "híbrido",
            duracao: 1,
            duracaoUnidade: "meses",
            cargaHoraria: 40,
            vagas: 20,
            vagasDisponiveis: 8,
            preco: 1200,
            dataInicio: "2024-03-01",
            dataFim: "2024-03-31",
            local: "Laboratório 1º Andar",
            status: "ativo",
            observacoes: "Aulas teóricas online e práticas presenciais",
            notaMedia: 4.8,
            totalAvaliacoes: 15
          }
        ];
        setCursos(cursosMock);
      }

      setCategorias(categoriasPredefinidas);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      showError("Erro ao carregar dados dos cursos");
      setLoading(false);
    }
  };

  const cursosFiltrados = cursos.filter(curso => {
    const matchSearch = curso.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       curso.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = categoriaFiltro === "todas" || curso.categoria === categoriaFiltro;
    const matchModalidade = modalidadeFiltro === "todas" || curso.modalidade === modalidadeFiltro;
    const matchStatus = statusFiltro === "todos" || curso.status === statusFiltro;
    
    return matchSearch && matchCategoria && matchModalidade && matchStatus;
  });

  const cursosOrdenados = [...cursosFiltrados].sort((a, b) => {
    switch (ordenacao) {
      case "nome":
        return a.nome.localeCompare(b.nome);
      case "vagas":
        return b.vagasDisponiveis - a.vagasDisponiveis;
      case "preco":
        return a.preco - b.preco;
      case "nota":
        return b.notaMedia - a.notaMedia;
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const estatisticas = {
    total: cursos.length,
    ativos: cursos.filter(c => c.status === "ativo").length,
    vagasTotais: cursos.reduce((acc, c) => acc + c.vagas, 0),
    vagasDisponiveis: cursos.reduce((acc, c) => acc + c.vagasDisponiveis, 0),
    notaMedia: cursos.length > 0 ? cursos.reduce((acc, c) => acc + c.notaMedia, 0) / cursos.length : 0
  };

  const handleSalvarCurso = () => {
    if (!cursoEditando?.nome || !cursoEditando?.descricao || !cursoEditando?.categoria) {
      showError("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const cursosAtualizados = cursos.map(c => c.id === cursoEditando.id ? cursoEditando : c);
      if (!cursoEditando.id) {
        cursosAtualizados.push({ ...cursoEditando, id: Date.now().toString() });
      }
      setCursos(cursosAtualizados);
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
      setCursos(cursosAtualizados);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cursos</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.total}</div>
            <p className="text-xs text-gray-500">Cursos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Ativos</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estatisticas.ativos}</div>
            <p className="text-xs text-gray-500">Em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vagas Totais</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.vagasTotais}</div>
            <p className="text-xs text-gray-500">Total de vagas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vagas Disponíveis</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{estatisticas.vagasDisponiveis}</div>
            <p className="text-xs text-gray-500">Vagas abertas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Modalidade</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Vagas</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cursosOrdenados.map((curso) => (
                  <TableRow key={curso.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{curso.nome}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{curso.descricao}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-50">
                        {categorias.find(cat => cat.id === curso.categoria)?.nome || curso.categoria}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {curso.modalidade}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{curso.duracao} {curso.duracaoUnidade}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{curso.vagasDisponiveis}/{curso.vagas}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span>R$ {curso.preco.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(curso.status)}>
                        {getStatusText(curso.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setCursoEditando(curso);
                          setIsDialogOpen(true);
                        }}>
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
            </DialogDescription>
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
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="modalidade">Modalidade *</Label>
                <Select value={cursoEditando?.modalidade || ""} onValueChange={(value) => setCursoEditando(prev => prev ? { ...prev, modalidade: value as any } : null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presencial">Presencial</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="híbrido">Híbrido</SelectItem>
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
                    <SelectItem value="semanas">Semanas</SelectItem>
                    <SelectItem value="dias">Dias</SelectItem>
                    <SelectItem value="horas">Horas</SelectItem>
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
                  step="0.01"
                  value={cursoEditando?.preco || ""}
                  onChange={(e) => setCursoEditando(prev => prev ? { ...prev, preco: parseFloat(e.target.value) || 0 } : null)}
                  placeholder="0.00"
                />
              </div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="local">Local</Label>
                <Input
                  id="local"
                  value={cursoEditando?.local || ""}
                  onChange={(e) => setCursoEditando(prev => prev ? { ...prev, local: e.target.value } : null)}
                  placeholder="Ex: Laboratório Térreo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={cursoEditando?.status || ""} onValueChange={(value) => setCursoEditando(prev => prev ? { ...prev, status: value as any } : null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
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
              />
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