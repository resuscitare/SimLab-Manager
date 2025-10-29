"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Copy, Users, Clock, DollarSign, Star } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface CategoriaCurso {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
}

interface CustoInstrutor {
  id: string;
  nome: string;
  pagamento: number;
  hospedagem: number;
  alimentacao: number;
  transporte: number;
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
  // Campos de Custo
  custosInstrutores: CustoInstrutor[];
  custoCoffeeBreak: number;
  custoDesgasteEquipamento: number;
  outrosCustos: Array<{ id: string; descricao: string; valor: number }>;
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
      const cursosSalvos = localStorage.getItem('simlab_cursos');
      if (cursosSalvos) {
        setCursos(JSON.parse(cursosSalvos));
      } else {
        const cursosMock: Curso[] = [
          { id: "1", nome: "Suporte Básico de Vida", descricao: "Curso completo de suporte básico de vida com técnicas de RCP", categoria: "enfermagem", modalidade: "presencial", duracao: 2, duracaoUnidade: "dias", cargaHoraria: 16, vagas: 30, vagasDisponiveis: 15, preco: 350, dataInicio: "2024-02-01", dataFim: "2024-02-02", local: "Laboratório Térreo", status: "ativo", observacoes: "Material didático incluído", notaMedia: 4.5, totalAvaliacoes: 20, custosInstrutores: [{id: '1', nome: 'Dr. Carlos', pagamento: 1500, hospedagem: 0, alimentacao: 50, transporte: 50}], custoCoffeeBreak: 150, custoDesgasteEquipamento: 100, outrosCustos: [] },
          { id: "2", nome: "Ventilação Mecânica", descricao: "Curso avançado de ventilação mecânica", categoria: "medicina", modalidade: "híbrido", duracao: 1, duracaoUnidade: "meses", cargaHoraria: 40, vagas: 20, vagasDisponiveis: 8, preco: 1200, dataInicio: "2024-03-01", dataFim: "2024-03-31", local: "Laboratório 1º Andar", status: "ativo", observacoes: "Aulas teóricas online e práticas presenciais", notaMedia: 4.8, totalAvaliacoes: 15, custosInstrutores: [{id: '1', nome: 'Dra. Ana', pagamento: 2500, hospedagem: 800, alimentacao: 300, transporte: 150}], custoCoffeeBreak: 300, custoDesgasteEquipamento: 500, outrosCustos: [{id: '1', descricao: 'Licença Software', valor: 200}] }
        ];
        setCursos(cursosMock);
        localStorage.setItem('simlab_cursos', JSON.stringify(cursosMock));
      }
      setCategorias(categoriasPredefinidas);
    } catch (error) {
      showError("Erro ao carregar dados dos cursos");
    } finally {
      setLoading(false);
    }
  };

  const formatarValorParaInput = (valor: number): string => {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const converterInputParaNumero = (valor: string): number => {
    const numeroLimpo = valor.replace(/\./g, '').replace(',', '.');
    return parseFloat(numeroLimpo) || 0;
  };

  const cursosFiltrados = cursos.filter(curso => {
    const matchSearch = curso.nome.toLowerCase().includes(searchTerm.toLowerCase()) || curso.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = categoriaFiltro === "todas" || curso.categoria === categoriaFiltro;
    const matchModalidade = modalidadeFiltro === "todas" || curso.modalidade === modalidadeFiltro;
    const matchStatus = statusFiltro === "todos" || curso.status === statusFiltro;
    return matchSearch && matchCategoria && matchModalidade && matchStatus;
  });

  const cursosOrdenados = [...cursosFiltrados].sort((a, b) => {
    switch (ordenacao) {
      case "nome": return a.nome.localeCompare(b.nome);
      case "vagas": return b.vagasDisponiveis - a.vagasDisponiveis;
      case "preco": return a.preco - b.preco;
      case "nota": return b.notaMedia - a.notaMedia;
      case "status": return a.status.localeCompare(b.status);
      default: return 0;
    }
  });

  const handleSalvarCurso = () => {
    if (!cursoEditando || !cursoEditando.nome || !cursoEditando.descricao || !cursoEditando.categoria) {
      showError("Preencha todos os campos obrigatórios");
      return;
    }
    try {
      let cursosAtualizados;
      if (cursoEditando.id) {
        cursosAtualizados = cursos.map(c => c.id === cursoEditando.id ? cursoEditando : c);
      } else {
        cursosAtualizados = [...cursos, { ...cursoEditando, id: Date.now().toString() }];
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
    if (window.confirm("Tem certeza que deseja excluir este curso?")) {
      try {
        const cursosAtualizados = cursos.filter(c => c.id !== id);
        setCursos(cursosAtualizados);
        localStorage.setItem('simlab_cursos', JSON.stringify(cursosAtualizados));
        showSuccess("Curso excluído com sucesso!");
      } catch (error) {
        showError("Erro ao excluir curso");
      }
    }
  };

  const handleDuplicarCurso = (id: string) => {
    const cursoOriginal = cursos.find(c => c.id === id);
    if (cursoOriginal) {
      const novoCurso = {
        ...cursoOriginal,
        id: Date.now().toString(),
        nome: `${cursoOriginal.nome} (Cópia)`,
        status: "inativo" as const,
        vagasDisponiveis: cursoOriginal.vagas,
      };
      const cursosAtualizados = [...cursos, novoCurso];
      setCursos(cursosAtualizados);
      localStorage.setItem('simlab_cursos', JSON.stringify(cursosAtualizados));
      showSuccess("Curso duplicado com sucesso!");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = { ativo: "bg-green-100 text-green-800", inativo: "bg-gray-100 text-gray-800", suspenso: "bg-yellow-100 text-yellow-800", encerrado: "bg-red-100 text-red-800" };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const textos = { ativo: "Ativo", inativo: "Inativo", suspenso: "Suspenso", encerrado: "Encerrado" };
    return textos[status as keyof typeof textos] || status;
  };

  const handleAdicionarCustoInstrutor = () => {
    if (!cursoEditando) return;
    const novoCusto: CustoInstrutor = {
      id: Date.now().toString(),
      nome: '',
      pagamento: 0,
      hospedagem: 0,
      alimentacao: 0,
      transporte: 0,
    };
    setCursoEditando({
      ...cursoEditando,
      custosInstrutores: [...cursoEditando.custosInstrutores, novoCusto]
    });
  };

  const handleRemoverCustoInstrutor = (id: string) => {
    if (!cursoEditando) return;
    setCursoEditando({
      ...cursoEditando,
      custosInstrutores: cursoEditando.custosInstrutores.filter(c => c.id !== id)
    });
  };

  const handleAtualizarCustoInstrutor = (id: string, campo: keyof CustoInstrutor, valor: string | number) => {
    if (!cursoEditando) return;
    const novosCustos = cursoEditando.custosInstrutores.map(c => {
      if (c.id === id) {
        return { ...c, [campo]: valor };
      }
      return c;
    });
    setCursoEditando({ ...cursoEditando, custosInstrutores: novosCustos });
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Ações</CardTitle>
          <CardDescription>Filtre e gerencie os cursos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input placeholder="Buscar por nome ou descrição..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
              <SelectTrigger className="w-full lg:w-48"><SelectValue placeholder="Categoria" /></SelectTrigger>
              <SelectContent><SelectItem value="todas">Todas as categorias</SelectItem>{categorias.map(cat => (<SelectItem key={cat.id} value={cat.id}>{cat.nome}</SelectItem>))}</SelectContent>
            </Select>
            <Select value={statusFiltro} onValueChange={setStatusFiltro}>
              <SelectTrigger className="w-full lg:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent><SelectItem value="todos">Todos</SelectItem><SelectItem value="ativo">Ativo</SelectItem><SelectItem value="inativo">Inativo</SelectItem><SelectItem value="suspenso">Suspenso</SelectItem><SelectItem value="encerrado">Encerrado</SelectItem></SelectContent>
            </Select>
            <Button onClick={() => { setCursoEditando({ id: '', nome: '', descricao: '', categoria: '', modalidade: 'presencial', duracao: 0, duracaoUnidade: 'horas', cargaHoraria: 0, vagas: 0, vagasDisponiveis: 0, preco: 0, dataInicio: '', dataFim: '', local: '', status: 'inativo', observacoes: '', notaMedia: 0, totalAvaliacoes: 0, custosInstrutores: [], custoCoffeeBreak: 0, custoDesgasteEquipamento: 0, outrosCustos: [] }); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />Novo Curso
            </Button>
          </div>
        </CardContent>
      </Card>

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
                    <TableCell><div className="flex items-center gap-2"><Users className="h-4 w-4 text-gray-500" /><span>{curso.vagasDisponiveis}/{curso.vagas}</span></div></TableCell>
                    <TableCell><div className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-gray-500" /><span>R$ {curso.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div></TableCell>
                    <TableCell><Badge className={getStatusBadge(curso.status)}>{getStatusText(curso.status)}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleDuplicarCurso(curso.id)}><Copy className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => { setCursoEditando(curso); setIsDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleExcluirCurso(curso.id)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{cursoEditando?.id ? "Editar Curso" : "Novo Curso"}</DialogTitle>
            <DialogDescription>{cursoEditando?.id ? "Edite as informações do curso" : "Cadastre um novo curso com seus custos"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <Card>
              <CardHeader><CardTitle>Informações Gerais</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="nome">Nome do Curso *</Label><Input id="nome" value={cursoEditando?.nome || ""} onChange={(e) => setCursoEditando(prev => prev ? { ...prev, nome: e.target.value } : null)} /></div>
                  <div className="space-y-2"><Label htmlFor="categoria">Categoria *</Label><Select value={cursoEditando?.categoria || ""} onValueChange={(value) => setCursoEditando(prev => prev ? { ...prev, categoria: value } : null)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{categorias.map(cat => (<SelectItem key={cat.id} value={cat.id}>{cat.nome}</SelectItem>))}</SelectContent></Select></div>
                </div>
                <div className="space-y-2"><Label htmlFor="descricao">Descrição *</Label><Textarea id="descricao" value={cursoEditando?.descricao || ""} onChange={(e) => setCursoEditando(prev => prev ? { ...prev, descricao: e.target.value } : null)} rows={2} /></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2"><Label htmlFor="vagas">Vagas Totais *</Label><Input id="vagas" type="number" value={cursoEditando?.vagas || ""} onChange={(e) => setCursoEditando(prev => prev ? { ...prev, vagas: parseInt(e.target.value) || 0 } : null)} /></div>
                  <div className="space-y-2">
                    <Label htmlFor="preco">Preço (R$) *</Label>
                    <Input 
                      id="preco" 
                      value={cursoEditando?.preco ? formatarValorParaInput(cursoEditando.preco) : ""} 
                      onChange={(e) => setCursoEditando(prev => prev ? { ...prev, preco: converterInputParaNumero(e.target.value) } : null)} 
                      placeholder="0,00"
                    />
                  </div>
                  <div className="space-y-2"><Label htmlFor="status">Status</Label><Select value={cursoEditando?.status || ""} onValueChange={(value) => setCursoEditando(prev => prev ? { ...prev, status: value as any } : null)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ativo">Ativo</SelectItem><SelectItem value="inativo">Inativo</SelectItem><SelectItem value="suspenso">Suspenso</SelectItem><SelectItem value="encerrado">Encerrado</SelectItem></SelectContent></Select></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Custos Fixos e Variáveis</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="font-semibold">Custos por Instrutor</Label>
                  <div className="space-y-4 mt-2">
                    {cursoEditando?.custosInstrutores.map((custo, index) => (
                      <Card key={custo.id} className="p-4 bg-muted/50">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Instrutor {index + 1}</h4>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoverCustoInstrutor(custo.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2 md:col-span-3">
                            <Label>Nome do Instrutor</Label>
                            <Input value={custo.nome} onChange={(e) => handleAtualizarCustoInstrutor(custo.id, 'nome', e.target.value)} placeholder="Nome do Instrutor" />
                          </div>
                          <div className="space-y-2">
                            <Label>Pagamento (R$)</Label>
                            <Input value={formatarValorParaInput(custo.pagamento)} onChange={(e) => handleAtualizarCustoInstrutor(custo.id, 'pagamento', converterInputParaNumero(e.target.value))} placeholder="0,00" />
                          </div>
                          <div className="space-y-2">
                            <Label>Hospedagem (R$)</Label>
                            <Input value={formatarValorParaInput(custo.hospedagem)} onChange={(e) => handleAtualizarCustoInstrutor(custo.id, 'hospedagem', converterInputParaNumero(e.target.value))} placeholder="0,00" />
                          </div>
                          <div className="space-y-2">
                            <Label>Alimentação (R$)</Label>
                            <Input value={formatarValorParaInput(custo.alimentacao)} onChange={(e) => handleAtualizarCustoInstrutor(custo.id, 'alimentacao', converterInputParaNumero(e.target.value))} placeholder="0,00" />
                          </div>
                          <div className="space-y-2">
                            <Label>Transporte (R$)</Label>
                            <Input value={formatarValorParaInput(custo.transporte)} onChange={(e) => handleAtualizarCustoInstrutor(custo.id, 'transporte', converterInputParaNumero(e.target.value))} placeholder="0,00" />
                          </div>
                        </div>
                      </Card>
                    ))}
                    <Button variant="outline" size="sm" className="mt-4" onClick={handleAdicionarCustoInstrutor}>
                      <Plus className="h-4 w-4 mr-2" />Adicionar Instrutor/Custo
                    </Button>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Label className="font-semibold">Custos Gerais do Curso</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <Label>Coffee Break (R$)</Label>
                      <Input value={cursoEditando?.custoCoffeeBreak ? formatarValorParaInput(cursoEditando.custoCoffeeBreak) : ""} onChange={(e) => setCursoEditando(prev => prev ? { ...prev, custoCoffeeBreak: converterInputParaNumero(e.target.value) } : null)} placeholder="0,00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Desgaste Equipamento (R$)</Label>
                      <Input value={cursoEditando?.custoDesgasteEquipamento ? formatarValorParaInput(cursoEditando.custoDesgasteEquipamento) : ""} onChange={(e) => setCursoEditando(prev => prev ? { ...prev, custoDesgasteEquipamento: converterInputParaNumero(e.target.value) } : null)} placeholder="0,00" />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Outros Custos (Materiais, etc.)</Label>
                  {cursoEditando?.outrosCustos.map((custo, index) => (
                    <div key={custo.id} className="flex gap-2 items-center mt-2">
                      <Input placeholder="Descrição (Ex: Sangue simulado)" value={custo.descricao} onChange={(e) => {
                        const novosCustos = [...cursoEditando.outrosCustos];
                        novosCustos[index].descricao = e.target.value;
                        setCursoEditando(prev => prev ? { ...prev, outrosCustos: novosCustos } : null);
                      }} />
                      <Input placeholder="Valor (R$)" value={custo.valor ? formatarValorParaInput(custo.valor) : ""} className="w-40" onChange={(e) => {
                        const novosCustos = [...cursoEditando.outrosCustos];
                        novosCustos[index].valor = converterInputParaNumero(e.target.value);
                        setCursoEditando(prev => prev ? { ...prev, outrosCustos: novosCustos } : null);
                      }} />
                      <Button variant="ghost" size="icon" onClick={() => {
                        const novosCustos = cursoEditando.outrosCustos.filter(c => c.id !== custo.id);
                        setCursoEditando(prev => prev ? { ...prev, outrosCustos: novosCustos } : null);
                      }}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                    const novoCusto = { id: Date.now().toString(), descricao: '', valor: 0 };
                    setCursoEditando(prev => prev ? { ...prev, outrosCustos: [...prev.outrosCustos, novoCusto] } : null);
                  }}><Plus className="h-4 w-4 mr-2" />Adicionar Custo</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDialogOpen(false); setCursoEditando(null); }}>Cancelar</Button>
            <Button onClick={handleSalvarCurso}>{cursoEditando?.id ? "Salvar Alterações" : "Adicionar Curso"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CursosTab;