"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

interface ObjetivosTabProps {
  formData: {
    objetivosTecnicos: string;
    objetivosNaoTecnicos: string;
  };
  onFormDataChange: (field: string, value: string) => void;
  onAISuggestion: (tipo: 'tecnicos' | 'nao_tecnicos') => void;
}

const ObjetivosTab = ({
  formData,
  onFormDataChange,
  onAISuggestion
}: ObjetivosTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Objetivos de Aprendizagem</CardTitle>
        <CardDescription>Defina os objetivos técnicos e não técnicos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Objetivos Técnicos *</Label>
            <Button variant="outline" size="sm" onClick={() => onAISuggestion('tecnicos')}>
              <Sparkles className="w-4 h-4 mr-2" />
              Sugerir com IA
            </Button>
          </div>
          <Textarea 
            placeholder="Ex: Realizar RCP de acordo com diretrizes AHA, Identificar ritmo de parada cardíaca..."
            rows={4}
            value={formData.objetivosTecnicos}
            onChange={(e) => onFormDataChange('objetivosTecnicos', e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Objetivos Não Técnicos *</Label>
            <Button variant="outline" size="sm" onClick={() => onAISuggestion('nao_tecnicos')}>
              <Sparkles className="w-4 h-4 mr-2" />
              Sugerir com IA
            </Button>
          </div>
          <Textarea 
            placeholder="Ex: Trabalho em equipe, Comunicação efetiva, Liderança..."
            rows={4}
            value={formData.objetivosNaoTecnicos}
            onChange={(e) => onFormDataChange('objetivosNaoTecnicos', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ObjetivosTab;