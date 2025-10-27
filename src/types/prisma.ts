export interface HistoricoMedico {
  dm: boolean;
  has: boolean;
  asma: boolean;
  alergias: boolean;
  alergiasDesc?: string;
  etilismo: boolean;
  tabagismo: boolean;
  tabagismoDesc?: string;
  outros: boolean;
  outrosDesc?: string;
}

export interface SmartObjectives {
  specific?: string;
  measurable?: string;
  achievable?: string;
  relevant?: string;
  timeBound?: string;
}

export interface EquipmentItem {
  id: string;
  modelName: string;
  brand: string;
  quantity: string;
  observations: string;
}

export interface Scenario {
  id: string;
  title: string;
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  patientHeight?: string;
  patientWeight?: string;
  perfilFisico?: string;
  perfilPsicologico?: string;
  perfilTecnico?: string;
  atualizadoEm?: string;
  historicoMedico?: HistoricoMedico;
  acompanhamentoMedico?: string;
  medicacoesEmUso?: string;
  cirurgiasAnteriores?: string;
  scenarioOutline?: string;
  learnerBrief?: string;
  smartObjectives?: string; // Stays as JSON string for the data model
  technicalLearningObjectives: string[];
  nonTechnicalLearningObjectives: string[];
  equipmentList: EquipmentItem[];
  requiredResources: Resource[];
  initialFrameId?: string;
  initialFrame?: Frame;
  frames: Frame[];
  checklist?: Checklist;
  createdAt: Date;
  updatedAt: Date;
}

export interface Frame {
  id: string;
  scenarioId: string;
  scenario?: Scenario;
  frameIdentifier: string;
  title: string;
  durationEstimateMin?: number;
  participantType?: string;
  parameterSet?: ParameterSet;
  otherFindings?: string;
  operatorInstructions: OperatorInstruction[];
  expectedParticipantActions: ExpectedAction[];
  sourceTransitions: TransitionCondition[];
  targetTransitions: TransitionCondition[];
  isInitialForScenario?: Scenario;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParameterSet {
  id: string;
  frameId: string;
  frame?: Frame;
  
  // Parâmetros Fisiológicos Principais
  FC?: number;
  FC_tooltip?: string;
  ECGDescription?: string;
  ECGDescription_tooltip?: string;
  Pulse?: number;
  Pulse_tooltip?: string;
  SatO2?: number;
  SatO2_tooltip?: string;
  PASist?: number;
  PASist_tooltip?: string;
  PADiast?: number;
  PADiast_tooltip?: string;
  PAMean?: number;
  PAMean_tooltip?: string;
  PAPSist?: number;
  PAPSist_tooltip?: string;
  PAPDiast?: number;
  PAPDiast_tooltip?: string;
  PAPMean?: number;
  PAPMean_tooltip?: string;
  WPMean?: number;
  WPMean_tooltip?: string;
  CVPMean?: number;
  CVPMean_tooltip?: string;
  CO?: number;
  CO_tooltip?: string;
  
  // Parâmetros Respiratórios
  FR?: number;
  FR_tooltip?: string;
  etCO2?: number;
  etCO2_tooltip?: string;
  iCO2?: number;
  iCO2_tooltip?: string;
  inO2?: number;
  inO2_tooltip?: string;
  etO2?: number;
  etO2_tooltip?: string;
  
  // Parâmetros de Temperatura
  Temp?: number;
  Temp_tooltip?: string;
  Tblood?: number;
  Tblood_tooltip?: string;
  
  // Parâmetros Neurológicos / Gases / Outros
  ICPMean?: number;
  ICPMean_tooltip?: string;
  Glicemia?: number;
  Glicemia_tooltip?: string;
  Pupilas?: string;
  Pupilas_tooltip?: string;
  pH?: number;
  pH_tooltip?: string;
  inN2O?: number;
  inN2O_tooltip?: string;
  etN2O?: number;
  etN2O_tooltip?: string;
  anestheticAgent?: AgentType;
  anestheticAgent_tooltip?: string;
  inAGT?: number;
  inAGT_tooltip?: string;
  etAGT?: number;
  etAGT_tooltip?: string;
  TOFCount?: number;
  TOFCount_tooltip?: string;
  TOFRatio?: number;
  TOFRatio_tooltip?: string;
  PTC?: number;
  PTC_tooltip?: string;
  
  // PANI (Pressão Arterial Não Invasiva)
  PANISist?: number;
  PANISist_tooltip?: string;
  PANIDiast?: number;
  PANIDiast_tooltip?: string;
  PANIMean?: number;
  PANIMean_tooltip?: string;
  
  // Campos Texto Livre
  OtherParametersText?: string;
  OtherParametersText_tooltip?: string;
  dynamicDescription?: string;
  dynamicDescription_tooltip?: string;
}

export interface OperatorInstruction {
  id: string;
  frameId: string;
  frame?: Frame;
  instructionText: string;
  order?: number;
  createdAt: Date;
}

export interface ExpectedAction {
  id: string;
  frameId: string;
  frame?: Frame;
  actionText: string;
  isCritical?: boolean;
  createdAt: Date;
}

export interface TransitionCondition {
  id: string;
  sourceFrameId: string;
  sourceFrame?: Frame;
  targetFrameId: string;
  targetFrame?: Frame;
  description: string;
  logicType?: LogicType;
  relatedEvent?: string;
  timeCondition?: string;
  parameterCondition?: string;
  createdAt: Date;
}

export interface Resource {
  id: string;
  scenarioId: string;
  scenario?: Scenario;
  fileName: string;
  type: ResourceType;
  description?: string;
  createdAt: Date;
}

export interface Checklist {
  id: string;
  title: string;
  scenarioId: string;
  scenario?: Scenario;
  items: any; // Json type
  createdAt: Date;
  updatedAt: Date;
}

export enum ResourceType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  PDF = 'PDF',
  TREND_FILE = 'TREND_FILE',
  OTHER = 'OTHER'
}

export enum LogicType {
  TIME_BASED = 'TIME_BASED',
  EVENT_BASED = 'EVENT_BASED',
  PARAMETER_BASED = 'PARAMETER_BASED',
  COMBINED = 'COMBINED',
  MANUAL = 'MANUAL'
}

export enum AgentType {
  HAL = 'HAL',
  ISO = 'ISO',
  ENF = 'ENF',
  SEV = 'SEV',
  DES = 'DES'
}

// Helper types for form handling
export interface FrameFormData {
  frameIdentifier: string;
  title: string;
  durationEstimateMin: number;
  participantType: string;
  otherFindings: string;
  parameters: Partial<ParameterSet>;
  operatorInstructions: string[];
  expectedActions: string[];
}

export interface ScenarioFormData {
  title: string;
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  patientHeight?: string;
  patientWeight?: string;
  perfilFisico?: string;
  perfilPsicologico?: string;
  perfilTecnico?: string;
  atualizadoEm?: string;
  historicoMedico?: HistoricoMedico;
  acompanhamentoMedico?: string;
  medicacoesEmUso?: string;
  cirurgiasAnteriores?: string;
  scenarioOutline?: string;
  learnerBrief?: string;
  smartObjectives?: SmartObjectives;
  technicalLearningObjectives: string[];
  nonTechnicalLearningObjectives: string[];
  equipmentList: EquipmentItem[];
}