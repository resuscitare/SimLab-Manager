export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateScenarioIdentification = (formData: {
  nome: string;
  publicoAlvo: string;
  tempoExecucao: string;
  tipoSimulacao: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!formData.nome.trim()) {
    errors.push("Nome do cenário é obrigatório");
  } else if (formData.nome.trim().length < 5) {
    errors.push("Nome do cenário deve ter pelo menos 5 caracteres");
  }

  if (!formData.publicoAlvo) {
    errors.push("Público-alvo é obrigatório");
  }

  if (!formData.tempoExecucao) {
    errors.push("Tempo de execução é obrigatório");
  } else if (parseInt(formData.tempoExecucao) < 1) {
    errors.push("Tempo de execução deve ser maior que 0");
  }

  if (!formData.tipoSimulacao) {
    errors.push("Tipo de simulação é obrigatório");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateScenarioObjectives = (formData: {
  objetivosTecnicos: string;
  objetivosNaoTecnicos: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!formData.objetivosTecnicos.trim()) {
    errors.push("Objetivos técnicos são obrigatórios");
  } else if (formData.objetivosTecnicos.trim().split('\n').filter(line => line.trim()).length < 2) {
    errors.push("Pelo menos 2 objetivos técnicos são necessários");
  }

  if (!formData.objetivosNaoTecnicos.trim()) {
    errors.push("Objetivos não técnicos são obrigatórios");
  } else if (formData.objetivosNaoTecnicos.trim().split('\n').filter(line => line.trim()).length < 2) {
    errors.push("Pelo menos 2 objetivos não técnicos são necessários");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePatientProfile = (formData: {
  nomePaciente: string;
  idade: string;
  sexo: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!formData.nomePaciente.trim()) {
    errors.push("Nome do paciente é obrigatório");
  }

  if (!formData.idade) {
    errors.push("Idade é obrigatória");
  } else {
    const idade = parseInt(formData.idade);
    if (idade < 0 || idade > 120) {
      errors.push("Idade deve estar entre 0 e 120 anos");
    }
  }

  if (!formData.sexo) {
    errors.push("Sexo é obrigatório");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateFrames = (frames: any[]): ValidationResult => {
  const errors: string[] = [];

  if (frames.length < 3) {
    errors.push("Pelo menos 3 frames são necessários");
  }

  const incompleteFrames = frames.filter(frame => !frame.isCompleto);
  if (incompleteFrames.length > 0) {
    errors.push(`${incompleteFrames.length} frame(s) precisam ser completados`);
  }

  const framesWithVitals = frames.filter(frame => 
    frame.fc !== undefined || frame.satO2 !== undefined || frame.paSistolica !== undefined
  );
  if (framesWithVitals.length === 0) {
    errors.push("Pelo menos um frame deve conter sinais vitais");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateChecklists = (checklists: {
  materiais: any;
  debriefing: any;
}): ValidationResult => {
  const errors: string[] = [];

  if (!checklists.materiais) {
    errors.push("Checklist de materiais é obrigatório");
  }

  if (!checklists.debriefing) {
    errors.push("Checklist de debriefing é obrigatório");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateCompleteScenario = (
  formData: any,
  frames: any[],
  checklists: any
): ValidationResult => {
  const validations = [
    validateScenarioIdentification(formData),
    validateScenarioObjectives(formData),
    validatePatientProfile(formData),
    validateFrames(frames),
    validateChecklists(checklists)
  ];

  const allErrors = validations.flatMap(validation => validation.errors);
  const allValid = validations.every(validation => validation.isValid);

  return {
    isValid: allValid,
    errors: allErrors
  };
};