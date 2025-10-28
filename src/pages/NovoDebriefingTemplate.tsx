"use client";

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Save, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast";
import { DebriefingTemplate, DebriefingModelType } from "@/types/debriefing";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const NovoDebriefingTemplate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [templateTitle, setTemplateTitle] = useState("");
  const [selectedModel, setSelectedModel] = useState<DebriefingModelType>("PEARLS");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("30");
  const [level, setLevel] = useState("graduacao");

  // Parâmetros para voltar à página correta
  const fromScenario = searchParams.get('fromScenario');
  const scenarioId = searchParams.get('scenarioId');

  const handleSave = () => {
    if (!templateTitle.trim()) {
      showError("Por favor, dê um título ao seu template de debriefing.");
      return;
    }

    const newTemplate: DebriefingTemplate = {
      id: `template-${Date.now()}`,
      titulo: templateTitle,
      tipo: "debriefing",
      modelo: selectedModel,
      dados: {
        descricao: description,
        duracao: duration,
        nivelParticipantes: level,
        objetivos: [],
        momentosCriticos: [],
        fasePreparacao: "",
        faseReacao: "",
        faseDescricao: "",
        faseAnalise: "",
        faseResumo: ""
      },
      autor: user?.nome || "Usuário",
      dataCriacao: new Date().toISOString().split('T')[0]
    };

    try {
      const checklists = JSON.parse(localStorage.getItem('checklists') || '[]');
      checklists.push(newTemplate);
      localStorage.setItem('checklists', JSON.stringify(checklists));
      
      showSuccess("Template de debriefing criado com sucesso!");
      
      // Redirecionar de volta para onde veio
      if (fromScenario === 'true' && scenarioId) {
        navigate(`/cenarios/novo#debriefing`);
      } else {
        navigate("/checklists");
      }
    } catch (e) {
      showError("Erro ao salvar o template.");
      console.error(e);
    }
  };

  const handleBack = () => {
    if (fromScenario === 'true' && scenarioId) {
      navigate(`/cenarios/novo#debriefing`);
    } else {
      navigate("/checklists");
    }
  };

  const modelDescriptions = {
    PEARLS: "Debriefings abrangentes com tempo adequado (20-30 minutos). 5 fases estruturadas com 3 opções de análise.",
    TeamGAINS: "Focado em trabalho em equipe e dinâmica interprofissional. 6 fases incluindo prebriefing.",
    "3D": "Para cenários emocionalmente intensos. 3 fases focadas em processamento emocional e cognitivo.",
    GAS: "Debriefings rápidos e objetivos (10-15 minutos). Modelo oficial da American Heart Association."
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Criar Template de Debriefing</h1>
          <p className="text-gray-600">
            {fromScenario === 'true' 
              ? "Crie um template para usar neste cenário" 
              : "Crie um template de debriefing reutilizável"
            }
          </p>
        </div>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Template</CardTitle>
          <CardDescription>Configure as informações básicas do seu template de debriefing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="templateTitle">Título do Template *</Label>
              <Input
                id="templateTitle"
                value={templateTitle}
                onChange={(e) => setTemplateTitle(e.target.value)}
                placeholder="Ex: Debriefing Padrão para RCP"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duração Estimada (minutos)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o propósito e características deste template..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Seleção do Modelo */}
      <Card>
        <CardHeader>
          <CardTitle>Escolha o Modelo de Debriefing</CardTitle>
          <CardDescription>Selecione o modelo que melhor se adapta aos seus objetivos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select value={selectedModel} onValueChange={(value: DebriefingModelType) => setSelectedModel(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PEARLS">PEARLS</SelectItem>
                  <SelectItem value="TeamGAINS">TeamGAINS</SelectItem>
                  <SelectItem value="3D">3D</SelectItem>
                  <SelectItem value="GAS">GAS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">{selectedModel}</h4>
                  <p className="text-sm text-blue-700">{modelDescriptions[selectedModel]}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nível dos Participantes */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações Adicionais</CardTitle>
          <CardDescription>Defina o público-alvo para este template</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Nível dos Participantes</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="graduacao">Estudantes de graduação</SelectItem>
                <SelectItem value="residente_r1_r2">Residentes R1-R2</SelectItem>
                <SelectItem value="residente_r3+">Residentes R3+</SelectItem>
                <SelectItem value="profissionais">Profissionais</SelectItem>
                <SelectItem value="multiprofissional">Equipe multiprofissional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="outline" onClick={handleBack}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={!templateTitle.trim()}>
          <Save className="w-4 h-4 mr-2" />
          Criar Template
        </Button>
      </div>

      {/* Nota sobre integração */}
      {fromScenario === 'true' && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                Integrado
              </Badge>
              <p className="text-sm text-green-700">
                Este template será automaticamente associado ao seu cenário atual.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NovoDebriefingTemplate;