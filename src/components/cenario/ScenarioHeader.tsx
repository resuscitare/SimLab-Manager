"use client";

import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ScenarioHeaderProps {
  title: string;
  description: string;
  onCancel: () => void;
  onSaveDraft: () => void;
  showSaveButton?: boolean;
}

const ScenarioHeader = ({
  title,
  description,
  onCancel,
  onSaveDraft,
  showSaveButton = true
}: ScenarioHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        {showSaveButton && (
          <Button variant="outline" onClick={onSaveDraft}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Rascunho
          </Button>
        )}
      </div>
    </div>
  );
};

export default ScenarioHeader;