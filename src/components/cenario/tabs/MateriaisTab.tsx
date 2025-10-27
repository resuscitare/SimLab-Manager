"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Heart, Trash2 } from "lucide-react";
import { EquipmentItem, ScenarioFormData } from "@/types/prisma";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MateriaisTabProps {
  scenarioData: ScenarioFormData;
  addEquipmentItem: () => void;
  updateEquipmentItem: (id: string, field: keyof EquipmentItem, value: string) => void;
  removeEquipmentItem: (id: string) => void;
}

const MateriaisTab = ({ scenarioData, addEquipmentItem, updateEquipmentItem, removeEquipmentItem }: MateriaisTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Equipamentos e Materiais
        </CardTitle>
        <CardDescription>Liste todos os equipamentos e materiais necessários para o cenário.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20%]">Material/Equipamento</TableHead>
                <TableHead className="w-[25%]">Nome do Modelo</TableHead>
                <TableHead className="w-[15%]">Marca</TableHead>
                <TableHead className="w-[10%]">Quantidade</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scenarioData.equipmentList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Select
                      value={item.type}
                      onValueChange={(value) => updateEquipmentItem(item.id, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="material">Material</SelectItem>
                        <SelectItem value="equipamento">Equipamento</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.modelName}
                      onChange={(e) => updateEquipmentItem(item.id, 'modelName', e.target.value)}
                      placeholder="Ex: Desfibrilador"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.brand}
                      onChange={(e) => updateEquipmentItem(item.id, 'brand', e.target.value)}
                      placeholder="Ex: Philips"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.quantity}
                      onChange={(e) => updateEquipmentItem(item.id, 'quantity', e.target.value)}
                      placeholder="Ex: 1"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.observations}
                      onChange={(e) => updateEquipmentItem(item.id, 'observations', e.target.value)}
                      placeholder="Ex: Com pás adesivas"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEquipmentItem(item.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button type="button" variant="outline" onClick={addEquipmentItem}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Material
        </Button>
      </CardContent>
    </Card>
  );
};

export default MateriaisTab;