import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// Defina o tipo Item (ajuste conforme seu modelo real)
interface Item {
  id: string;
  name: string;
  quantity: number;
  price: number;
  // Adicione outros campos conforme necessário
}

interface ChecklistEditorProps {
  items?: Item[]; // Torne opcional
  onUpdate?: (items: Item[]) => void; // Callback opcional para atualizar itens
}

const ChecklistEditor: React.FC<ChecklistEditorProps> = ({ items: initialItems = [], onUpdate }) => {
  const [items, setItems] = useState<Item[]>(initialItems); // Estado com fallback para array vazio

  // Use um único itemCount sem redeclaração
  const itemCount = items?.length ?? 0; // Seguro contra undefined

  // Função para adicionar item
  const addItem = () => {
    const newItem: Item = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      price: 0,
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    onUpdate?.(updatedItems); // Callback se fornecido
  };

  // Função para remover item
  const removeItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    onUpdate?.(updatedItems); // Callback se fornecido
  };

  // Função para atualizar item (exemplo básico)
  const updateItem = (id: string, field: keyof Item, value: string | number) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
    onUpdate?.(updatedItems); // Callback se fornecido
  };

  // Resto do componente (exemplo básico de renderização)
  return (
    <div className={cn('space-y-4')}>
      <h2 className="text-lg font-semibold">Editor de Checklist</h2>
      <p>Número de itens: {itemCount}</p>
      <button onClick={addItem} className="px-4 py-2 bg-blue-500 text-white rounded">
        Adicionar Item
      </button>
      {/* Renderize a lista de itens aqui */}
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
            <div className="flex-1">
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                placeholder="Nome do item"
                className="mr-2 px-2 py-1 border rounded text-sm"
              />
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                placeholder="Qtd."
                className="mx-2 px-2 py-1 border rounded text-sm w-16"
              />
              <input
                type="number"
                value={item.price}
                onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                placeholder="Preço"
                className="mx-2 px-2 py-1 border rounded text-sm w-20"
              />
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChecklistEditor; // Exporta como default para importação padrão

// Exporta tipos para uso em outros arquivos (opcional, mas recomendado para TypeScript)
export type { Item, ChecklistEditorProps };