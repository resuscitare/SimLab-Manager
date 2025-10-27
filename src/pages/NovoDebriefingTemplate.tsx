"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/utils/toast";
import DebriefingModelSelector from "@/components/cenario/debriefing/DebriefingModelSelector";
import PearlsForm from "@/components/cenario/debriefing/PearlsForm";
import TeamGainsForm from "@/components/cenario/debriefing/TeamGainsForm";
import ThreeDForm from "@/components/cenario/debriefing/ThreeDForm";
import GasForm from "@/components/cenario/debriefing/GasForm";
import { DebriefingModelType, DebriefingTemplate } from "@/types/debriefing";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock scenario data for the forms
const mockScenarioData = {
  title: "Exemplo de Cenário",
  technicalLearningObjectives: ["Realizar RCP de alta qualidade"],
  nonTechnicalLearningObjectives: ["Melhorar comunicação da equipe"],
  equipmentList: [],
  historicoMedico: { dm: false, has: true, asma: false, alergias: false, etilismo: false, tabagismo: true },
};

const NovoDebriefingTemplate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedModel, setSelectedModel] = useState<DebriefingModelType | null>(null);
  const [templateTitle, setTemplateTitle] = useState("");

  const handleSave = () => {
    if (!templateTitle.trim()) {
      showError("Por favor, dê um título ao seu template de debriefing.");
      return;
    }
    if (!selectedModel) {
      showError("Por favor, selecione um modelo de debriefing.");
      return;
    }

    const newTemplate: DebriefingTemplate = {
      id: Date.now().toString(),
      titulo: templateTitle,
      tipo: "debriefing",
      modelo: selectedModel,
      dados: {}, // In a real app, you'd collect data from the form
      autor: user?.nome || "Desconhecido",
      dataCriacao: new Date().toISOString().split('T')[0],
    };

    try {
      const checklists = JSON.parse(localStorage.getItem('checklists') || '[]');
      checklists.push(newTemplate);
      localStorage.setItem('checklists', JSON.stringify(checklists));
      showSuccess("Template de debriefing salvo com sucesso!");
      navigate("/checklists");
    } catch (e) {
      showError("Erro ao salvar o template.");
      console.error(e);
    }
  };

  const renderForm = () => {
    if (!selectedModel) {
      return <DebriefingModelSelector onSelectModel={setSelectedModel} />;
    }
    
    // In a real app, each form would have its own state management
    // and the data would be passed to handleSave.
    // For now, we just render the form.
    switch (selectedModel) {
      case "PEARLS":
        return <PearlsForm scenarioData={mockScenarioData as any} />;
      case "TeamGAINS":
        return <TeamGainsForm scenarioData={mockScenarioData as any} />;
      case "3D":
        return <ThreeDForm scenarioData={mockScenarioData as any} />;
      case "GAS":
        return <GasForm scenarioData={mockScenarioData as any} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Novo Template de Debriefing</h1>
          <p className="text-gray-600">Crie um modelo de debriefing reutilizável.</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/checklists")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      {selectedModel && (
        <Card>
          <CardHeader>
            <CardTitle>Informações do Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="templateTitle">Título do Template</Label>
              <Input
                id="templateTitle"
                value={templateTitle}
                onChange={(e) => setTemplateTitle(e.target.value)}
                placeholder="Ex: Debriefing Padrão para RCP"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedModel(null)}>Trocar Modelo</Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {renderForm()}
    </div>
  );
};

export default NovoDebriefingTemplate;