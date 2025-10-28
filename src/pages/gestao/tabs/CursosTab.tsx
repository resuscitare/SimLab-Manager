"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  BarChart3
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { showSuccess, showError } from "@/utils/toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Curso {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  modalidade: "presencial" | "online" | "híbrido";
  duracao: number;
  duracaoUnidade: string;
  vagas: number;
  vagasDisponiveis: number;
  preco: number;
  precoUnidade: string;
  instrutores: string[];
  status: "ativo" | "inativo" | "suspenso" | "encerrado";
  dataInicio: string;
  dataFim: string;
  cargaHoraria: number;
  materialDidatico: string;
  certificado: string;
  publicoAlvo: string;
  requisitos: string[];
  avaliacoes: number[];
  notaMedia: number;
  local: string;
  observacoes: string;
}

interface CategoriaCurso {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
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

  // Categorias pré-definidas
  const categoriasPredefinidas: CategoriaCurso[] = [
    { id: "medicina", nome: "Medicina", descricao: "Cursos de graduação e pós-graduação em medicina", cor: "bg-red-100 text-red-800" },
    { id: "enfermagem", nome: "Enfermagem", descricao: "Cursos de graduação e pós-graduação em enfermagem", cor: "bg-blue-100 text-blue-800" },
    { id: "medicina-intensiva", nome: "Medicina Intensiva", descricao: "Programas de residência médica", cor: "bg-purple-100 text-purple-800" },
    { id: "multiprofissional", nome: "Multiprofissional", descricao: "Cursos para equipes de saúde", cor: "bg-green-100 text-green-800" },
    { id: "gestao", nome: "Gestão", descricao: "Cursos de gestão em saúde", cor: "bg-yellow-100 text-yellow-800" },
    { id: "tecnologia", nome: "Tecnologia em saúde", cor: "bg-indigo-100 text-indigo-800" },
  ];

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    try {
      // Carregar cursos do localStorage
      const cursosSalvos = localStorage.getItem('cursos_centro_custos');
      if (cursosSalvos) {
        const cursosParseados = JSON.parse(cursosSalvos);
        setCursos(cursosParseados);
      } else {
        // Dados mock para demonstração
        const cursosMock: Curso[] = [
          {
            id: "1",
            nome: "Residência Médica em Clínica Médica",
            descricao: "Programa de residência médica com foco em diagnóstico e tratamento",
            categoria: "medicina-intensiva",
            modalidade: "presencial",
            duracao: 24,
            duracaoUnidade: "meses",
            vagas: 20,
            vagasDisponiveis: 5,
            preco: 8500,
            precoUnidade: "mês",
            instrutores: ["Dr. João Silva", "Dra. Maria Santos"],
            status: "ativo",
            dataInicio: "2024-01-15",
            dataFim: "2026-01-14",
            cargaHoraria: 60,
            materialDidatico: "Programa oficial, livros, artigos científicos",
            certificado: "CRM - Ministério da Saúde",
            publicoAlvo: "Médicos formandos ou formandos",
            requisitos: ["Graduação em Medicina", "Inscrição no CRM", "Aprovação em prova"],
            avaliacoes: [4.5, 4.2, 4.8, 4.6, 4.4],
            notaMedia: 4.525,
            local: "Hospital Universitário",
            observacoes: "Curso com alta demanda no mercado"
          },
          {
            id: "2",
            nome: "Especialização em Enfermagem em Terapia Intensiva",
            descricao: "Curso de especialização em terapia intensiva",
            categoria: "enfermagem",
            modalidade: "híbrido",
            duracao: 12,
            duracaoUnidade: "meses",
            vagas: 30,
            vagasDisponiveis: 8,
            preco: 3500,
            precoUnidade: "mês",
            instrutores: ["Dra. Ana Oliveira", "Enf. Carlos Mendes"],
            status: "ativo",
            dataInicio: "2024-03-01",
            dataFim: "2024-12-31",
            cargaHoraria: 40,
            materialDidatico: "Plataforma online, material impresso",
            certificado: "COFEN",
            publicoAlvo: "Enfermeiros graduados",
            requisitos: ["Graduação em Enfermagem", "Experiência prévia em terapia intensiva"],
            avaliacoes: [4.8, 4.6, 4.9, 4.7],
            notaMedia: 4.75,
            local: "Escola de Enfermagem",
            observacoes: "Curso com alta demanda"
          },
          {
            id: "3",
            nome: "Gestão Hospitalar para Líderes",
            descricao: "Curso de especialização em gestão hospitalar",
            categoria: "gestao",
            modalidade: "online",
            duracao: 6,
            duracaoUnidade: "meses",
            vagas: 50,
            vagasDisponiveis: 25,
            preco: 2500,
            precoUnidade: "mês",
            instrutores: ["Dr. Roberto Almeida", "Dra. Fernanda Lima"],
            status: "ativo",
            dataInicio: "2024-02-01",
            dataFim: "2024-07-31",
            cargaHoraria: 20,
            materialDidatico: "Plataforma online, material impresso",
            certificado: "ANAHIS",
            publicoAlvo: "Profissionais de saúde",
            requisitos: ["Graduação em Gestão", "Experiência prévia em gestão"],
            avaliacoes: [4.3, 4.2, 4.4, 4.6],
            notaMedia: 4.35,
            local: "Hospital Universitário",
            observacoes: "Curso com alta demanda"
          }
        ];
        setCursos(cursosMock);
      }

      setCategorias(categoriasPredefinidas);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar dados dos cursos");
      showError("Erro ao carregar dados dos cursos");
      setLoading(false);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ativo":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "inativo":
        return <Pause className="h-4 w-4 text-gray-600" />;
      case "suspenso":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "encerrado":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
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

  const getModalidadeBadge = (modalidade: string) => {
    const variants = {
      presencial: "bg-blue-100 text-blue-800 border-blue-200",
      online: "bg-purple-100 text-purple-800 border-purple-200",
      híbrido: "bg-green-100 text-green-800 border-green-200"
    };
    return variants[modalidade as keyof typeof variants] || "bg-gray-100 text-gray-800";
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
    ativos: cursos.filter(curso => curso.status === "ativo").length,
    inativos: cursos.filter(curso => curso.status === "inativo").length,
    suspensos: cursos.filter(curso => curso.status === "suspenso").length,
    encerrados: cursos.filter(curso => curso.status === "encerrado").length,
    totalVagas: cursos.reduce((acc, curso) => acc + curso.vagas, 0),
    vagasDisponiveis: cursos.reduce((acc, curso) => acc + curso.vagasDisponiveis, 0),
    receitaTotal: cursos.reduce((acc, curso) => acc + (curso.preco * curso.vagas), 0),
    categorias: categorias.map(cat => ({
      ...cat,
      quantidade: cursos.filter(curso => curso.categoria === cat.id).length
    }))
  };

  const handleSalvarCurso = (curso: Curso) => {
    try {
      const cursosAtualizados = cursos.map(c => c.id === curso.id ? curso : c);
      setCursos(cursosAtualizados);
      localStorage.setItem('cursos_centro_custos', JSON.stringify(cursosAtualizados));
      showSuccess("Curso atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar curso");
    }
  };

  const handleExcluirCurso = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este curso?")) {
      try {
        const cursosAtualizados = cursos.filter(curso => curso.id !== id);
        setCursos(cursosAtualizados);
        localStorage.setItem('cursos_centro_custos', JSON.stringify(cursosAtualizados));
        showSuccess("Curso excluído com sucesso!");
      } catch (error) {
      console.error("Erro ao excluir curso");
    }
  };

