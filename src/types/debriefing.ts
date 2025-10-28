export type DebriefingModelType = "PEARLS" | "TeamGAINS" | "3D" | "GAS";

export interface DebriefingTemplate {
  id: string;
  titulo: string;
  tipo: "debriefing";
  modelo: DebriefingModelType;
  dados: {
    descricao?: string;
    duracao?: string;
    nivelParticipantes?: string;
    objetivos?: string[];
    momentosCriticos?: Array<{
      descricao: string;
      acaoEsperada: string;
      lacunaPossivel: string;
    }>;
    fasePreparacao?: string;
    faseReacao?: string;
    faseDescricao?: string;
    faseAnalise?: string;
    faseResumo?: string;
    perguntasCirculares?: string[];
    recursosApoio?: Array<{
      nome: string;
      link: string;
    }>;
  };
  autor: string;
  dataCriacao: string;
  cenariosAssociados?: number;
  itens?: number;
}

export interface DebriefingSession {
  id: string;
  cenarioId: string;
  templateId: string;
  data: string;
  duracao: number;
  participantes: string[];
  pontosPositivos: string[];
  pontosMelhoria: string[];
  acoesFuturas: string[];
  feedbackFacilitador: string;
}