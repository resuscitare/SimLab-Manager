"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, AlertCircle, CheckCircle } from "lucide-react";
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
  const todasValidas = tabs.every(tab => tab.status === 'completo');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revisão Final</CardTitle>
        <CardDescription>Revise todas as informações antes de publicar</CardDescription>
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

          <div className={`p-4 rounded-lg border-2 ${todasValidas ? 'border-green-300 bg-green-50' : 'border-yellow-300 bg-yellow-50'}`}>
            <div className="flex items-start gap-3">
              {todasValidas ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              )}
              <div>
                <h4 className="font-medium">
                  {todasValidas
                    ? "Cenário pronto para publicação!"
                    : "Atenção necessária"
                  }
                </h4>
                <div className="text-sm text-gray-600 mt-1">
                  {!todasValidas && (
                    <p>• Complete as seções incompletas antes de publicar</p>
                  )}
                  {todasValidas && (
                    <p>• Todas as seções obrigatórias foram preenchidas</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={handleSalvarRascunho}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Rascunho
            </Button>
            <Button onClick={handlePublicarCenario} disabled={!todasValidas}>
              Publicar Cenário
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevisaoTab;