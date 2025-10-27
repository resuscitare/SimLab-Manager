"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/utils/toast";
import PearlsForm from "@/components/cenario/debriefing/PearlsForm";
import TeamGainsForm from "@/components/cenario/debriefing/TeamGainsForm";
import ThreeDForm from "@/components/cenario/debriefing/ThreeDForm";
import GasForm from "@/components/cenario/debriefing/GasForm";
import { DebriefingTemplate } from "@/types/debriefing";
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

const EditarDebriefingTemplate = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [template, setTemplate] = useState<DebriefingTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const checklists = JSON.parse(localStorage.getItem('checklists') || '[]');
      const found = checklists.find((c: any) => c.id === id && c.tipo === 'debriefing');
      if (found) {
        setTemplate(found);
      } else {
        showError("Template de debriefing não encontrado.");
        navigate("/checklists");
      }
    } catch (e) {
      showError("Erro ao carregar o template.");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const handleSave = () => {
    if (!template || !template.titulo.trim()) {
      showError("O título do template é obrigatório.");
      return;
    }

    try {
      const checklists = JSON.parse(localStorage.getItem('checklists') || '[]');
      const index = checklists.findIndex((c: any) => c.id === id);
      if (index !== -1) {
        checklists[index] = template;
        localStorage.setItem('checklists', JSON.stringify(checklists));
        showSuccess("Template atualizado com sucesso!");
        navigate("/checklists");
      } else {
        showError("Erro ao encontrar o template para atualizar.");
      }
    } catch (e) {
      showError("Erro ao salvar o template.");
      console.error(e);
    }
  };

  const renderForm = () => {
    if (!template) return null;
    
    switch (template.modelo) {
      case "PEARLS":
        return <PearlsForm scenarioData={mockScenarioData as any} />;
      case "TeamGAINS":
        return <TeamGainsForm scenarioData={mockScenarioData as any} />;
      case "3D":
        return <ThreeDForm scenarioData={mockScenarioData as any} />;
      case "GAS":
        return <GasForm scenarioData={mockScenarioData as any} />;
      default:
        return <p>Modelo de debriefing desconhecido.</p>;
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (!template) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Editar Template de Debriefing</h1>
          <p className="text-gray-600">Modifique seu modelo de debriefing.</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/checklists")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="templateTitle">Título do Template</Label>
            <Input
              id="templateTitle"
              value={template.titulo}
              onChange={(e) => setTemplate(t => t ? {...t, titulo: e.target.value} : null)}
              placeholder="Ex: Debriefing Padrão para RCP"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>

      {renderForm()}
    </div>
  );
};

export default EditarDebriefingTemplate;