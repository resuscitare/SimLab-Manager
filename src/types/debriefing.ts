export type DebriefingModelType = "PEARLS" | "TeamGAINS" | "3D" | "GAS" | "ChecklistClinico";

export interface DebriefingTemplate {
  id: string;
  titulo: string;
  tipo: "debriefing";
  modelo: DebriefingModelType;
  cenariosAssociados?: number;
  dados: {
    descricao?: string;
    duracao?: string;
    nivelParticipantes?: string;
    objetivos?: string[];
    momentosCriticos?: { descricao: string; acaoEsperada: string; lacunaPossivel: string; }[];
    fasePreparacao?: string;
    faseReacao?: string;
    faseDescricao?: string;
    faseAnalise?: string;
    faseResumo?: string;
    recursosApoio?: { titulo: string; tipo: string; url: string; }[];
  };
  autor: string;
  dataCriacao: string;
}