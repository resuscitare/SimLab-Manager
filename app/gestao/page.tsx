'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import LayoutWrapper from '@/components/LayoutWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Activity,
  Search,
  Filter,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { showSuccess, showError } from '@/utils/toast';

interface CentroCusto {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  categoria: 'operacional' | 'academico' | 'administrativo' | 'manutencao' | 'outro';
  orcamentoMensal: number;
  gastoAtual: number;
  responsavel: string;
  status: 'ativo' | 'inativo';
  dataCriacao: string;
}

export default function GestaoPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [centrosCusto, setCentrosCusto] = useState<CentroCusto[]>([]);
  const [filteredCentros, setFilteredCentros] = useState<CentroCusto[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCentro, setEditingCentro] = useState<CentroCusto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState<string>('todas');

  const [formData, setFormData] = useState<Partial<CentroCusto>>({
    codigo: '',
    nome: '',
    descricao: '',
    categoria: 'operacional',
    orcamentoMensal: 0,
    gastoAtual: 0,
    responsavel: '',
    status: 'ativo'
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      loadCentrosCusto();
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    filterCentros();
  }, [searchTerm, filterCategoria, centrosCusto]);

  const loadCentrosCusto = () => {
    try {
      const saved = localStorage.getItem('centros_custo');
      if (saved) {
        const data = JSON.parse(saved);
        setCentrosCusto(data);
      } else {
        // Dados de exemplo
        const exemplos: CentroCusto[] = [
          {
            id: '1',
            codigo: 'CC001',
            nome: 'Simulação Clínica',
            descricao: 'Centro de custo para atividades de simulação clínica',
            categoria: 'academico',
            orcamentoMensal: 15000,
            gastoAtual: 12500,
            responsavel: 'Dra. Mariana Silva',
            status: 'ativo',
            dataCriacao: '2024-01-15'
          },
          {
            id: '2',
            codigo: 'CC002',
            nome: 'Manutenção de Equipamentos',
            descricao: 'Custos com manutenção e calibração de equipamentos',
            categoria: 'manutencao',
            orcamentoMensal: 8000,
            gastoAtual: 6200,
            responsavel: 'João Santos',
            status: 'ativo',
            dataCriacao: '2024-01-15'
          },
          {
            id: '3',
            codigo: 'CC003',
            nome: 'Material de Consumo',
            descricao: 'Materiais descartáveis e consumíveis',
            categoria: 'operacional',
            orcamentoMensal: 5000,
            gastoAtual: 4800,
            responsavel: 'Ana Costa',
            status: 'ativo',
            dataCriacao: '2024-02-01'
          }
        ];
        setCentrosCusto(exemplos);
        localStorage.setItem('centros_custo', JSON.stringify(exemplos));
      }
    } catch (error) {
      showError('Erro ao carregar centros de custo');
    }
  };

  const filterCentros = () => {
    let filtered = centrosCusto;

    if (searchTerm) {
      filtered = filtered.filter(centro =>
        centro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        centro.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        centro.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategoria && filterCategoria !== 'todas') {
      filtered = filtered.filter(centro => centro.categoria === filterCategoria);
    }

    setFilteredCentros(filtered);
  };

  const handleSave = () => {
    if (!formData.codigo || !formData.nome || !formData.responsavel) {
      showError('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      if (editingCentro) {
        const updated = centrosCusto.map(c =>
          c.id === editingCentro.id ? { ...editingCentro, ...formData } : c
        );
        setCentrosCusto(updated);
        localStorage.setItem('centros_custo', JSON.stringify(updated));
        showSuccess('Centro de custo atualizado com sucesso!');
      } else {
        const novo: CentroCusto = {
          id: Date.now().toString(),
          codigo: formData.codigo!,
          nome: formData.nome!,
          descricao: formData.descricao || '',
          categoria: formData.categoria as any,
          orcamentoMensal: Number(formData.orcamentoMensal) || 0,
          gastoAtual: Number(formData.gastoAtual) || 0,
          responsavel: formData.responsavel!,
          status: formData.status as any,
          dataCriacao: new Date().toISOString().split('T')[0]
        };
        const updated = [...centrosCusto, novo];
        setCentrosCusto(updated);
        localStorage.setItem('centros_custo', JSON.stringify(updated));
        showSuccess('Centro de custo criado com sucesso!');
      }

      handleCloseDialog();
    } catch (error) {
      showError('Erro ao salvar centro de custo');
    }
  };

  const handleEdit = (centro: CentroCusto) => {
    setEditingCentro(centro);
    setFormData(centro);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este centro de custo?')) {
      const updated = centrosCusto.filter(c => c.id !== id);
      setCentrosCusto(updated);
      localStorage.setItem('centros_custo', JSON.stringify(updated));
      showSuccess('Centro de custo excluído com sucesso!');
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCentro(null);
    setFormData({
      codigo: '',
      nome: '',
      descricao: '',
      categoria: 'operacional',
      orcamentoMensal: 0,
      gastoAtual: 0,
      responsavel: '',
      status: 'ativo'
    });
  };

  const calcularTotais = () => {
    const total = centrosCusto.reduce((acc, c) => ({
      orcamento: acc.orcamento + c.orcamentoMensal,
      gasto: acc.gasto + c.gastoAtual
    }), { orcamento: 0, gasto: 0 });
    return total;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPercentualGasto = (gasto: number, orcamento: number) => {
    if (orcamento === 0) return 0;
    return (gasto / orcamento) * 100;
  };

  const getCategoriaLabel = (categoria: string) => {
    const labels = {
      operacional: 'Operacional',
      academico: 'Acadêmico',
      administrativo: 'Administrativo',
      manutencao: 'Manutenção',
      outro: 'Outro'
    };
    return labels[categoria as keyof typeof labels] || categoria;
  };

  if (!isAuthenticated) {
    return null;
  }

  const totais = calcularTotais();

  return (
    <LayoutWrapper>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Centro de Custos</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Centro de Custo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCentro ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}
                </DialogTitle>
                <DialogDescription>
                  Preencha as informações do centro de custo
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código *</Label>
                    <Input
                      id="codigo"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                      placeholder="Ex: CC001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'ativo' | 'inativo') => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Simulação Clínica"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value: any) => setFormData({ ...formData, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operacional">Operacional</SelectItem>
                      <SelectItem value="academico">Acadêmico</SelectItem>
                      <SelectItem value="administrativo">Administrativo</SelectItem>
                      <SelectItem value="manutencao">Manutenção</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    rows={3}
                    placeholder="Descreva o propósito deste centro de custo..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orcamento">Orçamento Mensal (R$)</Label>
                    <Input
                      id="orcamento"
                      type="number"
                      value={formData.orcamentoMensal}
                      onChange={(e) => setFormData({ ...formData, orcamentoMensal: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gasto">Gasto Atual (R$)</Label>
                    <Input
                      id="gasto"
                      type="number"
                      value={formData.gastoAtual}
                      onChange={(e) => setFormData({ ...formData, gastoAtual: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável *</Label>
                  <Input
                    id="responsavel"
                    value={formData.responsavel}
                    onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                    placeholder="Ex: Dr. João Silva"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  {editingCentro ? 'Atualizar' : 'Criar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orçamento Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totais.orcamento)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Orçamento mensal consolidado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gasto Atual</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totais.gasto)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {getPercentualGasto(totais.gasto, totais.orcamento).toFixed(1)}% do orçamento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totais.orcamento - totais.gasto)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {centrosCusto.length} centros de custo ativos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    className="pl-10"
                    placeholder="Nome, código ou responsável..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setSearchTerm('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="filter-categoria">Categoria</Label>
                <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                  <SelectTrigger id="filter-categoria">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="operacional">Operacional</SelectItem>
                    <SelectItem value="academico">Acadêmico</SelectItem>
                    <SelectItem value="administrativo">Administrativo</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(searchTerm || filterCategoria !== 'todas') && (
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterCategoria('todas');
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpar Filtros
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lista de Centros de Custo */}
        <Card>
          <CardHeader>
            <CardTitle>Centros de Custo</CardTitle>
            <CardDescription>
              {filteredCentros.length} {filteredCentros.length === 1 ? 'registro encontrado' : 'registros encontrados'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCentros.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum centro de custo encontrado</p>
                </div>
              ) : (
                filteredCentros.map((centro) => {
                  const percentual = getPercentualGasto(centro.gastoAtual, centro.orcamentoMensal);
                  const isOverBudget = percentual > 100;
                  const isNearLimit = percentual > 85 && percentual <= 100;

                  return (
                    <div
                      key={centro.id}
                      className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{centro.nome}</h3>
                            <Badge variant="outline">{centro.codigo}</Badge>
                            <Badge
                              variant={centro.status === 'ativo' ? 'default' : 'secondary'}
                            >
                              {centro.status === 'ativo' ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{centro.descricao}</p>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Categoria</p>
                              <p className="font-medium">{getCategoriaLabel(centro.categoria)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Responsável</p>
                              <p className="font-medium">{centro.responsavel}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Orçamento</p>
                              <p className="font-medium">{formatCurrency(centro.orcamentoMensal)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Gasto Atual</p>
                              <div className="flex items-center gap-2">
                                <p className={`font-medium ${isOverBudget ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : ''}`}>
                                  {formatCurrency(centro.gastoAtual)}
                                </p>
                                {isOverBudget ? (
                                  <TrendingUp className="h-4 w-4 text-red-600" />
                                ) : isNearLimit ? (
                                  <TrendingUp className="h-4 w-4 text-yellow-600" />
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Utilização do orçamento</span>
                              <span className={`font-medium ${isOverBudget ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : ''}`}>
                                {percentual.toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  isOverBudget
                                    ? 'bg-red-600'
                                    : isNearLimit
                                    ? 'bg-yellow-500'
                                    : 'bg-green-600'
                                }`}
                                style={{ width: `${Math.min(percentual, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(centro)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(centro.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutWrapper>
  );
}
