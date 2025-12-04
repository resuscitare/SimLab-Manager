import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast'; // Import do hook useToast
import ChecklistEditor from '@/components/checklist/ChecklistEditor'; // Import como default

// Interface ChecklistItem com totalValue adicionado
interface ChecklistItem {
  id: string;
  name: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalValue: number; // Adicionado para evitar erro no reduce
}

// Hook de API para checklists (exemplo - ajuste para sua API real)
const useChecklists = () => {
  const queryClient = useQueryClient();

  // Carregar checklists
  const { data: checklists = [], isLoading, error } = useQuery({
    queryKey: ['checklists'],
    queryFn: async () => {
      // Simular chamada API - substitua pela sua
      const response = await fetch('/api/checklists');
      if (!response.ok) throw new Error('Erro ao carregar checklists');
      return response.json();
    },
  });

  // Mutação para salvar checklist
  const saveChecklistMutation = useMutation({
    mutationFn: async (checklist: ChecklistItem) => {
      const method = checklist.id ? 'PUT' : 'POST';
      const url = checklist.id ? `/api/checklists/${checklist.id}` : '/api/checklists';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checklist),
      });
      if (!response.ok) throw new Error('Erro ao salvar checklist');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists'] });
    },
    onError: () => {
      // Toast será chamado no componente
    },
  });

  // Mutação para deletar checklist
  const deleteChecklistMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/checklists/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erro ao deletar checklist');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists'] });
    },
    onError: () => {
      // Toast será chamado no componente
    },
  });

  return {
    checklists,
    isLoading,
    error,
    saveChecklist: saveChecklistMutation.mutate,
    deleteChecklist: deleteChecklistMutation.mutate,
    isSaving: saveChecklistMutation.isPending,
    isDeleting: deleteChecklistMutation.isPending,
  };
};

const ListaChecklists = () => {
  const navigate = useNavigate();
  const { toast } = useToast(); // Destruturação do hook useToast dentro do componente
  const { checklists, isLoading, error, saveChecklist, deleteChecklist, isSaving, isDeleting } = useChecklists();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar checklists por termo de busca
  const filteredChecklists = checklists.filter((checklist) =>
    checklist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para salvar/atualizar checklist
  const handleSave = (updatedItems: { items: { id: string; name: string; quantity: number; price: number; }[]; }) => {
    if (editingId) {
      const checklist = checklists.find(c => c.id === editingId);
      if (checklist) {
        const updatedChecklist = { 
          ...checklist, 
          items: updatedItems.items, 
          totalValue: updatedItems.items.reduce((sum, item) => sum + item.quantity * item.price, 0) // Correção: updatedItems.items.reduce
        };
        saveChecklist(updatedChecklist);
      }
    } else {
      // Novo checklist
      const newChecklist: ChecklistItem = {
        id: Date.now().toString(),
        name: 'Novo Checklist', // Nome padrão ou de input
        items: updatedItems.items,
        totalValue: updatedItems.items.reduce((sum, item) => sum + item.quantity * item.price, 0) // Correção: updatedItems.items.reduce
      };
      saveChecklist(newChecklist);
    }
    setEditingId(null);
    toast({ description: 'Checklist salvo com sucesso!' }); // Toast no sucesso
  };

  // Função para deletar checklist
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este checklist?')) {
      deleteChecklist(id);
      toast({ description: 'Checklist deletado com sucesso!' }); // Toast no sucesso
    }
  };

  // Função para editar checklist
  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertDescription>Erro ao carregar checklists: {error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Lista de Checklists</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Buscar checklists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button onClick={() => setEditingId('new')} disabled={isSaving}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Checklist
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredChecklists.length === 0 ? (
          <Alert>
            <AlertDescription>Nenhum checklist encontrado. Crie o primeiro!</AlertDescription>
          </Alert>
        ) : (
          filteredChecklists.map((checklist) => (
            <Card key={checklist.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Label>{checklist.name}</Label>
                  <Badge variant="secondary">R$ {checklist.totalValue.toFixed(2)}</Badge>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(checklist.id)}
                    disabled={isSaving || isDeleting}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(checklist.id)}
                    disabled={isSaving || isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Deletar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {editingId === checklist.id ? (
                  <ChecklistEditor
                    initialItems={checklist.items}
                    onSave={handleSave} // Passa a função handleSave que espera { items: [...] }
                  />
                ) : (
                  <div className="space-y-2">
                    {checklist.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>{item.quantity} x R$ {item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ListaChecklists;