import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ArrowLeft, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import ChecklistEditor from '@/components/checklist/ChecklistEditor';

// Custom hook que aceita toast como parâmetro
const useChecklists = (toast: any) => {
  const queryClient = useQueryClient();

  const { data: checklists = [], isLoading, error } = useQuery({
    queryKey: ['checklists'],
    queryFn: async () => {
      const response = await fetch('/api/checklists');
      if (!response.ok) throw new Error('Erro ao carregar checklists');
      return response.json();
    },
  });

  const saveChecklistMutation = useMutation({
    mutationFn: async (checklist: any) => {
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
      toast({ description: 'Checklist salvo com sucesso!' }); // Fixed: Use passed toast
    },
    onError: () => {
      toast({ description: 'Erro ao salvar checklist. Tente novamente.' }); // Fixed: Use passed toast
    },
  });

  const deleteChecklistMutation = useMutation({
    mutationFn: async (id: string, options?: { reason?: string }) => {
      const response = await fetch(`/api/checklists/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erro ao deletar checklist');
      return response.json();
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['checklists'] });
      const previousChecklists = queryClient.getQueryData(['checklists']);
      queryClient.setQueryData(['checklists'], (old: any[]) =>
        old?.filter((c: any) => c.id !== id) || []
      );
      return { previousChecklists };
    },
    onError: (err, variables, context) => {
      if (context?.previousChecklists) {
        queryClient.setQueryData(['checklists'], context.previousChecklists);
      }
      toast({ description: 'Erro ao deletar. Checklist restaurado.' }); // Fixed: Use passed toast
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists'] });
      toast({ description: 'Checklist deletado com sucesso!' }); // Fixed: Use passed toast
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
  const toast = useToast(); // Fixed: Call useToast inside the component
  const { checklists, isLoading, error, saveChecklist, deleteChecklist, isSaving, isDeleting } = useChecklists(toast); // Fixed: Pass toast to hook
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState(''); // For audit trail

  // Filtrar checklists por termo de busca
  const filteredChecklists = checklists.filter((checklist) =>
    checklist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler for delete confirmation
  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteChecklist(deletingId, { reason: deleteReason });
      setDeleteDialogOpen(false);
      setDeletingId(null);
      setDeleteReason('');
    }
  };

  // Handler to open delete dialog
  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setDeleteReason('');
    setDeleteDialogOpen(true);
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
                    onClick={() => setEditingId(checklist.id)}
                    disabled={isSaving || isDeleting}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteDialog(checklist.id)}
                        disabled={isSaving || isDeleting}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Deletar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar Deleção</DialogTitle>
                        <DialogDescription>
                          Tem certeza que deseja deletar o checklist "{checklist.name}"? Esta ação não pode ser desfeita.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="delete-reason">Motivo da Deleção (opcional, para auditoria)</Label>
                          <Textarea
                            id="delete-reason"
                            value={deleteReason}
                            onChange={(e) => setDeleteReason(e.target.value)}
                            placeholder="Ex: Checklist obsoleto, duplicado, etc."
                            className="w-full"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            Cancelar
                          </Button>
                        </DialogClose>
                        <Button type="button" onClick={handleDeleteConfirm} variant="destructive">
                          Deletar Checklist
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {editingId === checklist.id ? (
                  <ChecklistEditor
                    initialItems={checklist.items}
                    onSave={saveChecklist}
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