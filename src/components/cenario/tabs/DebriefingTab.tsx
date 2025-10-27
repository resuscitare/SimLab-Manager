"use client";

import { useState } from "react";
import DebriefingModelSelector from "@/components/cenario/debriefing/DebriefingModelSelector";
import PearlsForm from "@/components/cenario/debriefing/PearlsForm";
import TeamGainsForm from "@/components/cenario/debriefing/TeamGainsForm";
import ThreeDForm from "@/components/cenario/debriefing/ThreeDForm";
import GasForm from "@/components/cenario/debriefing/GasForm";
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
        return <TeamGainsForm scenarioData={scenarioData} />;
      case "3D":
        return <ThreeDForm scenarioData={scenarioData} />;
      case "GAS":
        return <GasForm scenarioData={scenarioData} />;
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