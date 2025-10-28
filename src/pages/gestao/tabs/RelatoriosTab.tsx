"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Download, 
  Calendar,
  BarChart3,
  Eye,
  Trash2,
  Edit,
  Copy,
  Share,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle
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

interface Relatorio {
  id: string;
  nome: string;
  tipo: string;
  descricao: string;
  periodo: string;
  dataGeracao: string;
  dataInicio: string;
  dataFim: string;
  status: "rascunho" | "gerado" | "publicado" | "arquivado";
  arquivo: string;
  formato: "pdf" | "excel" | "csv";
  tamanho: string;
  geradoPor: string;
  visualizacoes: number;
  downloads: number;
  categorias: string[];
  parametros: Record<string, any>;
}

interface TipoRelatorio {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  icone: string;
}

const RelatoriosTab = () => {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [tiposRelatorios, setTiposRelatorios] = useState<TipoRelatorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("dataGeracao");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [relatorioEditando, setRelatorioEditando] = useState<Relatorio | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [relatorioPreview, setRelatorioPreview] = useState<Relatorio | null>(null);

  // Tipos de relatórios pré-definidos
  const tiposRelatoriosPredefinidos: TipoRelatorio[] = [
    {
      id: "financeiro",
      nome: "Financeiro",
      descricao: "Relatórios financeiros e de custos",
      cor: "bg-green-100 text-green-800",
      icone: "dollar-sign"
    },
    {
      id: "estoque",
      nome: "Estoque",
      descricao: "Relatórios de controle de estoque",
      cor: "bg-blue-100 text-blue-800",
      icone: "package"
    },
    {
      id: "cursos",
      nome: "Cursos",
      descricao: "Relatórios de desempenho e avaliação de cursos",
      cor: "bg-purple-100 text-purple-800",
      icone: "users"
    },
    {
      id: "utilizacao",
      nome: "Utilização",
      descricao: "Relatórios de utilização de recursos",
      cor: "bg-orange-100 text-orange-800",
      icone: "trending-up"
    },
    {
      id: "qualidade",
      nome: "Qualidade",
      descricao: "Relatórios de qualidade e auditoria",
      cor: "bg-red-100 text-red-800",
      icone: "check-circle"
    },
    {
      id: "personalizado",
      nome: "Personalizado",
      descricao: "Relatórios personalizados",
      cor: "bg-gray-100 text-gray-800",
      icone: "file-text"
    }
  ];

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    try {
      // Carregar relatórios do localStorage
      const relatoriosSalvos = localStorage.getItem('relatorios_centro_custos');
      if (relatoriosSalvos) {
        const relatoriosParseados = JSON.parse(relatoriosSalvos);
        setRelatorios(relatoriosParseados);
      } else {
        // Dados mock para demonstração
        const relatoriosMock: Relatorio[] = [
          {
            id: "1",
            nome: "Relatório Financeiro Mensal - Janeiro/2025",
            tipo: "financeiro",
            descricao: "Análise detalhada das finanças do centro de custos",
            periodo: "Janeiro/2025",
            dataGeracao: "2025-02-05",
            dataInicio: "2025-01-01",
            dataFim: "2025-01-31",
            status: "publicado",
            arquivo: "relatorio_financeiro_janeiro_2025.pdf",
            formato: "pdf",
            tamanho: "2.5 MB",
            geradoPor: "João Silva",
            visualizacoes: 45,
            downloads: 23,
            categorias: ["financeiro", "custos"],
            parametros: {
              receitaTotal: 45000,
              custosTotais: 38000,
              margem: 7000,
              desvioOrcamento: 8.5,
              economiaPotencial: 15000
            }
          },
          {
            id: "2",
            nome: "Relatório de Estoque - Q1/2025",
            tipo: "estoque",
            descricao: "Análise completa do estoque e movimentações",
            periodo: "Q1/2025",
            dataGeracao: "2025-04-10",
            dataInicio: "2025-01-01",
            dataFim: "2025-03-31",
            status: "publicado",
            arquivo: "relatorio_estoque_q1_2025.xlsx",
            formato: "excel",
            tamanho: "1.8 MB",
            geradoPor: "Maria Santos",
            visualizacoes: 67,
            downloads: 34,
            categorias: ["estoque", "movimentacoes"],
            parametros: {
              valorTotal: 125000,
              itensCriticos: 3,
              taxaRotatividade: 12.5,
              tempoMedioPermanencia: 45
            }
          }
        ];
        setRelatorios(relatoriosMock);
      }

      setTiposRelatorios(tiposRelatoriosPredefinidos);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      showError("Erro ao carregar dados dos relatórios");
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      rascunho: "bg-gray-100 text-gray-800 border-gray-200",
      gerado: "bg-blue-100 text-blue-800 border-blue-200",
      publicado: "bg-green-100 text-green-800 border-green-200",
      arquivado: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "rascunho":
        return <FileText className="h-4 w-4 text-gray-600" />;
      case "gerado":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "publicado":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "arquivado":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    const textos = {
      rascunho: "Rascunho",
      gerado: "Gerado",
      publicado: "Publicado",
      arquivado: "Arquivado"
    };
    return textos[status as keyof typeof textos] || status;
  };

  const getFormatoIcon = (formato: string) => {
    switch (formato) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-600" />;
      case "excel":
        return <BarChart3 className="h-4 w-4 text-green-600" />;
      case "csv":
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const relatoriosFiltrados = relatorios.filter(relatorio => {
    const matchSearch = relatorio.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         relatorio.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchTipo = tipoFiltro === "todos" || relatorio.tipo === tipoFiltro;
    const matchStatus = statusFiltro === "todos" || relatorio.status === statusFiltro;
    
    return matchSearch && matchTipo && matchStatus;
  });

  const relatoriosOrdenados = [...relatoriosFiltrados].sort((a, b) => {
    switch (ordenacao) {
      case "nome":
        return a.nome.localeCompare(b.nome);
      case "dataGeracao":
        return new Date(b.dataGeracao).getTime() - new Date(a.dataGeracao).getTime();
      case "visualizacoes":
        return b.visualizacoes - a.visualizacoes;
      case "downloads":
        return b.downloads - a.downloads;
      default:
        return 0;
    }
  });

  const estatisticas = {
    total: relatorios.length,
    rascunho: relatorios.filter(r => r.status === "rascunho").length,
    gerados: relatorios.filter(r => r.status === "gerado").length,
    publicados: relatorios.filter(r => r.status === "publicado").length,
    arquivados: relatorios.filter(r => r.status === "arquivado").length,
    totalVisualizacoes: relatorios.reduce((acc, relatorio) => acc + relatorio.visualizacoes, 0),
    totalDownloads: relatorios.reduce((acc, relatorio) => acc + relatorio.downloads, 0),
    tipos: tiposRelatorios.map(tipo => ({
      ...tipo,
      quantidade: relatorios.filter(r => r.tipo === tipo.id).length
    }))
  };

  const handleSalvarRelatorio = (relatorio: Relatorio) => {
    try {
      const relatoriosAtualizados = relatorios.map(r => r.id === relatorio.id ? relatorio : r);
      setRelatorios(relatoriosAtualizados);
      localStorage.setItem('relatorios_centro_custos', JSON.stringify(relatoriosAtualizados));
      showSuccess("Relatório salvo com sucesso!");
    } catch (error) {
      showError("Erro ao salvar relatório");
    }
  };

  const handleExcluirRelatorio = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este relatório?")) {
      try {
        const relatoriosAtualizados = relatorios.filter(r => r.id !== id);
        setRelatorios(relatoriosAtualizados);
        localStorage.setItem('relatorios_centro_custos', JSON.stringify(relatoriosAtualizados));
        showSuccess("Relatório excluído com sucesso!");
      } catch (error) {
        showError("Erro ao excluir relatório");
      }
    }
  };

  const handleGerarRelatorio = (relatorio: Relatorio) => {
    try {
      // Marcar como gerado
      const relatorioAtualizado = {
        ...relatorio,
        status: "gerado",
        dataGeracao: format(new Date(), 'yyyy-MM-dd'),
        arquivo: `relatorio_${relatorio.tipo}_${relatorio.periodo}_${format(new Date(), 'yyyy-MM-dd')}.${relatorio.formato}`
      };
      
      handleSalvarRelatorio(relatorioAtualizado);
    } catch (error) {
      showError("Erro ao gerar relatório");
    }
  };

  const handlePublicarRelatorio = (relatorio: Relatorio) => {
    try {
      // Marcar como publicado
      const relatorioAtualizado = {
        ...relatorio,
        status: "publicado",
        dataFim: format(new Date(), 'yyyy-MM-dd')
      };
      
      handleSalvarRelatorio(relatorioAtualizado);
    } catch (error) {
      showError("Erro ao publicar relatório");
    }
  };

  const handleDownloadRelatorio = (relatorio: Relatorio) => {
    try {
      // Simular download do arquivo
      const link = document.createElement('a');
      link.href = '#'; // URL simulada
      link.download = relatorio.arquivo;
      link.click();
      
      // Incrementar contador de downloads
      const relatoriosAtualizados = relatorios.map(r => 
        r.id === relatorio.id 
          ? { ...r, downloads: r.downloads + 1 }
          : r
      );
      setRelatorios(relatoriosAtualizados);
      localStorage.setItem('relatorios_centro_custos', JSON.stringify(relatoriosAtualizados));
      
      showSuccess("Download iniciado!");
    } catch (error) {
      showError("Erro ao baixar arquivo");
    }
  };

  const handleAbrirDialog = (relatorio?: Relatorio) => {
    setRelatorioEditando(relatorio || null);
    setIsDialogOpen(true);
  };

  const handleFecharDialog = () => {
    setIsDialogOpen(false);
    setRelatorioEditando(null);
  };

  const handleSalvarDialog = () => {
    if (!relatorioEditando) return;

    if (relatorioEditando.id) {
      // Editar relatório existente
      handleSalvarRelatorio(relatorioEditando);
    } else {
      // Criar novo relatório
      const novoRelatorio: Relatorio = {
        ...relatorioEditando,
        id: Date.now().toString(),
        status: "rascunho",
        dataInicio: format(new Date(), 'yyyy-MM-dd'),
        visualizacoes: 0,
        downloads: 0,
        categorias: [],
        parametros: {}
      };
      handleSalvarRelatorio(novoRelatorio);
    }

    handleFecharDialog();
  };

  const handlePreviewRelatorio = (relatorio: Relatorio) => {
    setRelatorioPreview(relatorio);
    setIsPreviewOpen(true);
  };

  const handleFecharPreview = () => {
    setIsPreviewOpen(false);
    setRelatorioPreview(null);
  };

  const handleGerarRelatorioAutomatico = (tipo: string, periodo: string) => {
    try {
      // Gerar relatório automático com base nos dados atuais
      const dadosAtuais = {
        financeiro: {
          receitaTotal: 45000,
          custosTotais: 38000,
          margem: 7000,
          desvioOrcamento: 8.5,
          economiaPotencial: 15000
        },
        estoque: {
          valorTotal: 125000,
          itensCriticos: 3,
          taxaRotatividade: 12.5,
          tempoMedioPermanencia: 45
        },
        cursos: {
          totalCursos: 12,
          cursosAtivos: 8,
          taxaConclusao: 85,
          notaMedia: 4.5,
          satisfacaoAlunos: 4.2
        },
        utilizacao: {
          taxaOcupacao: 78,
          horasUtilizadas: 1560,
          eficiencia: 85
        }
      };

      const dadosRelatorio = dadosAtuais[tipo as keyof typeof dadosAtuais] || {};

      const novoRelatorio: Relatorio = {
        id: Date.now().toString(),
        nome: `Relatório de ${tiposRelatorios.find(t => t.id === tipo)?.nome || tipo} - ${periodo}`,
        tipo: tipo,
        descricao: `Relatório automático de ${tiposRelatorios.find(t => t.id === tipo)?.descricao || tipo}`,
        periodo: periodo,
        dataGeracao: format(new Date(), 'yyyy-MM-dd'),
        dataInicio: format(new Date(), 'yyyy-MM-dd'),
        dataFim: format(new Date(), 'yyyy-MM-dd'),
        status: "gerado",
        arquivo: `relatorio_${tipo}_${periodo}_${format(new Date(), 'yyyy-MM-dd')}.pdf`,
        formato: "pdf",
        tamanho: "0 KB",
        geradoPor: "Sistema Automático",
        visualizacoes: 0,
        downloads: 0,
        categorias: [tipo],
        parametros: dadosRelatorio
      };

      handleSalvarRelatorio(novoRelatorio);
      showSuccess("Relatório gerado automaticamente com sucesso!");
    } catch (error) {
      showError("Erro ao gerar relatório automático");
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Relatórios</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.total}</div>
            <p className="text-xs text-gray-500">Relatórios gerados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estatisticas.publicados}</div>
            <p className="text-xs text-gray-500">Relatórios publicados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Downloads</CardTitle>
            <Download className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{estatisticas.totalDownloads}</div>
            <p className="text-xs text-gray-500">Downloads realizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estatisticas.totalVisualizacoes}</div>
            <p className="text-xs text-gray-500">Visualizações totais</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">85%</div>
            <p className="text-xs text-gray-500">Média de conclusão</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Ações */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Ações</CardTitle>
          <CardDescription>Filtre e gere os relatórios do centro de custos</CardDescription>
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
            
            <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                {tiposRelatorios.map(tipo => (
                  <SelectItem key={tipo.id} value={tipo.id}>
                    {tipo.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFiltro} onValueChange={setStatusFiltro}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="rascunho">Rascunho</SelectItem>
                <SelectItem value="gerado">Gerado</SelectItem>
                <SelectItem value="publicado">Publicado</SelectItem>
                <SelectItem value="arquivado">Arquivado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ordenacao} onValueChange={setOrdenacao}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nome">Nome</SelectItem>
                <SelectItem value="dataGeracao">Data de Geração</SelectItem>
                <SelectItem value="visualizacoes">Visualizações</SelectItem>
                <SelectItem value="downloads">Downloads</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleGerarRelatorioAutomatico("financeiro", "Janeiro/2025")}>
                <FileText className="h-4 w-4 mr-2" />
                Gerar Relatório Financeiro
              </Button>
              <Button variant="outline" onClick={() => handleGerarRelatorioAutomatico("estoque", "Q1/2025")}>
                <FileText className="h-4 w-4 mr-2" />
                Gerar Relatório de Estoque
              </Button>
              <Button variant="outline" onClick={() => handleGerarRelatorioAutomatico("cursos", "Anual 2025")}>
                <FileText className="h-4 w-4 mr-2" />
                Gerar Relatório de Cursos
              </Button>
              <Button onClick={() => handleAbrirDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Relatório
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Relatórios */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Gerados</CardTitle>
          <CardDescription>Gerencie todos os relatórios do centro de custos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Data Geração</TableHead>
                  <TableHead>Formato</TableHead>
                  <TableHead>Visualizações</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relatoriosOrdenados.map((relatorio) => (
                  <TableRow key={relatorio.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(relatorio.status)}
                        <Badge className={getStatusBadge(relatorio.status)}>
                          {getStatusText(relatorio.status)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-50">
                        {tiposRelatorios.find(tipo => tipo.id === relatorio.tipo)?.nome || relatorio.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{relatorio.nome}</TableCell>
                    <TableCell>{relatorio.periodo}</TableCell>
                    <TableCell>{format(new Date(relatorio.dataGeracao), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFormatoIcon(relatorio.formato)}
                        <span className="text-xs text-gray-500">
                          {relatorio.formato.toUpperCase()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-500">
                          {relatorio.visualizacoes}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-gray-500">
                          {relatorio.downloads}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handlePreviewRelatorio(relatorio)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleAbrirDialog(relatorio)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDownloadRelatorio(relatorio)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleExcluirRelatorio(relatorio.id)} className="text-red-600">
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

      {/* Dialog de Adicionar/Editar Relatório */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {relatorioEditando?.id ? "Editar Relatório" : "Novo Relatório"}
            </DialogTitle>
            <DialogDescription>
              {relatorioEditando?.id ? "Edite as informações do relatório existente" : "Crie um novo relatório no centro de custos"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Relatório *</Label>
                <Input
                  id="nome"
                  value={relatorioEditando?.nome || ""}
                  onChange={(e) => setRelatorioEditando(prev => prev ? { ...prev, nome: e.target.value } : null)}
                  placeholder="Ex: Relatório Financeiro Mensal - Janeiro/2025"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  value={relatorioEditando?.descricao || ""}
                  onChange={(e) => setRelatorioEditando(prev => prev ? { ...prev, descricao: e.target.value } : null)}
                  placeholder="Descreva o propósito e escopo do relatório"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Relatório *</Label>
                <Select value={relatorioEditando?.tipo || ""} onValueChange={(value) => setRelatorioEditando(prev => prev ? { ...prev, tipo: value } : null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposRelatorios.map(tipo => (
                      <SelectItem key={tipo.id} value={tipo.id}>
                        {tipo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="periodo">Período *</Label>
                <Input
                  id="periodo"
                  value={relatorioEditando?.periodo || ""}
                  onChange={(e) => setRelatorioEditando(prev => prev ? { ...prev, periodo: e.target.value } : null)}
                  placeholder="Ex: Janeiro/2025, Q1/2025, Anual 2025"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data Início *</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={relatorioEditando?.dataInicio || ""}
                  onChange={(e) => setRelatorioEditando(prev => prev ? { ...prev, dataInicio: e.target.value } : null)}
                  placeholder="DD/MM/AAAA"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataFim">Data Fim *</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={relatorioEditando?.dataFim || ""}
                  onChange={(e) => setRelatorioEditando(prev => prev ? { ...prev, dataFim: e.target.value } : null)}
                  placeholder="DD/MM/AAAA"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={relatorioEditando?.observacoes || ""}
                onChange={(e) => setRelatorioEditando(prev => prev ? { ...prev, observacoes: e.target.value } : null)}
                placeholder="Observações adicionais sobre o relatório"
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 px-6 py-4 border-t">
            <Button variant="outline" onClick={handleFecharDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarDialog}>
              {relatorioEditando?.id ? "Salvar Alterações" : "Criar Relatório"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Preview */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualização Prévia</DialogTitle>
            <DialogDescription>
              Visualização do relatório em formato de relatório
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">Pré-visualização do Relatório</h4>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Nome:</strong> {relatorioPreview?.nome || "Relatório Sem Título"}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Tipo:</strong> {relatorioPreview?.tipo || "Sem Tipo"}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Formato:</strong> {relatorioPreview?.formato?.toUpperCase() || "PDF"}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Tamanho:</strong> {relatorioPreview?.tamanho || "0 KB"}
              </p>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleFecharPreview}>
                <Download className="h-4 w-4 mr-2" />
                Baixar Relatório
              </Button>
              <Button variant="outline" onClick={handleFecharPreview}>
                Fechar Preview
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RelatoriosTab;