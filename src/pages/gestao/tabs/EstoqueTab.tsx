"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Filter, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Edit,
  Trash2,
  Download,
  Upload,
  ArrowUpDown,
  Eye,
  Calculator
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { showSuccess, showError } from "@/utils/toast";
import { LocationCombobox } from "@/components/LocationCombobox";
import { Local } from "@/types";

interface EstoqueItem {
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

interface Categoria {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
}

const EstoqueTab = () => {
  const [itens, setItens] = useState<EstoqueItem[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [locais, setLocais] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("nome");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemEditando, setItemEditando] = useState<EstoqueItem | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Categorias pré-definidas
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
      // Carregar itens do estoque
      const itensSalvos = localStorage.getItem('estoque_centro_custos');
      if (itensSalvos) {
        const itensParseados = JSON.parse(itensSalvos);
        setItens(itensParseados.map(item => ({
          ...item,
          status: calcularStatus(item),
          valorTotal: item.quantidade * item.valorUnitario
        })));
      } else {
        // Dados mock para demonstração
        const itensMock: EstoqueItem[] = [
          {
            id: "1",
            codigo: "MED001",
            nome: "Adrenalina 1mg/1mL",
            categoria: "medicamentos",
            marca: "Hypofarma",
            modelo: "Ampola 1mL",
            quantidade: 50,
            quantidadeMinima: 10,
            unidade: "ampolas",
            valorUnitario: 15.50,
            valorTotal: 775,
            local: "Laboratório Térreo > Armário de Medicamentos > Gaveta A",
            dataValidade: "2025-12-31",
            status: "disponivel",
            observacoes: "Armazenar em temperatura ambiente"
          },
          {
            id: "2",
            codigo: "EQP001",
            nome: "Simulador Adulto Laerdal",
            categoria: "equipamentos",
            marca: "Laerdal",
            modelo: "SimMan 3G",
            quantidade: 2,
            quantidadeMinima: 1,
            unidade: "unidades",
            valorUnitario: 45000,
            valorTotal: 90000,
            local: "Laboratório Térreo > Sala de Simulação A",
            dataValidade: "",
            status: "disponivel",
            observacoes: "Equipamento de alta fidelidade"
          },
          {
            id: "3",
            codigo: "MAT001",
            nome: "Luvas de Procedimento Tamanho M",
            categoria: "materiais",
            marca: "Medline",
            modelo: "Curva Texturizada",
            quantidade: 100,
            quantidadeMinima: 50,
            unidade: "pares",
            valorUnitario: 2.50,
            valorTotal: 250,
            local: "Laboratório Térreo > Armário de Materiais > Prateleira B",
            dataValidade: "2025-06-30",
            status: "baixo",
            observacoes: "Estoque abaixo do mínimo recomendado"
          },
          {
            id: "4",
            codigo: "INS001",
            nome: "Álcool 70% 1L",
            categoria: "insumos",
            marca: "Dinâmica",
            modelo: "Antisséptico",
            quantidade: 20,
            quantidadeMinima: 10,
            unidade: "litros",
            valorUnitario: 8.90,
            valorTotal: 178,
            local: "Laboratório Térreo > Armário de Insumos > Prateleira C",
            dataValidade: "2026-12-31",
            status: "disponivel",
            observacoes: "Para uso em procedimentos"
          }
        ];
        setItens(itensMock);
      }

      // Carregar locais
      const locaisSalvos = localStorage.getItem('simlab_locais');
      if (locaisSalvos) {
        setLocais(JSON.parse(locaisSalvos));
      }

      setCategorias(categoriasPredefinidas);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      showError("Erro ao carregar dados do estoque");
      setLoading(false);
    }
  };

  const calcularStatus = (item: EstoqueItem): EstoqueItem["status"] => {
    if (item.dataValidade) {
      const dataValidade = new Date(item.dataValidade);
      const hoje = new Date();
      const diasParaVencer = Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diasParaVencer < 0) return "vencido";
      if (diasParaVencer <= 30) return "vencendo";
    }
    
    if (item.quantidade <= item.quantidadeMinima) return "baixo";
    return "disponivel";
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      disponivel: "bg-green-100 text-green-800 border-green-200",
      baixo: "bg-yellow-100 text-yellow-800 border-yellow-200",
      vencendo: "bg-orange-100 text-orange-800 border-orange-200",
      vencido: "bg-red-100 text-red-800 border-red-200"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "disponivel":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "baixo":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "vencendo":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "vencido":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    const textos = {
      disponivel: "Disponível",
      baixo: "Estoque Baixo",
      vencendo: "Vencendo",
      vencido: "Vencido"
    };
    return textos[status as keyof typeof textos] || status;
  };

  const itensFiltrados = itens.filter(item => {
    const matchSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.marca.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchCategoria = categoriaFiltro === "todas" || item.categoria === categoriaFiltro;
    const matchStatus = statusFiltro === "todos" || item.status === statusFiltro;
    
    return matchSearch && matchCategoria && matchStatus;
  });

  const itensOrdenados = [...itensFiltrados].sort((a, b) => {
    switch (ordenacao) {
      case "nome":
        return a.nome.localeCompare(b.nome);
      case "codigo":
        return a.codigo.localeCompare(b.codigo);
      case "quantidade":
        return b.quantidade - a.quantidade;
      case "valor":
        return b.valorTotal - a.valorTotal;
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const estatisticas = {
    total: itens.length,
    disponivel: itens.filter(item => item.status === "disponivel").length,
    baixo: itens.filter(item => item.status === "baixo").length,
    vencendo: itens.filter(item => item.status === "vencendo").length,
    vencido: itens.filter(item => item.status === "vencido").length,
    valorTotal: itens.reduce((acc, item) => acc + item.valorTotal, 0),
    categorias: categorias.map(cat => ({
      ...cat,
      quantidade: itens.filter(item => item.categoria === cat.id).length
    }))
  };

  const handleSalvarItem = (item: EstoqueItem) => {
    try {
      const itensAtualizados = itens.map(i => i.id === item.id ? item : i);
      setItens(itensAtualizados);
      localStorage.setItem('estoque_centro_custos', JSON.stringify(itensAtualizados));
      showSuccess("Item atualizado com sucesso!");
    } catch (error) {
      showError("Erro ao salvar item");
    }
  };

  const handleExcluirItem = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este item?")) {
      try {
        const itensAtualizados = itens.filter(item => item.id !== id);
        setItens(itensAtualizados);
        localStorage.setItem('estoque_centro_custos', JSON.stringify(itensAtualizados));
        showSuccess("Item excluído com sucesso!");
      } catch (error) {
        showError("Erro ao excluir item");
      }
    }
  };

  const handleImportarCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          showError("Arquivo CSV inválido ou vazio");
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim());
        const novosItens: EstoqueItem[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          if (values.length >= headers.length) {
            const item: any = {};
            headers.forEach((header, index) => {
              const key = header.toLowerCase().replace(/\s+/g, '_');
              item[key] = values[index] || '';
            });

            // Converter campos numéricos
            item.quantidade = parseInt(item.quantidade) || 0;
            item.quantidadeMinima = parseInt(item.quantidade_minima) || 0;
            item.valorUnitario = parseFloat(item.valor_unitario) || 0;

            // Gerar ID se não existir
            if (!item.id) {
              item.id = Date.now().toString();
            }

            // Definir valores padrão
            item.status = "disponivel";
            item.valorTotal = item.quantidade * item.valorUnitario;

            novosItens.push(item as EstoqueItem);
          }
        }

        const itensAtualizados = [...itens, ...novosItens];
        setItens(itensAtualizados);
        localStorage.setItem('estoque_centro_custos', JSON.stringify(itensAtualizados));
        showSuccess(`${novosItens.length} itens importados com sucesso!`);
        setIsImportDialogOpen(false);
      } catch (error) {
        showError("Erro ao processar arquivo CSV");
        console.error(error);
      }
    };

    reader.readAsText(file);
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
          item.valorUnitario.toFixed(2),
          item.valorTotal.toFixed(2),
          item.local,
          item.dataValidade,
          item.status,
          item.observacoes
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `estoque_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

  const handleSalvarDialog = () => {
    if (!itemEditando) return;

    if (itemEditando.id) {
      // Editar item existente
      handleSalvarItem(itemEditando);
    } else {
      // Criar novo item
      const novoItem: EstoqueItem = {
        ...itemEditando,
        id: Date.now().toString(),
        status: "disponivel",
        valorTotal: itemEditando.quantidade * itemEditando.valorUnitario
      };
      handleSalvarItem(novoItem);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.total}</div>
            <p className="text-xs text-gray-500">Itens no estoque</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estatisticas.disponivel}</div>
            <p className="text-xs text-gray-500">Itens disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{estatisticas.baixo}</div>
            <p className="text-xs text-gray-500">Abaixo do mínimo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencendo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{estatisticas.vencendo}</div>
            <p className="text-xs text-gray-500">Próximos ao vencimento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{estatisticas.vencido}</div>
            <p className="text-xs text-gray-500">Vencidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Ações */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Ações</CardTitle>
          <CardDescription>Filtre e gerencie os itens do estoque</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por nome, código ou marca..."
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

            <Select value={statusFiltro} onValueChange={setStatusFiltro}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="baixo">Estoque Baixo</SelectItem>
                <SelectItem value="vencendo">Vencendo</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ordenacao} onValueChange={setOrdenacao}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nome">Nome</SelectItem>
                <SelectItem value="codigo">Código</SelectItem>
                <SelectItem value="quantidade">Quantidade</SelectItem>
                <SelectItem value="valor">Valor</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Importar CSV
              </Button>
              <Button variant="outline" onClick={handleExportarCSV}>
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
              <Button onClick={() => handleAbrirDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Item
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Itens */}
      <Card>
        <CardHeader>
          <CardTitle>Itens em Estoque</CardTitle>
          <CardDescription>Gerencie todos os itens do centro de custos</CardDescription>
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
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Valor Unit.</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itensOrdenados.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <Badge className={getStatusBadge(item.status)}>
                          {getStatusText(item.status)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.codigo}</TableCell>
                    <TableCell>{item.nome}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-50">
                        {categorias.find(cat => cat.id === item.categoria)?.nome || item.categoria}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={item.quantidade <= item.quantidadeMinima ? "text-yellow-600" : ""}>
                          {item.quantidade}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.unidade}
                        </span>
                        {item.quantidade <= item.quantidadeMinima && (
                          <span className="text-xs text-yellow-600">(min: {item.quantidadeMinima})</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>R$ {item.valorUnitario.toFixed(2)}</TableCell>
                    <TableCell className="font-medium">R$ {item.valorTotal.toFixed(2)}</TableCell>
                    <TableCell className="max-w-xs truncate" title={item.local}>
                      {item.local}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleAbrirDialog(item)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleAbrirDialog(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleExcluirItem(item.id)} className="text-red-600">
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

      {/* Dialog de Adicionar/Editar Item */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {itemEditando?.id ? "Editar Item" : "Novo Item"}
            </DialogTitle>
            <DialogDescription>
              {itemEditando?.id ? "Edite as informações do item existente" : "Cadastre um novo item no estoque"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  value={itemEditando?.codigo || ""}
                  onChange={(e) => setItemEditando(prev => prev ? { ...prev, codigo: e.target.value } : null)}
                  placeholder="Ex: MED001"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={itemEditando?.nome || ""}
                  onChange={(e) => setItemEditando(prev => prev ? { ...prev, nome: e.target.value } : null)}
                  placeholder="Ex: Adrenalina 1mg/1mL"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Select value={itemEditando?.categoria || ""} onValueChange={(value) => setItemEditando(prev => prev ? { ...prev, categoria: value } : null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
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
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  value={itemEditando?.marca || ""}
                  onChange={(e) => setItemEditando(prev => prev ? { ...prev, marca: e.target.value } : null)}
                  placeholder="Ex: Laerdal"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="modelo"
                  value={itemEditando?.modelo || ""}
                  onChange={(e) => setItemEditando(prev => prev ? { ...prev, modelo: e.target.value } : null)}
                  placeholder="Ex: SimMan 3G"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade</Label>
                <Input
                  id="unidade"
                  value={itemEditando?.unidade || ""}
                  onChange={(e) => setItemEditando(prev => prev ? { ...prev, unidade: e.target.value } : null)}
                  placeholder="Ex: ampolas, unidades"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade *</Label>
                <Input
                  id="quantidade"
                  type="number"
                  value={itemEditando?.quantidade || 0}
                  onChange={(e) => setItemEditando(prev => prev ? { ...prev, quantidade: parseInt(e.target.value) || 0 } : null)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantidadeMinima">Quantidade Mínima *</Label>
                <Input
                  id="quantidadeMinima"
                  type="number"
                  value={itemEditando?.quantidadeMinima || 0}
                  onChange={(e) => setItemEditando(prev => prev ? { ...prev, quantidadeMinima: parseInt(e.target.value) || 0 } : null)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valorUnitario">Valor Unitário (R$) *</Label>
                <Input
                  id="valorUnitario"
                  type="number"
                  step="0.01"
                  value={itemEditando?.valorUnitario || 0}
                  onChange={(e) => setItemEditando(prev => prev ? { ...prev, valorUnitario: parseFloat(e.target.value) || 0 } : null)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataValidade">Data de Validade</Label>
                <Input
                  id="dataValidade"
                  type="date"
                  value={itemEditando?.dataValidade || ""}
                  onChange={(e) => setItemEditando(prev => prev ? { ...prev, dataValidade: e.target.value } : null)}
                  placeholder="DD/MM/AAAA"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="local">Local</Label>
                <LocationCombobox
                  locais={locais}
                  value={itemEditando?.local || ""}
                  onValueChange={(value) => setItemEditando(prev => prev ? { ...prev, local: value } : null)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={itemEditando?.observacoes || ""}
                onChange={(e) => setItemEditando(prev => prev ? { ...prev, observacoes: e.target.value } : null)}
                placeholder="Observações adicionais sobre o item"
                rows={3}
              />
            </div>

            {itemEditando && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Valor Total:</span>
                    <div className="text-lg font-bold">R$ {(itemEditando.quantidade * itemEditando.valorUnitario).toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(calcularStatus(itemEditando))}
                      <Badge className={getStatusBadge(calcularStatus(itemEditando))}>
                        {getStatusText(calcularStatus(itemEditando))}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
        
        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          <Button variant="outline" onClick={handleFecharDialog}>
            Cancelar
          </Button>
          <Button onClick={handleSalvarDialog}>
            {itemEditando?.id ? "Salvar Alterações" : "Adicionar Item"}
          </Button>
        </div>
      </Dialog>

      {/* Dialog de Importação */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Importar Itens via CSV</DialogTitle>
            <DialogDescription>
              Importe múltiplos itens de uma vez usando um arquivo CSV
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Formato do Arquivo CSV</Label>
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <p>O arquivo CSV deve conter as seguintes colunas:</p>
                <code className="block mt-2 text-xs bg-white p-2 rounded">
                  codigo,nome,categoria,marca,modelo,quantidade,quantidade_minima,unidade,valor_unitario,local,data_validade,observacoes
                </code>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="csvFile">Selecione o arquivo CSV</Label>
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleImportarCSV}
                className="cursor-pointer"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 px-6 py-4 border-t">
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EstoqueTab;