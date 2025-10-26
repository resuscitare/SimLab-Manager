"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Save } from "lucide-react";

interface RevisaoTabProps {
  formData: any;
  frames: any[];
  palavrasChave: string[];
  checklists: {
    materiais: any;
    debriefing: any;
  };
  validarAba: (aba: string) => boolean;
  onSalvarRascunho: () => void;
  onPublicarCenario: () => void;
}

const RevisaoTab = ({
  formData,
  frames,
  palavrasChave,
  checklists,
  validarAba,
  onSalvarRascunho,
  onPublicarCenario
}: RevisaoTabProps) => {
  const abasObrigatorias = ["identificacao", "objetivos", "paciente", "frames", "materiais", "debriefing"];
  const abasIncompletas = abasObrigatorias.filter(aba => !validarAba(aba));
  const todasCompletas = abasIncompletas.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revisão Final</CardTitle>
        <CardDescription>Revise todas as informações antes de publicar</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Resumo das informações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Informações Básicas</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Nome:</span> {formData.nome || "Não definido"}</p>
                <p><span className="font-medium">Público:</span> {formData.publicoAlvo || "Não definido"}</p>
                <p><span className="font-medium">Tempo:</span> {formData.tempoExecucao || "Não definido"} min</p>
                <p><span className="font-medium">Tipo:</span> {formData.tipoSimulacao || "Não definido"}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Estatísticas</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Frames:</span> {frames.length} ({frames.filter(f => f.isCompleto).length} completos)</p>
                <p><span className="font-medium">Palavras-chave:</span> {palavrasChave.length}</p>
                <p><span className="font-medium">Checklists:</span> {(checklists.materiais ? 1 : 0) + (checklists.debriefing ? 1 : 0)} criados</p>
              </div>
            </div>
          </div>

          {/* Status das abas */}
          <div className="space-y-4">
            <h4 className="font-medium">Status das Seções</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {abasObrigatorias.map((aba) => (
                <div key={aba} className="flex items-center gap-2 p-3 border rounded-lg">
                  {validarAba(aba) ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  )}
                  <span className="text-sm capitalize">{aba}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Validação final */}
          <div className={`p-4 rounded-lg border-2 ${todasCompletas ? 'border-green-300 bg-green-50' : 'border-yellow-300 bg-yellow-50'}`}>
            <div className="flex items-start gap-3">
              {todasCompletas ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              )}
              <div>
                <h4 className="font-medium">
                  {todasCompletas ? "Cenário pronto para publicação!" : "Atenção necessária"}
                </h4>
                <div className="text-sm text-gray-600 mt-1">
                  {!todasCompletas && (
                    <p>• Complete as seguintes seções: {abasIncompletas.join(", ")}</p>
                  )}
                  {todasCompletas && (
                    <p>• Todas as seções obrigatórias foram preenchidas corretamente</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onSalvarRascunho}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Rascunho
            </Button>
            <Button onClick={onPublicarCenario} disabled={!todasCompletas}>
              Publicar Cenário
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevisaoTab;