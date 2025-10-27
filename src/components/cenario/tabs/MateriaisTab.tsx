"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Heart } from "lucide-react";
import { ScenarioFormData } from "@/types/prisma";

interface MateriaisTabProps {
  scenarioData: ScenarioFormData;
  adicionarEquipamento: (equipamento: string) => void;
  removerEquipamento: (equipamento: string) => void;
}

const MateriaisTab = ({ scenarioData, adicionarEquipamento, removerEquipamento }: MateriaisTabProps) => {
  const [novoEquipamento, setNovoEquipamento] = useState("");

  const handleAdicionarEquipamento = () => {
    if (novoEquipamento.trim()) {
      adicionarEquipamento(novoEquipamento);
      setNovoEquipamento("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Equipamentos e Materiais
        </CardTitle>
        <CardDescription>Lista de equipamentos necessários</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Equipamentos Necessários</Label>
          <div className="flex gap-2">
            <Input
              value={novoEquipamento}
              onChange={(e) => setNovoEquipamento(e.target.value)}
              placeholder="Digite um equipamento"
              onKeyPress={(e) => e.key === 'Enter' && handleAdicionarEquipamento()}
            />
            <Button type="button" onClick={handleAdicionarEquipamento}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {scenarioData.equipmentList.map((equipamento, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {equipamento}
                <X className="w-3 h-3 cursor-pointer" onClick={() => removerEquipamento(equipamento)} />
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MateriaisTab;