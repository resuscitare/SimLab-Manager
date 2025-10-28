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
                  value

<dyad-chat-summary>
Fixed TypeScript errors in EstoqueTab, CursosTab, and related components by correcting imports, types, and JSX handling.
</dyad-chat-summary><dyad-problem-report summary="224 problems">
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="227" column="6" code="17008">JSX element 'div' has no corresponding closing tag.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="287" column="8" code="17008">JSX element 'Card' has no corresponding closing tag.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="288" column="10" code="17008">JSX element 'CardHeader' has no corresponding closing tag.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="289" column="12" code="17008">JSX element 'CardTitle' has no corresponding closing tag.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="293" column="2" code="17008">JSX element 'dyad-write' has no corresponding closing tag.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="298" column="36" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="299" column="3" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="299" column="70" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="300" column="5" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="301" column="7" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="305" column="28" code="1003">Identifier expected.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="306" column="27" code="1003">Identifier expected.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="307" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="309" column="26" code="1003">Identifier expected.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="311" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="313" column="52" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="314" column="5" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="315" column="17" code="1005">'}' expected.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="319" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="321" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="323" column="57" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="324" column="5" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="325" column="7" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="335" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="336" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="338" column="51" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="339" column="5" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="340" column="17" code="1005">'}' expected.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="344" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="346" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="354" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="354" column="3" code="1005">'&lt;/' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="28" column="6" code="17008">JSX element 'div' has no corresponding closing tag.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="29" column="8" code="17008">JSX element 'Table' has no corresponding closing tag.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="43" column="10" code="17008">JSX element 'TableBody' has no corresponding closing tag.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="45" column="14" code="17008">JSX element 'TableRow' has no corresponding closing tag.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="78" column="26" code="1005">'&gt;' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="103" column="143" code="1005">'}' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="103" column="376" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="104" column="45" code="1005">'}' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="104" column="278" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="105" column="50" code="1005">'}' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="105" column="298" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="124" column="2" code="17008">JSX element 'dyad-write' has no corresponding closing tag.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="129" column="36" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="130" column="3" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="130" column="70" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="131" column="5" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="132" column="7" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="136" column="28" code="1003">Identifier expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="137" column="27" code="1003">Identifier expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="138" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="140" column="26" code="1003">Identifier expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="142" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="144" column="52" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="145" column="5" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="146" column="17" code="1005">'}' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="150" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="152" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="154" column="57" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="155" column="5" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="156" column="7" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="166" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="167" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="169" column="51" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="170" column="5" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="171" column="17" code="1005">'}' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="175" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="177" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="185" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="185" column="3" code="1005">'&lt;/' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="32" column="29" code="1005">'&gt;' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="32" column="38" code="1005">';' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="32" column="65" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="32" column="66" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="34" column="31" code="1005">'&gt;' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="34" column="40" code="1005">';' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="34" column="68" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="34" column="69" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="36" column="31" code="1005">'&gt;' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="36" column="40" code="1005">';' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="36" column="68" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="36" column="69" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="38" column="31" code="1005">'&gt;' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="38" column="40" code="1005">';' expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="38" column="65" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="38" column="66" code="1109">Expression expected.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab.tsx" line="8" column="30" code="2307">Cannot find module './components/EstoqueStats' or its corresponding type declarations.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab.tsx" line="9" column="32" code="2307">Cannot find module './components/EstoqueFilters' or its corresponding type declarations.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab.tsx" line="10" column="30" code="2307">Cannot find module './components/EstoqueTable' or its corresponding type declarations.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab.tsx" line="11" column="28" code="2307">Cannot find module './components/ItemDialog' or its corresponding type declarations.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab.tsx" line="12" column="30" code="2307">Cannot find module './components/ImportDialog' or its corresponding type declarations.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab.tsx" line="13" column="32" code="2307">Cannot find module './hooks/useEstoqueData' or its corresponding type declarations.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab.tsx" line="14" column="33" code="2307">Cannot find module './hooks/useEstoqueUtils' or its corresponding type declarations.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab.tsx" line="15" column="29" code="2307">Cannot find module './types' or its corresponding type declarations.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="293" column="1" code="2339">Property 'dyad-write' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="294" column="10" code="2304">Cannot find name 'EstoqueItem'.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="295" column="10" code="2304">Cannot find name 'CheckCircle'.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="295" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="295" column="23" code="2304">Cannot find name 'AlertTriangle'.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="296" column="10" code="2552">Cannot find name 'ReactElement'. Did you mean 'SVGRectElement'?</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="315" column="7" code="2304">Cannot find name 'disponivel'.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="326" column="17" code="2304">Cannot find name 'CheckCircle'.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="328" column="17" code="2304">Cannot find name 'AlertTriangle'.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="330" column="17" code="2304">Cannot find name 'AlertTriangle'.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="332" column="17" code="2304">Cannot find name 'AlertTriangle'.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="334" column="17" code="2304">Cannot find name 'CheckCircle'.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="340" column="7" code="2304">Cannot find name 'disponivel'.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="349" column="5" code="2304">Cannot find name 'calcularStatus'.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="349" column="5" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="349" column="5" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="349" column="5" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/pages/gestao/tabs/CursosTab.tsx" line="351" column="5" code="2304">Cannot find name 'getStatusIcon'.</problem>
<problem file="src/pages/gestao/index.tsx" line="20" column="8" code="1192">Module '&quot;C:/Users/danil/dyad-apps/SimLab Manager/src/pages/gestao/tabs/CursosTab&quot;' has no default export.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="32" column="17" code="2749">'CheckCircle' refers to a value, but is being used as a type here. Did you mean 'typeof CheckCircle'?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="32" column="29" code="2304">Cannot find name 'className'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="32" column="39" code="2362">The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="34" column="17" code="2749">'AlertTriangle' refers to a value, but is being used as a type here. Did you mean 'typeof AlertTriangle'?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="34" column="31" code="2304">Cannot find name 'className'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="34" column="41" code="2362">The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="36" column="17" code="2749">'AlertTriangle' refers to a value, but is being used as a type here. Did you mean 'typeof AlertTriangle'?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="36" column="31" code="2304">Cannot find name 'className'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="36" column="41" code="2362">The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="38" column="17" code="2749">'AlertTriangle' refers to a value, but is being used as a type here. Did you mean 'typeof AlertTriangle'?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="38" column="31" code="2304">Cannot find name 'className'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/hooks/useEstoqueUtils.ts" line="38" column="41" code="2362">The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="78" column="26" code="2339">Property 'dyad-problem-report' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="79" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="79" column="125" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="80" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="80" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="81" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="81" column="129" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="82" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="82" column="129" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="83" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="83" column="125" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="84" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="84" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="85" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="85" column="129" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="86" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="86" column="129" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="87" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="87" column="125" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="88" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="88" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="89" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="89" column="129" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="90" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="90" column="129" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="91" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="91" column="125" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="92" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="92" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="93" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="93" column="129" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="94" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="94" column="129" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="95" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="95" column="173" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="96" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="96" column="175" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="97" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="97" column="174" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="98" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="98" column="172" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="99" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="99" column="174" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="100" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="100" column="171" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="101" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="101" column="172" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="102" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="102" column="156" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="103" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="103" column="129" code="2304">Cannot find name 'duracaoUnidade'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="104" column="31" code="2304">Cannot find name 'duracaoUnidade'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="105" column="36" code="2304">Cannot find name 'duracaoUnidade'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="107" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="108" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="108" column="210" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="109" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="109" column="138" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="110" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="110" column="213" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="111" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="111" column="214" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="112" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="112" column="138" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="113" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="113" column="213" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="114" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="114" column="214" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="115" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="115" column="138" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="116" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="116" column="213" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="117" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="117" column="214" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="118" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="118" column="138" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="119" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="119" column="213" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="120" column="1" code="2339">Property 'dyad-problem-report' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="121" column="1" code="2339">Property 'think' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="121" column="8" code="2339">Property 'think' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="124" column="1" code="2339">Property 'dyad-write' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="125" column="10" code="2693">'EstoqueItem' only refers to a type, but is being used as a value here.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="126" column="10" code="2304">Cannot find name 'CheckCircle'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="126" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="126" column="23" code="2304">Cannot find name 'AlertTriangle'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="127" column="10" code="2552">Cannot find name 'ReactElement'. Did you mean 'SVGRectElement'?</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="146" column="7" code="2304">Cannot find name 'disponivel'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="157" column="17" code="2304">Cannot find name 'CheckCircle'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="159" column="17" code="2304">Cannot find name 'AlertTriangle'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="161" column="17" code="2304">Cannot find name 'AlertTriangle'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="163" column="17" code="2304">Cannot find name 'AlertTriangle'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="165" column="17" code="2304">Cannot find name 'CheckCircle'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="171" column="7" code="2304">Cannot find name 'disponivel'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="180" column="5" code="2304">Cannot find name 'calcularStatus'.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="180" column="5" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="180" column="5" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/pages/gestao/tabs/EstoqueTab/components/EstoqueTable.tsx" line="180" column="5" code="2695">Left side of comma operator is unused and has no side effects.</problem>
</dyad-problem-report>
I'll fix all these TypeScript errors by creating the missing files and correcting the syntax issues:

<dyad-write path="src/pages/gestao/tabs/EstoqueTab/types/index.ts" description="Estoque types">
export interface EstoqueItem {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  marca: string;
  modelo: string;
  quantidade: number;
  quantidadeMinima: number;
  unidade: string;
  valorUnitario: number;
  valorTotal: number;
  local: string;
  dataValidade: string;
  status: "disponivel" | "baixo" | "vencendo" | "vencido";
  observacoes: string;
}

export interface Categoria {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
}