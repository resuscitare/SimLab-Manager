"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, CheckCircle } from "lucide-react";
import { ScenarioFormData, Frame } from "@/types/prisma";

interface RevisaoTabProps {
  scenarioData: ScenarioFormData;
  frames: Frame[];
  tabs: Array<{ value: string; label: string; status: string }>;
  handleSalvarRascunho: () => void;
  handlePublicarCenario: () => void;
}

const RevisaoTab = ({
  scenarioData,
  frames,
  tabs,
  handleSalvarRascunho,
  handlePublicarCenario,
}: RevisaoTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revisão Final</CardTitle>
        <CardDescription>Revise todas as informações antes de publicar (todos os campos são opcionais)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Informações Básicas</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Título:</span> {scenarioData.title || "Não definido"}</p>
                <p><span className="font-medium">Paciente:</span> {scenarioData.patientName || "Não definido"}</p>
                <p><span className="font-medium">Idade:</span> {scenarioData.patientAge || "Não definido"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Estatísticas</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Frames:</span> {frames.length}</p>
                <p><span className="font-medium">Objetivos Técnicos:</span> {scenarioData.technicalLearningObjectives.length}</p>
                <p><span className="font-medium">Objetivos Não Técnicos:</span> {scenarioData.nonTechnicalLearningObjectives.length}</p>
                <p><span className="font-medium">Equipamentos:</span> {scenarioData.equipmentList.length}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border-2 border-green-300 bg-green-50">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Cenário pronto para publicação!</h4>
                <div className="text-sm text-gray-600 mt-1">
                  <p>• Você pode publicar o cenário mesmo com campos vazios</p>
                  <p>• Todos os campos são opcionais</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={handleSalvarRascunho}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Rascunho
            </Button>
            <Button onClick={handlePublicarCenario}>
              Publicar Cenário
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevisaoTab;