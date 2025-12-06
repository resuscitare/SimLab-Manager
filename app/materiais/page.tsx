"use client";

import { useState, useEffect, ChangeEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Upload, Download, Save, FileSpreadsheet, Search, Pencil } from "lucide-react";
import LayoutWrapper from "@/components/LayoutWrapper";
import { useAuthStore } from "@/store/authStore";

interface MaterialItem {
  id: string;
  codigo: string;
  nome: string;
  modelo: string;
  marca: string;
  quantidadePadrao: string;
  quantidadeDisponivel: string;
  dataValidade: string;
  local: string;
  observacoes: string;
}

type MaterialStatus = "Disponível" | "Estoque Baixo" | "Vencendo" | "Vencido";

export default function MateriaisPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [materiais, setMateriais] = useState<MaterialItem[]>([]);
  const [locais, setLocais] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lab, setLab] = useState("CSR");
  const [sala, setSala] = useState("Sala 1");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router, isAuthenticated]);

  useEffect(() => {
    try {
      const savedMateriais = localStorage.getItem('materiais_inventario');
      if (savedMateriais) {
        setMateriais(JSON.parse(savedMateriais));
      }
      const savedLocais = localStorage.getItem('simlab_locais');
      if (savedLocais) {
        setLocais(JSON.parse(savedLocais));
      }
    } catch (e) {
      console.error("Erro ao carregar dados do inventário.");
    } finally {
      setLoading(false);
    }
  }, []);

  const getMaterialStatus = (item: MaterialItem): { text: MaterialStatus; className: string } => {
    const today = new Date();
    const validade = item.dataValidade ? new Date(item.dataValidade) : null;

    if (validade && validade < today) {
      return { text: "Vencido", className: "bg-red-100 text-red-800 border-red-200" };
    }
    if (validade) {
      const diffTime = validade.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 30) {
        return { text: "Vencendo", className: "bg-orange-100 text-orange-800 border-orange-200" };
      }
    }
    if (parseInt(item.quantidadeDisponivel, 10) <= 5) {
      return { text: "Estoque Baixo", className: "bg-yellow-100 text-yellow-800 border-yellow-200" };
    }
    return { text: "Disponível", className: "bg-green-100 text-green-800 border-green-200" };
  };

  const filteredMateriais = useMemo(() => {
    return materiais.filter(item =>
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.local.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [materiais, searchTerm]);

  const handleAddItem = () => {
    setMateriais([
      ...materiais,
      {
        id: Date.now().toString(),
        codigo: "",
        nome: "",
        modelo: "",
        marca: "",
        quantidadePadrao: "0",
        quantidadeDisponivel: "0",
        dataValidade: "",
        local: "",
        observacoes: ""
      }
    ]);
  };

  const handleItemChange = (id: string, field: keyof MaterialItem, value: string) => {
    setMateriais(
      materiais.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setMateriais(materiais.filter(item => item.id !== id));
  };

  const handleSave = () => {
    try {
      localStorage.setItem('materiais_inventario', JSON.stringify(materiais));
      alert("Inventário de materiais salvo com sucesso!");
    } catch (e) {
      alert("Erro ao salvar o inventário.");
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <LayoutWrapper>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Materiais</h1>
            <p className="text-gray-600">Gerencie o inventário central de materiais do laboratório.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros e Ações</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="laboratorio">Laboratório</Label>
                <Input id="laboratorio" value={lab} onChange={(e) => setLab(e.target.value)} placeholder="Ex: CSR" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sala">Sala</Label>
                <Input id="sala" value={sala} onChange={(e) => setSala(e.target.value)} placeholder="Ex: Sala 1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="search">Busca Rápida</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por nome, marca, local..." className="pl-8" />
                </div>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <Button variant="outline">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Template
              </Button>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventário de Materiais</CardTitle>
            <CardDescription>Adicione, edite ou remova itens do inventário.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Material/Equipamento</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Qtd. Disp.</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMateriais.map((item) => {
                    const status = getMaterialStatus(item);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge variant="outline" className={status.className}>{status.text}</Badge>
                        </TableCell>
                        <TableCell>
                          <Input className="h-8" value={item.nome} onChange={(e) => handleItemChange(item.id, 'nome', e.target.value)} />
                        </TableCell>
                        <TableCell>
                          <Input className="h-8" value={item.marca} onChange={(e) => handleItemChange(item.id, 'marca', e.target.value)} />
                        </TableCell>
                        <TableCell>
                          <Input className="h-8" value={item.modelo} onChange={(e) => handleItemChange(item.id, 'modelo', e.target.value)} />
                        </TableCell>
                        <TableCell>
                          <Input className="h-8" value={item.local} onChange={(e) => handleItemChange(item.id, 'local', e.target.value)} />
                        </TableCell>
                        <TableCell><Input className="h-8 w-20" type="number" value={item.quantidadeDisponivel} onChange={(e) => handleItemChange(item.id, 'quantidadeDisponivel', e.target.value)} /></TableCell>
                        <TableCell><Input className="h-8" type="date" value={item.dataValidade} onChange={(e) => handleItemChange(item.id, 'dataValidade', e.target.value)} /></TableCell>
                        <TableCell><Input className="h-8" value={item.codigo} onChange={(e) => handleItemChange(item.id, 'codigo', e.target.value)} placeholder="123456" /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} className="h-8 w-8 text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleAddItem}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Item
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutWrapper>
  );
}
