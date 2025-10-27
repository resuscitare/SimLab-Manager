export type DebriefingModelType = "PEARLS" | "TeamGAINS" | "3D" | "GAS";

export interface DebriefingTemplate {
  id: string;
  titulo: string;
  tipo: "debriefing";
  modelo: DebriefingModelType;
  dados: any; // Placeholder for form data
  autor: string;
  dataCriacao: string;
  cenariosAssociados?: number; // Optional, can be calculated
  itens?: number; // Optional, can be calculated
}