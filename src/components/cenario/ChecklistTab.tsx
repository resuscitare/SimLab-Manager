"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, MessageSquare, Plus } from "lucide-react";

interface ChecklistTabProps {
  tipo: 'materiais' | 'debriefing';
  checklist: any;
  onChecklistChange: (checklist: any) => void;
}

const ChecklistTab = ({ tipo, checklist, onChecklistChange }: ChecklistTabProps) => {
  const config = {
    materiais: {
      titulo: "Checklist de Materiais",
      descricao: "Defina todos os materiais e equipamentos necessários para a simulação",
      icone: Package,
      placeholder: "Nenhum checklist de materiais criado ainda"
    },
    debriefing: {
      titulo: "Checklist de Debriefing",
      descricao: "Defina os pontos norteadores para a discussão pós-simulação",
      icone: MessageSquare,
      placeholder: "Nenhum checklist de debriefing criado ainda"
    }
  };

  const { titulo, descricao, icone: Icone, placeholder } = config[tipo];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icone className="h-5 w-5" />
          {titulo}
        </CardTitle>
        <CardDescription>{descricao}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!checklist ? (
          <div className="text-center py-8">
            <Icone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">{placeholder}</p>
            <Button onClick={() => onChecklistChange({ 
              id: tipo === 'materiais' ? "1" : "2", 
              titulo, 
              tipo, 
              secoes: [] 
            })}>
              <Plus className="w-4 h-4 mr-2" />
              Criar {titulo}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{checklist.titulo}</h3>
              <Button variant="outline" size="sm">
                Editar Checklist
              </Button>
            </div>
            
            <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">{checklist.titulo} associado ao cenário</p>
              <p className="text-sm text-gray-400">Funcionalidade completa em desenvolvimento</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChecklistTab;