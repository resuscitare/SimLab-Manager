"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Calendar, Clock, Users } from "lucide-react";

interface ProgramaTabProps {
  formData: {
    nomePrograma: string;
    objetivosPrograma: string;
    publicoAlvo: string;
    datasCurso: string;
    horariosCurso: string;
    facilitadores: string;
    conteudoPrevio: string;
    avaliacaoAprendizagem: string;
    tarefasFacilitador: string;
  };
  palavrasChave: string[];
  novaPalavra: string;
  onFormDataChange: (field: string, value: string) => void;
  onPalavrasChaveChange: (palavras: string[]) => void;
  onNovaPalavraChange: (palavra: string) => void;
}

const ProgramaTab = ({
  formData,
  palavrasChave,
  novaPalavra,
  onFormDataChange,
  onPalavrasChaveChange,
  onNovaPalavraChange
}: ProgramaTabProps) => {
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
        <CardTitle>Identificação do Programa</CardTitle>
        <CardDescription>Informações gerais sobre o programa de simulação</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seção 1: Identificação Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nome-programa">Nome do Programa *</Label>
            <Input 
              id="nome-programa" 
              placeholder="Ex: Programa de Emergências Cardiorrespiratórias"
              value={formData.nomePrograma}
              onChange={(e) => onFormDataChange('nomePrograma', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="publico-alvo">Público-alvo *</Label>
            <Input 
              id="publico-alvo" 
              placeholder="Ex: Residentes de Medicina, Enfermeiros"
              value={formData.publicoAlvo}
              onChange={(e) => onFormDataChange('publicoAlvo', e.target.value)}
            />
          </div>
        </div>

        {/* Palavras-chave */}
        <div className="space-y-2">
          <Label htmlFor="palavras-chave">Palavras-chave</Label>
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

        {/* Datas e Horários */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Datas do curso
            </Label>
            <Input 
              placeholder="Ex: 15/01/2024 - 20/01/2024"
              value={formData.datasCurso}
              onChange={(e) => onFormDataChange('datasCurso', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Horários do curso
            </Label>
            <Input 
              placeholder="Ex: 08:00 - 12:00, 14:00 - 18:00"
              value={formData.horariosCurso}
              onChange={(e) => onFormDataChange('horariosCurso', e.target.value)}
            />
          </div>
        </div>

        {/* Facilitadores */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Facilitadores
          </Label>
          <Input 
            placeholder="Ex: Dr. Carlos Silva, Dra. Ana Costa"
            value={formData.facilitadores}
            onChange={(e) => onFormDataChange('facilitadores', e.target.value)}
          />
        </div>

        {/* Objetivos do Programa */}
        <div className="space-y-2">
          <Label>Objetivos de Aprendizagem do Programa *</Label>
          <Textarea 
            placeholder="Descreva os objetivos gerais do programa de simulação..."
            rows={4}
            value={formData.objetivosPrograma}
            onChange={(e) => onFormDataChange('objetivosPrograma', e.target.value)}
          />
        </div>

        {/* Conteúdo Prévio */}
        <div className="space-y-2">
          <Label>Conteúdo Prévio</Label>
          <Textarea 
            placeholder="Conhecimentos prévios necessários para os participantes..."
            rows={3}
            value={formData.conteudoPrevio}
            onChange={(e) => onFormDataChange('conteudoPrevio', e.target.value)}
          />
        </div>

        {/* Avaliação de Aprendizagem */}
        <div className="space-y-2">
          <Label>Avaliação de Aprendizagem</Label>
          <Textarea 
            placeholder="Como a aprendizagem será avaliada (checklists, observação, etc.)..."
            rows={3}
            value={formData.avaliacaoAprendizagem}
            onChange={(e) => onFormDataChange('avaliacaoAprendizagem', e.target.value)}
          />
        </div>

        {/* Tarefas do Facilitador */}
        <div className="space-y-2">
          <Label>Tarefas do Facilitador e/ou Orientações Gerais</Label>
          <Textarea 
            placeholder="Orientações específicas para os facilitadores..."
            rows={3}
            value={formData.tarefasFacilitador}
            onChange={(e) => onFormDataChange('tarefasFacilitador', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramaTab;