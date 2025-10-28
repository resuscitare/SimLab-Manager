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
import { Search, Plus, Edit, Trash2, Download, FileText, Calendar, Filter, BarChart3, PieChart, TrendingUp } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface Relatorio {
  id: string;
  nome: string;
  tipo: string;
  descricao: string;
  periodo: string;
  dataInicio: string;
  dataFim: string;
  formato: "pdf" | "excel" | "csv";
  status: "rascunho" | "gerado" | "publicado" | "arquivado";
  dataGeracao: string;
  arquivo: string;
  tamanho: number;
  geradoPor: string;
  parametros: Record<string, any>;
}

const RelatoriosTab = () => {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [periodoFiltro, setPeriodoFiltro] = useState("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [relatorioEditando, setRelatorioEditando] = useState<Relatorio | null>(null);

  const tiposRelatorio = [
    { id: "estoque", nome: "Estoque", descricao: "Relatório de itens em estoque" },
    { id: "cursos", nome: "Cursos", descricao: "Relatório de cursos e turmas" },
    { id: "financeiro", nome: "Financeiro", descricao: "Relatório financeiro" },
    { id: "alunos", nome: "Alunos", descricao: "Relatório de alunos" },
    { id: "instrutores", nome: "Instrutores", descricao: "Relatório de instrutores" },
    { id: "simulacoes", nome: "Simulações", descricao: "Relatório de simulações realizadas" },
  ];

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    try {
      const relatoriosSalvos = localStorage.getItem('simlab_relatorios');
      if (relatoriosSalvos) {
        setRelatorios(JSON.parse(relatoriosSalvos));
      } else {
        // Dados mock para demonstração
        const relatoriosMock: Relatorio[] = [
          {
            id: "1",
            nome: "Relatório de Estoque - Janeiro 2024",
            tipo: "estoque",
            descricao: "Relatório completo de itens em estoque no período",
            periodo: "mensal",
            dataInicio: "2024-01-01",
            dataFim: "2024-01-31",
            formato: "pdf",
            status: "gerado",
            dataGeracao: "2024-02-01",
            arquivo: "relatorio_estoque_janeiro_2024.pdf",
            tamanho: 2048576,
            geradoPor: "João Silva",
            parametros: {
              categoria: "todas",
              status: "todos",
              ordenacao: "nome"
            }
          },
          {
            id: "2",
            nome: "Relatório de Cursos - Q1 2024",
            tipo: "cursos",
            descricao: "Relatório trimestral de cursos realizados",
            periodo: "trimestral",
            dataInicio: "2024-01-01",
            dataFim: "2024-03-31",
            formato: "excel",
            status: "publicado",
            dataGeracao: "2024-04-05",
            arquivo: "relatorio_cursos_q1_2024.xlsx",
            tamanho: 3145728,
            geradoPor: "Maria Santos",
            parametros: {
              categoria: "todas",
              status: "concluido",
              incluir_alunos: true
            }
          }
        ];
        setRelatorios(relatoriosMock);
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      showError("Erro ao carregar dados dos relatórios");
      setLoading(false);
    }
  };

  const relatoriosFiltrados = relatorios.filter(relatorio => {
    const matchSearch = relatorio.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       relatorio.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = tipoFiltro === "todos" || relatorio.tipo === tipoFiltro;
    const matchStatus = statusFiltro === "todos" || relatorio.status === statusFiltro;
    const matchPeriodo = periodoFiltro === "todos" || relatorio.periodo === periodoFiltro;
    
    return matchSearch && matchTipo && matchStatus && matchPeriodo;
  });

  const estatisticas = {
    total: relatorios.length,
    rascunho: relatorios.filter(r => r.status === "rascunho").length,
    gerados: relatorios.filter(r => r.status === "gerado").length,
    publicados: relatorios.filter(r => r.status === "publicado").length,
    arquivados: relatorios.filter(r => r.status === "arquivado").length
  };

  const handleSalvarRelatorio = (relatorio: Relatorio) => {
    try {
      const relatoriosAtualizados = relatorios.map(r => r.id === relatorio.id ? relatorio : r);
      if (!relatorio.id) {
        relatoriosAtualizados.push({ ...relatorio, id: Date.now().toString() });
      }
      setRelatorios(relatoriosAtualizados);
      localStorage.setItem('simlab_relatorios', JSON.stringify(relatoriosAtualizados));
      showSuccess("Relatório salvo com sucesso!");
      setIsDialogOpen(false);
      setRelatorioEditando(null);
    } catch (error) {
      showError("Erro ao salvar relatório");
    }
  };

  const handleExcluirRelatorio = (id: string) => {
    try {
      const relatoriosAtualizados = relatorios.filter(r => r.id !== id);
      setRelatorios(relatoriosAtualizados);
      localStorage.setItem('simlab_relatorios', JSON.stringify(relatoriosAtualizados));
      showSuccess("Relatório excluído com sucesso!");
    } catch (error) {
      showError("Erro ao excluir relatório");
    }
  };

  const handleGerarRelatorio = (relatorio: Relatorio) => {
    try {
      const relatorioAtualizado = {
        ...relatorio,
        status: "gerado" as const,
        dataGeracao: new Date().toISOString().split('T')[0],
        arquivo: `${relatorio.nome.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.${relatorio.formato}`,
        tamanho: Math.floor(Math.random() * 5000000) + 1000000
      };
      handleSalvarRelatorio(relatorioAtualizado);
    } catch (error) {
      showError("Erro ao gerar relatório");
    }
  };

  const handlePublicarRelatorio = (relatorio: Relatorio) => {
    try {
      const relatorioAtualizado = {
        ...relatorio,
        status: "publicado" as const
      };
      handleSalvarRelatorio(relatorioAtualizado);
    } catch (error) {
      showError("Erro ao publicar relatório");
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

  const getStatusText = (status: string) => {
    const textos = {
      rascunho: "Rascunho",
      gerado: "Gerado",
      publicado: "Publicado",
      arquivado: "Arquivado"
    };
    return textos[status as keyof typeof textos] || status;
  };

  const formatarTamanho = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            <CardTitle className="text-sm font-medium">Total de Relatórios</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.total}</div>
            <p className="text-xs text-gray-500">Relatórios cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
            <FileText className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{estatisticas.rascunho}</div>
            <p className="text-xs text-gray-500">Em elaboração</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gerados</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estatisticas.gerados}</div>
            <p className="text-xs text-gray-500">Prontos para download</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicados</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estatisticas.publicados}</div>
            <p className="text-xs text-gray-500">Disponíveis publicamente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arquivados</CardTitle>
            <PieChart className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{estatisticas.arquivados}</div>
            <p className="text-xs text-gray-500">Arquivados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Ações</CardTitle>
          <CardDescription>Filtre e gerencie os relatórios</CardDescription>
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
                {tiposRelatorio.map(tipo => (
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
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="rascunho">Rascunho</SelectItem>
                <SelectItem value="gerado">Gerado</SelectItem>
                <SelectItem value="publicado">Publicado</SelectItem>
                <SelectItem value="arquivado">Arquivado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={periodoFiltro} onValueChange={setPeriodoFiltro}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="diario">Diário</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="trimestral">Trimestral</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios</CardTitle>
          <CardDescription>Gerencie todos os relatórios do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Formato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Geração</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relatoriosFiltrados.map((relatorio) => (
                  <TableRow key={relatorio.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{relatorio.nome}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{relatorio.descricao}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-50">
                        {tiposRelatorio.find(t => t.id === relatorio.tipo)?.nome || relatorio.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {new Date(relatorio.dataInicio).toLocaleDateString('pt-BR')} - {new Date(relatorio.dataFim).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {relatorio.formato.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(relatorio.status)}>
                        {getStatusText(relatorio.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {relatorio.dataGeracao ? new Date(relatorio.dataGeracao).toLocaleDateString('pt-BR') : '-'}
                    </TableCell>
                    <TableCell>
                      {relatorio.tamanho ? formatarTamanho(relatorio.tamanho) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {relatorio.status === "rascunho" && (
                          <Button variant="ghost" size="sm" onClick={() => handleGerarRelatorio(relatorio)}>
                            Gerar
                          </Button>
                        )}
                        {relatorio.status === "gerado" && (
                          <Button variant="ghost" size="sm" onClick={() => handlePublicarRelatorio(relatorio)}>
                            Publicar
                          </Button>
                        )}
                        {relatorio.status !== "rascunho" && (
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => {
                          setRelatorioEditando(relatorio);
                          setIsDialogOpen(true);
                        }}>
                          <Edit className="h-4 w-4" />
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

      {/* Add/Edit Report Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {relatorioEditando?.id ? "Editar Relatório" : "Novo Relatório"}
            </DialogTitle>
            <DialogDescription>
              {relatorioEditando?.id ? "Edite as informações do relatório existente" : "Cadastre um novo relatório"}
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
                  placeholder="Ex: Relatório de Estoque - Janeiro 2024"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo *</Label>
                <Select value={relatorioEditando?.tipo || ""} onValueChange={(value) => setRelatorioEditando(prev => prev ? { ...prev, tipo: value } : null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposRelatorio.map(tipo => (
                      <SelectItem key={tipo.id} value={tipo.id}>
                        {tipo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                value={relatorioEditando?.descricao || ""}
                onChange={(e) => setRelatorioEditando(prev => prev ? { ...prev, descricao: e.target.value } : null)}
                placeholder="Descreva o relatório"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="periodo">Período *</Label>
                <Select value={relatorioEditando?.periodo || ""} onValueChange={(value) => setRelatorioEditando(prev => prev ? { ...prev, periodo: value } : null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diario">Diário</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data Início *</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={relatorioEditando?.dataInicio || ""}
                  onChange={(e) => setRelatorioEditando(prev => prev ? { ...prev, dataInicio: e.target.value } : null)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataFim">Data Fim *</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={relatorioEditando?.dataFim || ""}
                  onChange={(e) => setRelatorioEditando(prev => prev ? { ...prev, dataFim: e.target.value } : null)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="formato">Formato *</Label>
                <Select value={relatorioEditando?.formato || ""} onValueChange={(value) => setRelatorioEditando(prev => prev ? { ...prev, formato: value as any } : null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={relatorioEditando?.status || ""} onValueChange={(value) => setRelatorioEditando(prev => prev ? { ...prev, status: value as any } : null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="gerado">Gerado</SelectItem>
                    <SelectItem value="publicado">Publicado</SelectItem>
                    <SelectItem value="arquivado">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={(relatorioEditando as any)?.observacoes || ""}
                onChange={(e) => setRelatorioEditando(prev => prev ? { ...prev, observacoes: e.target.value } : null)}
                placeholder="Observações adicionais sobre o relatório"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 px-6 py-4 border-t">
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              setRelatorioEditando(null);
            }}>
              Cancelar
            </Button>
            <Button onClick={() => {
              if (relatorioEditando) {
                handleSalvarRelatorio(relatorioEditando);
              }
            }}>
              {relatorioEditando?.id ? "Salvar Alterações" : "Adicionar Relatório"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RelatoriosTab;