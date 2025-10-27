"use client";

import { useState, useEffect, ChangeEvent, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Upload, Download, Save, FileSpreadsheet, Search, Pencil } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";
import Papa from "papaparse";
import * as XLSX from 'xlsx';
import { isPast, differenceInDays } from 'date-fns';

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

const Materiais = () => {
  const [materiais, setMateriais] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lab, setLab] = useState("CSR");
  const [sala, setSala] = useState("Sala 1");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    try {
      const savedMateriais = localStorage.getItem('materiais_inventario');
      if (savedMateriais) {
        setMateriais(JSON.parse(savedMateriais));
      }
    } catch (e) {
      showError("Erro ao carregar materiais do inventário.");
    } finally {
      setLoading(false);
    }
  }, []);

  const getMaterialStatus = (item: MaterialItem): { text: MaterialStatus; className: string } => {
    if (item.dataValidade && isPast(new Date(item.dataValidade))) {
      return { text: "Vencido", className: "bg-red-100 text-red-800 border-red-200" };
    }
    if (item.dataValidade && differenceInDays(new Date(item.dataValidade), new Date()) <= 30) {
      return { text: "Vencendo", className: "bg-orange-100 text-orange-800 border-orange-200" };
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
      showSuccess("Inventário de materiais salvo com sucesso!");
    } catch (e) {
      showError("Erro ao salvar o inventário.");
    }
  };

  const handleFileImport = (data: any[]) => {
    const newMateriais = data.map((row: any, index: number) => ({
      id: Date.now().toString() + index,
      codigo: row["Código"] || "",
      nome: row["Material/Equipamento"] || "",
      modelo: row["Nome do Modelo"] || "",
      marca: row["Marca"] || "",
      quantidadePadrao: String(row["Quantidade Padrão"] || "0"),
      quantidadeDisponivel: String(row["Quantidade Disponível"] || "0"),
      dataValidade: row["Data de Validade"] || "",
      local: row["Local"] || "",
      observacoes: row["Observações"] || ""
    }));
    setMateriais(prev => [...prev, ...newMateriais]);
    showSuccess(`${newMateriais.length} itens importados.`);
  };

  const handleCSVFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => handleFileImport(results.data),
        error: (error) => {
          showError("Erro ao processar o arquivo CSV.");
          console.error(error);
        }
      });
    }
  };

  const handleXLSXFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          handleFileImport(json);
        } catch (err) {
          showError("Erro ao processar o arquivo XLSX.");
          console.error(err);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [
      "Código",
      "Material/Equipamento", 
      "Nome do Modelo", 
      "Marca", 
      "Quantidade Padrão", 
      "Quantidade Disponível", 
      "Data de Validade", 
      "Local",
      "Observações"
    ];
    const sampleRow = [
      "123456789",
      "Desfibrilador",
      "HeartStart XL+",
      "Philips",
      "1",
      "1",
      "N/A",
      "Armário A, Gaveta 2",
      "Localizado na Sala A"
    ];
    
    const data = [headers, sampleRow];
    
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "template_materiais.xlsx");
  };

  if (loading) return <p>Carregando...</p>;

  return (
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
            <Button variant="outline" onClick={handleDownloadTemplate}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Template
            </Button>
            <Button asChild variant="outline">
              <label htmlFor="xlsx-upload" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Importar
                <input type="file" id="xlsx-upload" accept=".xlsx, .xls, .csv" className="hidden" onChange={handleXLSXFileChange} />
              </label>
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
                        <div className="font-medium">{item.nome}</div>
                        <div className="text-xs text-muted-foreground">{item.marca} - {item.modelo}</div>
                      </TableCell>
                      <TableCell><Input className="h-8" value={item.local} onChange={(e) => handleItemChange(item.id, 'local', e.target.value)} placeholder="Armário A, Gaveta B" /></TableCell>
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
  );
};

export default Materiais;