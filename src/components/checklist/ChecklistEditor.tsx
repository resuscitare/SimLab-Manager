import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Edit2, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Definição do esquema de validação com Zod, incluindo 'id' obrigatório
const itemSchema = z.object({
  id: z.string(), // ID obrigatório
  name: z.string().min(1, 'Nome é obrigatório'),
  quantity: z.coerce.number().min(1, 'Quantidade deve ser pelo menos 1'),
  price: z.coerce.number().min(0, 'Preço não pode ser negativo'),
});

// Tipo para o formulário (array de itens), agora com 'id' incluído
type ChecklistFormData = {
  items: z.infer<typeof itemSchema>[];
};

interface ChecklistEditorProps {
  initialItems?: z.infer<typeof itemSchema>[]; // Itens iniciais opcionais, mas com 'id'
  onSave?: (data: ChecklistFormData) => void; // Callback opcional para salvar
  className?: string; // Classe CSS opcional
}

// Subcomponente para renderizar um item da lista
const ChecklistItem: React.FC<{
  item: z.infer<typeof itemSchema>;
  index: number;
  onUpdate: (index: number, field: keyof z.infer<typeof itemSchema>, value: string | number) => void;
  onDelete: (index: number) => void;
  isEditing: boolean;
  onToggleEdit: (index: number) => void;
}> = ({ item, index, onUpdate, onDelete, isEditing, onToggleEdit }) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-card space-x-4">
      <div className="flex-1 space-y-2">
        <Input
          value={item.name}
          onChange={(e) => onUpdate(index, 'name', e.target.value)}
          placeholder="Nome do item"
          className="w-full"
          disabled={!isEditing}
        />
        <div className="flex space-x-2">
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => onUpdate(index, 'quantity', parseInt(e.target.value) || 1)}
            placeholder="Qtd."
            className="w-20"
            min={1}
            disabled={!isEditing}
          />
          <Input
            type="number"
            value={item.price}
            onChange={(e) => onUpdate(index, 'price', parseFloat(e.target.value) || 0)}
            placeholder="Preço"
            className="w-24"
            min={0}
            step={0.01}
            disabled={!isEditing}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant="secondary">R$ {(item.quantity * item.price).toFixed(2)}</Badge>
        {!isEditing ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onToggleEdit(index)}
            title="Editar"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => onToggleEdit(index)}
              title="Salvar"
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onDelete(index)}
              title="Cancelar"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={() => onDelete(index)}
          title="Remover"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const ChecklistEditor: React.FC<ChecklistEditorProps> = ({ initialItems = [], onSave, className }) => {
  // Schema para o formulário principal (array de itens)
  const formSchema = z.object({
    items: z.array(itemSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChecklistFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      items: initialItems.map((item) => ({ 
        ...item, 
        id: item.id || Date.now().toString() // Gera ID se ausente
      })) 
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Função para adicionar um novo item
  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      price: 0,
    };
    append(newItem);
  };

  // Função para atualizar um item
  const updateItem = (index: number, field: keyof z.infer<typeof itemSchema>, value: string | number) => {
    const currentItems = fields as z.infer<typeof itemSchema>[];
    const updatedItems = [...currentItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    // Não é necessário setValue aqui, pois useFieldArray gerencia o estado
  };

  // Função para remover um item
  const deleteItem = (index: number) => {
    remove(index);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  // Função para alternar edição
  const toggleEdit = (index: number) => {
    setEditingIndex(editingIndex === index ? null : index);
  };

  // Função para salvar (calcula totais e chama callback)
  const onSubmit = (data: ChecklistFormData) => {
    const totalItems = data.items.length;
    const totalValue = data.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    console.log('Salvando checklist:', { totalItems, totalValue, items: data.items });
    onSave?.(data);
  };

  // Cálculo de totais
  const totalItems = fields.length;
  const totalValue = fields.reduce((sum, item: any) => sum + (item.quantity || 0) * (item.price || 0), 0);

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Editor de Checklist</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Total: R$ {totalValue.toFixed(2)}</Badge>
          <Badge variant="outline">{totalItems} itens</Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <ChecklistItem
              key={field.id}
              item={field as z.infer<typeof itemSchema>}
              index={index}
              onUpdate={updateItem}
              onDelete={deleteItem}
              isEditing={editingIndex === index}
              onToggleEdit={toggleEdit}
            />
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Item
        </Button>

        {errors.items && (
          <p className="text-sm text-destructive">{errors.items.message}</p>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={() => onSave?.({ items: fields as z.infer<typeof itemSchema>[] })}>
            Cancelar
          </Button>
          <Button type="submit">
            Salvar Checklist
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChecklistEditor; // Exporta como default para importação padrão

// Exporta tipos para uso em outros arquivos (opcional, mas recomendado para TypeScript)
export type { ChecklistFormData };