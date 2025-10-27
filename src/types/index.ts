export interface Agendamento {
  id: number;
  data: string;
  horario: string;
  tipo: string;
  instrutor: string;
  sala: string;
  status: "Confirmado" | "Pendente" | "Cancelado";
  participantes: number;
  observacoes?: string;
}

export interface Equipamento {
  id: number;
  nome: string;
  tipo: string;
  sala: string;
  status: "Disponível" | "Em Uso" | "Manutenção";
  ultimaManutencao: string;
  proximaManutencao: string;
  especificacoes?: string;
}

export interface Instrutor {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  especialidades: string[];
  status: "Ativo" | "Férias" | "Inativo";
  agendamentos: number;
  formacao?: string;
}

export interface Sala {
  id: string;
  nome: string;
  capacidade: number;
  equipamentos: string[];
  disponivel: boolean;
}

export interface Local {
  id: string;
  laboratorio: string;
  sala: string;
  armario: string;
  gaveta: string;
  descricao: string;
}