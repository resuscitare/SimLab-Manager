"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, Pencil, Warehouse } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";
import { Local } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const Locais = () => {
  const [locais, setLocais] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocal, setEditingLocal] = useState<Local | null>(null);

  useEffect(() => {
    try {
      const savedLocais = localStorage.getItem('simlab_locais');
      if (savedLocais) {
        setLocais(JSON.parse(savedLocais));
      } else {
        // Add mock data if none exists
        const mockLocais: Local[] = [
          { id: '1', laboratorio: 'Laboratório Térreo', sala: 'Sala 1', armario: 'Armário de Vias Aéreas', gaveta: 'Gaveta 1', descricao: 'Máscaras Laringeas' },
          { id: '2', laboratorio: 'Laboratório Térreo', sala: 'Sala 1', armario: 'Armário de Vias Aéreas', gaveta: 'Gaveta 2', descricao: 'Tubos Endotraqueais' },
          { id: '3', laboratorio: 'Laboratório 2º Andar', sala: 'Sala 3', armario: 'Estante de Medicamentos', gaveta: 'Prateleira A', descricao: 'Ampolas de Adrenalina' },
        ];
        setLocais(mockLocais);
        localStorage.setItem('simlab_locais', JSON.stringify(mockLocais));
      }
    } catch (e) {
      showError("Erro ao carregar locais.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('simlab_locais', JSON.stringify(locais));
      showSuccess("Locais salvos com sucesso!");
    } catch (e) {
      showError("Erro ao salvar locais.");
    }
  };

  const handleOpenDialog = (local: Local | null = null) => {
    setEditingLocal(local);
    setIsDialogOpen(true);
  };

  const handleSaveLocal = (localData: Local) => {
    if (editingLocal) {
      // Update existing local
      setLocais(locais.map(l => l.id === editingLocal.id ? localData : l));
    } else {
      // Add new local
      setLocais([...locais, { ...localData, id: Date.now().toString() }]);
    }
    setIsDialogOpen(false);
    setEditingLocal(null);
  };

  const handleRemoveLocal = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este local?")) {
      setLocais(locais.filter(l => l.id !== id));
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Locais</h1>
          <p className="text-gray-600">Gerencie os locais de armazenamento do inventário.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Local
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Locais Cadastrados</CardTitle>
          <CardDescription>Lista de todos os locais de armazenamento.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Laboratório</TableHead>
                  <TableHead>Sala</TableHead>
                  <TableHead>Armário/Estante</TableHead>
                  <TableHead>Gaveta/Prateleira</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locais.map((local) => (
                  <TableRow key={local.id}>
                    <TableCell>{local.laboratorio}</TableCell>
                    <TableCell>{local.sala}</TableCell>
                    <TableCell>{local.armario}</TableCell>
                    <TableCell>{local.gaveta}</TableCell>
                    <TableCell>{local.descricao}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(local)} className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveLocal(local.id)} className="h-8 w-8 text-destructive">
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

      <LocalFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveLocal}
        local={editingLocal}
      />
    </div>
  );
};

interface LocalFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (local: Local) => void;
  local: Local | null;
}

const LocalFormDialog = ({ isOpen, onOpenChange, onSave, local }: LocalFormDialogProps) => {
  const [formData, setFormData] = useState<Omit<Local, 'id'>>({
    laboratorio: '',
    sala: '',
    armario: '',
    gaveta: '',
    descricao: ''
  });

  useEffect(() => {
    if (local) {
      setFormData(local);
    } else {
      setFormData({ laboratorio: '', sala: '', armario: '', gaveta: '', descricao: '' });
    }
  }, [local, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave({ id: local?.id || '', ...formData });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{local ? 'Editar Local' : 'Novo Local'}</DialogTitle>
          <DialogDescription>
            Preencha as informações para cadastrar um novo local de armazenamento.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="laboratorio">Nome do Laboratório</Label>
            <Input id="laboratorio" name="laboratorio" value={formData.laboratorio} onChange={handleChange} placeholder="Ex: Laboratório Térreo" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sala">Sala</Label>
            <Input id="sala" name="sala" value={formData.sala} onChange={handleChange} placeholder="Ex: Sala 1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="armario">Armário / Estante</Label>
            <Input id="armario" name="armario" value={formData.armario} onChange={handleChange} placeholder="Ex: Armário de Vias Aéreas" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gaveta">Gaveta / Prateleira</Label>
            <Input id="gaveta" name="gaveta" value={formData.gaveta} onChange={handleChange} placeholder="Ex: Gaveta 1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição do Conteúdo</Label>
            <Input id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} placeholder="Ex: Máscaras Laringeas" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancelar</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Locais;