"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface IdentificacaoTabProps {
  formData: {
    nome: string;
    publicoAlvo: string;
    tempoExecucao: string;
    tipoSimulacao: string;
    descricao: string;
  };
  palavrasChave: string[];
  novaPalavra: string;
  onFormDataChange: (field: string, value: string) => void;
  onPalavrasChaveChange: (palavras: string[]) => void;
  onNovaPalavraChange: (palavra: string) => void;
}

const publicosAlvo = [
  "Residentes de Medicina",
  "Enfermeiros",
  "Médicos Emergencistas",
  "Estudantes de Medicina",
  "Equipe Multiprofissional",
  "Pediatras",
  "Cardiologistas"
];

const IdentificacaoTab = ({
  formData,
  palavrasChave,
  novaPalavra,
  onFormDataChange,
  onPalavrasChaveChange,
  onNovaPalavraChange
}: IdentificacaoTabProps) => {
  const adicionarPalavraChave = () => {
    if (novaPalavra.trim() && !palavrasChave.includes(novaPalavra.trim())) {
      onPalavrasChaveChange([...palavrasChave, novaPalavra.trim()]);
      onNovaPalavraChange("");
    }
  };

  const removerPalavraChave = (palavra: string) => {
    onPalavrasChaveChange(palavrasChave.filter(p => p !== palavra));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      adicionarPalavraChave();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação do Cenário</CardTitle>
        <CardDescription>Informações básicas do cenário</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Cenário *</Label>
            <Input 
              id="nome" 
              placeholder="Ex: Parada Cardiorrespiratória em AESP" 
              value={formData.nome}
              onChange={(e) => onFormDataChange('nome', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="publico">Público-Alvo *</Label>
            <Select value={formData.publicoAlvo} onValueChange={(value) => onFormDataChange('publicoAlvo', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o público-alvo" />
              </SelectTrigger>
              <SelectContent>
                {publicosAlvo.map((publico) => (
                  <SelectItem key={publico} value={publico}>{publico}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tempo">Tempo de Execução (minutos) *</Label>
            <Input 
              id="tempo" 
              type="number" 
              placeholder="Ex: 30" 
              value={formData.tempoExecucao}
              onChange={(e) => onFormDataChange('tempoExecucao', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Simulação *</Label>
            <Select value={formData.tipoSimulacao} onValueChange={(value) => onFormDataChange('tipoSimulacao', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simulador">Simulador</SelectItem>
                <SelectItem value="paciente">Paciente Padronizado</SelectItem>
                <SelectItem value="ambos">Ambos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="palavras-chave">Palavras-Chave</Label>
          <div className="flex gap-2">
            <Input
              value={novaPalavra}
              onChange={(e) => onNovaPalavraChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite uma palavra-chave"
            />
            <Button type="button" onClick={adicionarPalavraChave}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {palavrasChave.map((palavra) => (
              <Badge key={palavra} variant="secondary" className="flex items-center gap-1">
                {palavra}
                <X className="w-3 h-3 cursor-pointer" onClick={() => removerPalavraChave(palavra)} />
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição do Cenário</Label>
          <Textarea 
            id="descricao" 
            placeholder="Descreva brevemente o cenário..."
            rows={4}
            value={formData.descricao}
            onChange={(e) => onFormDataChange('descricao', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default IdentificacaoTab;