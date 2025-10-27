"use client";

import { useState } from "react";
import DebriefingModelSelector from "@/components/cenario/debriefing/DebriefingModelSelector";
import PearlsForm from "@/components/cenario/debriefing/PearlsForm";
import { ScenarioFormData } from "@/types/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DebriefingModel = "PEARLS" | "TeamGAINS" | "3D" | "GAS" | null;

interface DebriefingTabProps {
  scenarioData: ScenarioFormData;
  // onDebriefingChange: (data: any) => void;
}

const DebriefingTab = ({ scenarioData }: DebriefingTabProps) => {
  const [selectedModel, setSelectedModel] = useState<DebriefingModel>(null);

  const renderForm = () => {
    switch (selectedModel) {
      case "PEARLS":
        return <PearlsForm scenarioData={scenarioData} />;
      case "TeamGAINS":
        return <Card><CardHeader><CardTitle>Em Breve</CardTitle><CardDescription>O formulário para o modelo TeamGAINS será adicionado em breve.</CardDescription></CardHeader></Card>;
      case "3D":
        return <Card><CardHeader><CardTitle>Em Breve</CardTitle><CardDescription>O formulário para o modelo 3D será adicionado em breve.</CardDescription></CardHeader></Card>;
      case "GAS":
        return <Card><CardHeader><CardTitle>Em Breve</CardTitle><CardDescription>O formulário para o modelo GAS será adicionado em breve.</CardDescription></CardHeader></Card>;
      default:
        return <DebriefingModelSelector onSelectModel={setSelectedModel} />;
    }
  };

  return (
    <div className="space-y-6">
      {renderForm()}
    </div>
  );
};

export default DebriefingTab;