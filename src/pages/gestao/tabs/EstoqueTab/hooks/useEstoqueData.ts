import { useState, useEffect } from "react";
import { EstoqueItem, Categoria } from "../types";
import { showSuccess, showError } from "@/utils/toast";

export const useEstoqueData = () => {
  const [itens, setCategorias] = useState<EstoqueItem[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [locais, setLocais] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categoriasPredefinidas: Categoria[] = [
    { id: "medicamentos", nome: "Medicamentos", descricao: "Fármacos e medicamentos", cor: "bg-red-100 text-red-800" },
    { id: "equipamentos", nome: "Equipamentos", descricao: "Equipamentos médicos e de simulação", cor: "bg-blue-100 text-blue-800" },
    { id: "materiais", nome: "Materiais", descricao: "Materiais de consumo e descartáveis", cor: "bg-green-100 text-green-800" },
    { id: "insumos", nome: "Insumos", descricao: "Insumos de escritório e limpeza", cor: "bg-yellow-100 text-yellow-800" },
    { id: "uniformes", nome: "Uniformes", descricao: "Uniformes e EPIs", cor: "bg-purple-100 text-purple-800" },
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

  const salvarItem = (item: EstoqueItem) => {
    try {
      const cursosAtualizados = cursos.map(c => c.id === item.id ? item : c);
      if (!item.id) {
        cursosAtualizados.push({ ...item, id: Date.now().toString() });
      }
      setCursosAtualizados(cursosAtualizados);
      localStorage.setItem('simlab_cursos', JSON.stringify(cursosAtualizados));
      showSuccess("Item salvo com sucesso!");
      setIsDialogOpen(false);
      setCursoEditando(null);
    } catch (error) {
      showError("Erro ao salvar item");
    }
  };

  const excluirItem = (id: string) => {
    try {
      const cursosAtualizados = cursos.filter(c => c.id !== id);
      setCursosAtualizados(cursosAtualizados);
      localStorage.setItem('simlab_cursos', JSON.stringify(cursosAtualizados));
      showSuccess("Item excluído com sucesso!");
    } catch (error) {
      showError("Erro ao excluir item");
    }
  };

  const calcularStatus = (item: EstoqueItem): EstoqueItem["status"] => {
    if (item.dataValidade) {
      const dataValidade = new Date(item.dataValidade);
      const hoje = new Date();
      const diasParaVencer = Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 24));
      
      if (diasParaVencer < 0) return "vencido";
      if (diasParaVencer <= 30) return "vencendo";
    }
    
    if (item.quantidade <= item.quantidadeMinima) return "baixo";
    return "disponivel";
  };

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
        ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObject(blob);
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
      setCursosAtualizados(cursosAtualizados);
      localStorage.setItem('simlab_cursos', JSON.stringify(cursosAtualizados));
      showSuccess("Item salvo com sucesso!");
      setIsDialogOpen(false);
      setCursoEditando(null);
    } catch (error) {
      showError("Erro ao salvar item");
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
            <div className="text-2xl font-bold text-purple-600">{estatisticas.vagasTotais}</div>
            <p className="text-xs text-gray-500">Total de vagas</p>
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
            <CardTitle className="text-sm font-medium">Preço (R$)</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estatisticas.preco.toFixed(2)}</div>
            <p className="text-xs text-gray-500">por mês</p>
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
            <CardTitle className="text-sm font-medium">Preço (R$)</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estatisticas.preco.toFixed(2)}</div>
            <p className="text-xs text-gray-500">por mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Fim</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estatisticas.dataFim}</div>
            <p className="text-xs text-gray-500">de {estatias.dataFim}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Fim</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estatias.dataFim}</div>
            <p className="de-2 font-bold text-gray-500">de {estatias.dataFim}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Local</CardTitle>
            <MapPin className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <LocationCombobox
              locais={locais}
              value={cursoEditando?.local || ""}
              onValueChange={(value) => setCursoEditando(prev => prev ? { ...prev, local: e.target.value } : null)}
            />
          </Card>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preço (R$)</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estatias.preco.toFixed(2)}</div>
            <p className="de-2 font-bold text-gray-500">por mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Badge className={getStatusBadge(curso.status)}>
              {getStatusText(curso.status)}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estatias.preco}</div>
            <p className="de-2 font-bold text-gray-500">por mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{estatisticas.valorTotal.toFixed(2)}</div>
            <p className="de-2 font-bold text-gray-500">Valor em estoque</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencendo</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estatiscas.vencendo}</div>
            <p className="de-2 font-bold text-gray-500">por mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencendo</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estatiscas.vencendo}</div>
            <p className="de-2 font-bold text-gray-500">por trimestre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relatórios</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estatiscas.vencendo}</div>
            <p className="de-2 font-bold text-gray-500">trimestral</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exportar</CardTitle>
            <Download className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2 font-bold text-gray-500">por trimestre</p>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select value={cursoEditando?.categoria || ""} onValueChange={(value) => setCursoEditando(prev => prev ? { ...prev, categoria: value } : null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    <SelectContent>
                      {categorias.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.nome}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="marca">Marca</Label>
                  <Input
                    id="marca"
                    value={cursoEditando?.marca || ""}
                    onChange={(e) => setCursoEditando(prev => prev ? { ...prev, marca: e.target.value } : null)}
                    placeholder="Ex: Laerdal"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input
                      id="modelo"
                      value={cursoEditando?.modelo || ""}
                      onChange={(e) => setCursoEditando(prev => prev ? { ...prev, modelo: e.target.value } : null)}
                      placeholder="Ex: Laerdal"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade *</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    value={cursoEditando?.quantidade || ""}
                    onChange={(e) => setCursoEditando(prev => prev ? { ...prev, quantidade: parseInt(e.target.value) || 0 } : null)}
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantidadeMínima *</Label>
                  <Input
                    id="quantidadeMínima"
                    type="number"
                    value={cursoEditando?.quantidadeMinima || ""}
                    onChange={(e) => setCursoEditando(prev => prev ? { ...prev, quantidadeMinima: parseInt(e.target.value) || 0 } : null)}
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="valorUnitario">Valor Unitário *</Label>
                  <Input
                    id="valorUnitario"
                    type="number"
                    value={cursoEditando?.valorUnitario || ""}
                    onChange={(e) => setCursoEditando(prev => prev ? { ...prev, valorUnitario: parseFloat(e.target.value) || 0 } : null)}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dataValidade">Data Validade</Label>
                  <Input
                    id="dataValidade"
                    type="date"
                    value={cursoEditando?.dataValidade || ""}
                    onChange={(e) => setCursoEditando(prev => prev ? { ...prev, dataValidade: e.target.value } : null)}
                    placeholder="YYYY-MM-DD"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="local">Local</Label>
                  <LocationCombobox
                    locais={locais}
                    value={cursoEditando?.local || ""}
                    onValueChange={(value) => setCursoEditando(prev => prev ? { ...prev, local: e.target } : null)}
                  placeholder="Ex: Laboratório Térreo"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={cursoEditando?.observacoes || ""}
                    onChange={(e) => setCursoEditando(prev => prev ? { ...prev, observacoes: e.target } : null)}
                    placeholder="Observações adicionais sobre o curso"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="ml-2 text-red-600">Erro ao exportar CSV</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 px-6 border-t">
            <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
            <Button variant="outline" onClick={handleExportarCSV}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>
    );
};

export default CursosTab;