"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScenarioFormData } from "@/types/prisma";
import { Eye, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface IdentificacaoTabProps {
  scenarioData: ScenarioFormData;
  handleScenarioDataChange: (field: keyof ScenarioFormData, value: any) => void;
}

const cursos = [
  { value: "acls", label: "ACLS" },
  { value: "bls", label: "BLS" },
  { value: "aph", label: "APH" },
  { value: "pals", label: "PALS" },
  { value: "outro", label: "Outro" },
];

const IdentificacaoTab = ({ scenarioData, handleScenarioDataChange }: IdentificacaoTabProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Identificação do Cenário
        </CardTitle>
        <CardDescription>Informações básicas para categorizar e identificar o cenário.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Cenário *</Label>
            <Input
              id="title"
              value={scenarioData.title}
              onChange={(e) => handleScenarioDataChange('title', e.target.value)}
              placeholder="Ex: Parada Cardiorrespiratória em AESP"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="participantType">Tipo Principal de Participante</Label>
            <Select value={scenarioData.patientGender} onValueChange={(value) => handleScenarioDataChange('patientGender', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Simulador">Simulador</SelectItem>
                <SelectItem value="Paciente Padronizado">Paciente Padronizado</SelectItem>
                <SelectItem value="Ambos">Ambos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="curso">Curso</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between font-normal"
                >
                  {scenarioData.curso || "Selecione ou digite um curso..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command
                  filter={(value, search) => {
                    if (value.includes(search)) return 1;
                    return 0;
                  }}
                >
                  <CommandInput 
                    placeholder="Buscar ou criar curso..."
                    value={scenarioData.curso}
                    onValueChange={(value) => handleScenarioDataChange('curso', value)}
                  />
                  <CommandList>
                    <CommandEmpty>
                      <CommandItem
                        onSelect={() => {
                          setOpen(false);
                        }}
                      >
                        Criar "{scenarioData.curso}"
                      </CommandItem>
                    </CommandEmpty>
                    <CommandGroup>
                      {cursos.map((curso) => (
                        <CommandItem
                          key={curso.value}
                          value={curso.value}
                          onSelect={(currentValue) => {
                            const newValue = currentValue === scenarioData.curso?.toLowerCase() ? "" : curso.label;
                            handleScenarioDataChange('curso', newValue);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              scenarioData.curso?.toLowerCase() === curso.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {curso.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="turma">Turma</Label>
            <Input
              id="turma"
              value={scenarioData.turma}
              onChange={(e) => handleScenarioDataChange('turma', e.target.value)}
              placeholder="Ex: Turma de Março/2024"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="scenarioOutline">Descrição do Cenário</Label>
          <Textarea
            id="scenarioOutline"
            value={scenarioData.scenarioOutline}
            onChange={(e) => handleScenarioDataChange('scenarioOutline', e.target.value)}
            placeholder="Descreva brevemente o cenário..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="learnerBrief">Informações para os Participantes</Label>
          <Textarea
            id="learnerBrief"
            value={scenarioData.learnerBrief}
            onChange={(e) => handleScenarioDataChange('learnerBrief', e.target.value)}
            placeholder="O que será informado aos participantes..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default IdentificacaoTab;