  const handleAbrirDialog = (curso?: Curso) => {
    setCursoEditando(curso || null);
    setIsDialogOpen(true);
  };

  const handleFecharDialog = () => {
    setIsDialogOpen(false);
    setCursoEditando(null);
  };

  const handleSalvarDialog = () => {
    if (!cursoEditando) return;

    if (cursoEditando.id) {
      // Editar curso existente
      handleSalvarCurso(cursoEditando);
    } else {
      // Criar novo curso
      const novoCurso: Curso = {
        ...cursoEditando,
        id: Date.now().toString(),
        status: "ativo",
        notaMedia: 0,
        avaliacoes: []
      };
      handleSalvarCurso(novoCurso);
    }

    handleFecharDialog();
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
      {/* Cabeçalho com Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estatisticas.ativos}</div>
            <p className="text-xs text-gray-500">Cursos ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vagas</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{estatisticas.totalVagas}</div>
            <p className="text-xs text-gray-500">Vagas disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {estatisticas.receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-500">Mensal estimada</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Ações */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Ações</CardTitle>
          <CardDescription>Filtre e gerencie os cursos do centro de custos</CardDescription>
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

            <Button onClick={() => handleAbrirDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Curso
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Cursos */}
      <Card>
        <CardHeader>
          <CardTitle>Cursos Oferecidos</CardTitle>
          <CardDescription>Gerencie todos os cursos do centro de custos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Modalidade</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Vagas</TableHead>
                  <TableHead>Preço</TableHead>
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
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{curso.nome}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-50">
                        {categorias.find(cat => cat.id === curso.categoria)?.nome || curso.categoria}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getModalidadeBadge(curso.modalidade)}>
                        {curso.modalidade.charAt(0).toUpperCase() + curso.modalidade.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {curso.duracao} {curso.duracaoUnidade}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={curso.vagasDisponiveis <= 5 ? "text-red-600" : ""}>
                          {curso.vagasDisponiveis}/{curso.vagas}
                        </span>
                        <span className="text-xs text-gray-500">
                          vagas
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      R$ {curso.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/{curso.precoUnidade}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleAbrirDialog(curso)}>
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

      {/* Dialog de Adicionar/Editar Curso */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {cursoEditando?.id ? "Editar Curso" : "Novo Curso"}
            </DialogTitle>
            <DialogDescription>
              {cursoEditando?.id ? "Edite as informações do curso existente" : "Cadastre um novo curso no centro de custos"}
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
                  placeholder="Ex: Residência Médica em Clínica Médica"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  value={cursoEditando?.descricao || ""}
                  onChange={(e) => setCursoEditando(prev => prev ? { ...prev, descricao: e.target.value } : null)}
                  placeholder="Descreva o curso e seus objetivos"
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
                  value={cursoEditando?.duracao || 0}
                  onChange={(e) => setCursoEditando(prev => prev ? { ...prev, duracao: parseInt(e.target.value) || 0 } : null)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duracaoUnidade">Unidade *</Label>
                <Select value={cursoEditando?.duracaoUnidade || ""} onValueChange={(value) => setCursoEditando(prev => prev ? { ...prev, duracaoUnidade: value } : null)}>
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
                  value={cursoEditando?.cargaHoraria || 0}
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
                  value={cursoEditando?.vagas || 0}
                  onChange={(e) => setCursoEditando(prev => prev ? { ...prev, vagas: parseInt(e.target.value) || 0 } : null)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vagasDisponiveis">Vagas Disponíveis *</Label>
                <Input
                  id="vagasDisponiveis"
                  type="number"
                  value={cursoEditando?.vagasDisponiveis || 0}
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
                  value={cursoEditando?.preco || 0}
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

            <div className="space-y-2">
              <Label htmlFor="local">Local</Label>
              <Input
                id="local"
                value={cursoEditando?.local || ""}
                onChange={(e) => setCursoEditando(prev => prev ? { ...prev, local: e.target.value } : null)}
                placeholder="Ex: Hospital Universitário"
              />
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
            <Button variant="outline" onClick={handleFecharDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarDialog}>
              {cursoEditando?.id ? "Salvar Alterações" : "Adicionar Curso"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CursosTab;