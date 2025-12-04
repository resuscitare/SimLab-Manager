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
  const [items, setItems] = useState<Item[]>(initialItems); // Estado com fallback

  // Use um único itemCount sem redeclaração
  const itemCount = items?.length ?? 0; // Seguro contra undefined

  // Exemplo de função para adicionar item (ajuste conforme lógica)
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

  // Resto do componente (exemplo básico)
  return (
    <div className={cn('space-y-4')}>
      <h2 className="text-lg font-semibold">Editor de Checklist</h2>
      <p>Número de itens: {itemCount}</p>
      <button onClick={addItem} className="px-4 py-2 bg-blue-500 text-white rounded">
        Adicionar Item
      </button>
      {/* Renderize a lista de itens aqui */}
      <ul>
        {items.map((item) => (
          <li key={item.id} className="flex justify-between p-2 border-b">
            <span>{item.name}</span>
            <span>{item.quantity} x R$ {item.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Exporta como default para importação padrão
export default ChecklistEditor;

// Exporta tipos para uso em outros arquivos (opcional, mas recomendado para TypeScript)
export type { Item, ChecklistEditorProps };