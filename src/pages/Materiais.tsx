"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Upload, Download, Save, FileSpreadsheet } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";
import Papa from "papaparse";
import * as XLSX from 'xlsx';

interface MaterialItem {
  id: string;
  nome: string;
  modelo: string;
  marca: string;
  quantidadePadrao: string;
  quantidadeDisponivel: string;
  dataValidade: string;
  observacoes: string;
}

const Materiais = () => {
  const [materiais, setMateriais] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleAddItem = () => {
    setMateriais([
      ...materiais,
      {
        id: Date.now().toString(),
        nome: "",
        modelo: "",
        marca: "",
        quantidadePadrao: "0",
        quantidadeDisponivel: "0",
        dataValidade: "",
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

  const handleCSVFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const newMateriais = results.data.map((row: any, index: number) => ({
            id: Date.now().toString() + index,
            nome: row["Material/Equipamento"] || "",
            modelo: row["Nome do Modelo"] || "",
            marca: row["Marca"] || "",
            quantidadePadrao: row["Quantidade Padrão"] || "0",
            quantidadeDisponivel: row["Quantidade Disponível"] || "0",
            dataValidade: row["Data de Validade"] || "",
            observacoes: row["Observações"] || ""
          }));
          setMateriais(prev => [...prev, ...newMateriais]);
          showSuccess(`${newMateriais.length} itens importados do CSV.`);
        },
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
          
          const newMateriais = json.map((row: any, index: number) => ({
            id: Date.now().toString() + index,
            nome: row["Material/Equipamento"] || "",
            modelo: row["Nome do Modelo"] || "",
            marca: row["Marca"] || "",
            quantidadePadrao: String(row["Quantidade Padrão"] || "0"),
            quantidadeDisponivel: String(row["Quantidade Disponível"] || "0"),
            dataValidade: row["Data de Validade"] || "",
            observacoes: row["Observações"] || ""
          }));

          setMateriais(prev => [...prev, ...newMateriais]);
          showSuccess(`${newMateriais.length} itens importados do XLSX.`);
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
      "Material/Equipamento", 
      "Nome do Modelo", 
      "Marca", 
      "Quantidade Padrão", 
      "Quantidade Disponível", 
      "Data de Validade", 
      "Observações"
    ];
    const sampleRow = [
      "Desfibrilador",
      "HeartStart XL+",
      "Philips",
      "1",
      "1",
      "N/A",
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
          <CardTitle>Importar / Exportar</CardTitle>
          <CardDescription>
            Importe um arquivo XLSX ou CSV para adicionar itens em massa. Use o template para garantir a formatação correta.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button variant="outline" onClick={handleDownloadTemplate}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Baixar Template XLSX
          </Button>
          <Button asChild variant="outline">
            <label htmlFor="xlsx-upload">
              <Upload className="w-4 h-4 mr-2" />
              Importar XLSX
              <input type="file" id="xlsx-upload" accept=".xlsx, .xls" className="hidden" onChange={handleXLSXFileChange} />
            </label>
          </Button>
          <Button asChild variant="outline">
            <label htmlFor="csv-upload">
              <Upload className="w-4 h-4 mr-2" />
              Importar CSV
              <input type="file" id="csv-upload" accept=".csv" className="hidden" onChange={handleCSVFileChange} />
            </label>
          </Button>
          <Button variant="outline" disabled>
            <Download className="w-4 h-4 mr-2" />
            Exportar Inventário
          </Button>
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
                  <TableHead>Material/Equipamento</TableHead>
                  <TableHead>Nome do Modelo</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Qtd. Padrão</TableHead>
                  <TableHead>Qtd. Disponível</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materiais.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell><Input value={item.nome} onChange={(e) => handleItemChange(item.id, 'nome', e.target.value)} /></TableCell>
                    <TableCell><Input value={item.modelo} onChange={(e) => handleItemChange(item.id, 'modelo', e.target.value)} /></TableCell>
                    <TableCell><Input value={item.marca} onChange={(e) => handleItemChange(item.id, 'marca', e.target.value)} /></TableCell>
                    <TableCell><Input type="number" value={item.quantidadePadrao} onChange={(e) => handleItemChange(item.id, 'quantidadePadrao', e.target.value)} /></TableCell>
                    <TableCell><Input type="number" value={item.quantidadeDisponivel} onChange={(e) => handleItemChange(item.id, 'quantidadeDisponivel', e.target.value)} /></TableCell>
                    <TableCell><Input type="date" value={item.dataValidade} onChange={(e) => handleItemChange(item.id, 'dataValidade', e.target.value)} /></TableCell>
                    <TableCell><Input value={item.observacoes} onChange={(e) => handleItemChange(item.id, 'observacoes', e.target.value)} /></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
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