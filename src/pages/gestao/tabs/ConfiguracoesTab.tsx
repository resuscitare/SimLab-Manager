"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Download, 
  Upload,
  Sparkles
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";

interface Configuracao {
  id: string;
  nome: string;
  valor: string | boolean | number;
  descricao: string;
  tipo: "texto" | "numero" | "boolean" | "select";
  opcoes?: string[];
}

interface AgenteIA {
  id: string;
  nome: string;
  descricao: string;
  icone: any;
  ativo: boolean;
  limiteDiario: number;
  custoPorUso: number;
  modelo: string;
  parametros: Record<string, any>;
}

interface GeneralConfigSectionProps {
  configuracoes: Configuracao[];
  onConfigChange: (id: string, valor: any) => void;
}

const GeneralConfigSection = ({ configuracoes, onConfigChange }: GeneralConfigSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurações Gerais
        </CardTitle>
        <CardDescription>
          Configurações básicas do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {configuracoes.filter(config => 
          ["nome_centro_custos", "email_responsavel", "alerta_estoque_baixo", "dias_alerta_vencimento"].includes(config.id)
        ).map(config => (
          <div key={config.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={config.id}>{config.nome}</Label>
              <p className="text-sm text-gray-500">{config.descricao}</p>
            </div>
            <div>
              {config.tipo === "boolean" ? (
                <Switch
                  checked={config.valor as boolean}
                  onCheckedChange={(checked) => onConfigChange(config.id, checked)}
                />
              ) : config.tipo === "numero" ? (
                <Input
                  type="number"
                  value={config.valor as number}
                  onChange={(e) => onConfigChange(config.id, parseInt(e.target.value) || 0)}
                />
              ) : config.tipo === "select" ? (
                <Select value={config.valor as string} onValueChange={(value) => onConfigChange(config.id, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {config.opcoes?.map(opcao => (
                      <SelectItem key={opcao} value={opcao}>
                        {opcao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={config.valor as string}
                  onChange={(e) => onConfigChange(config.id, e.target.value)}
                />
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

interface AIAgentsSectionProps {
  agentesIA: AgenteIA[];
  onAgenteChange: (id: string, campo: keyof AgenteIA, valor: any) => void;
  onParametroChange: (agenteId: string, parametro: string, valor: any) => void;
}

const AIAgentsSection = ({ agentesIA, onAgenteChange, onParametroChange }: AIAgentsSectionProps) => {
  const formatarValorParaInput = (valor: number): string => {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const converterInputParaNumero = (valor: string): number => {
    const numeroLimpo = valor.replace(/\./g, '').replace(',', '.');
    return parseFloat(numeroLimpo) || 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Agentes de IA
        </CardTitle>
        <CardDescription>
          Configure os agentes de inteligência artificial disponíveis no sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {agentesIA.map((agente) => {
          const IconComponent = agente.icone;
          return (
            <Card key={agente.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      agente.ativo ? "bg-blue-100" : "bg-gray-100"
                    )}>
                      <IconComponent className={cn(
                        "h-5 w-5",
                        agente.ativo ? "text-blue-600" : "text-gray-400"
                      )} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{agente.nome}</h4>
                      <p className="text-sm text-gray-600">{agente.descricao}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={agente.ativo ? "default" : "secondary"}>
                      {agente.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                    <Switch
                      checked={agente.ativo}
                      onCheckedChange={(checked) => onAgenteChange(agente.id, 'ativo', checked)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Limite Diário</Label>
                    <Input
                      type="number"
                      value={agente.limiteDiario}
                      onChange={(e) => onAgenteChange(agente.id, 'limiteDiario', parseInt(e.target.value) || 0)}
                      placeholder="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Custo por Uso (R$)</Label>
                    <Input
                      value={formatarValorParaInput(agente.custoPorUso)}
                      onChange={(e) => onAgenteChange(agente.id, 'custoPorUso', converterInputParaNumero(e.target.value))}
                      placeholder="0,08"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Modelo</Label>
                    <Select value={agente.modelo} onValueChange={(value) => onAgenteChange(agente.id, 'modelo', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3">Claude 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h5 className="font-medium mb-3">Parâmetros Avançados</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Temperatura</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="2"
                        value={agente.parametros.temperatura}
                        onChange={(e) => onParametroChange(agente.id, 'temperatura', parseFloat(e.target.value) || 0.7)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Tokens</Label>
                      <Input
                        type="number"
                        value={agente.parametros.maxTokens}
                        onChange={(e) => onParametroChange(agente.id, 'maxTokens', parseInt(e.target.value) || 1000)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contexto</Label>
                      <Input
                        value={agente.parametros.contexto}
                        onChange={(e) => onParametroChange(agente.id, 'contexto', e.target.value)}
                        placeholder="cenarios_simulacao"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};

interface ImportSectionProps {
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImportSection = ({ onImport }: ImportSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Importar Configurações
        </CardTitle>
        <CardDescription>
          Importe configurações de um arquivo JSON
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="configFile">Selecione o arquivo de configurações</Label>
            <Input
              id="configFile"
              type="file"
              accept=".json"
              onChange={onImport}
              className="cursor-pointer"
            />
          </div>
          <p className="text-sm text-gray-500">
            O arquivo deve estar no formato JSON e conter todas as configurações necessárias.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const ConfiguracoesTab = () => {
  const [configuracoes, setConfiguracoes] = useState<Configuracao[]>([]);
  const [agentesIA, setAgentesIA] = useState<AgenteIA[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    try {
      const configSalvas = localStorage.getItem('configuracoes_centro_custos');
      if (configSalvas) {
        setConfiguracoes(JSON.parse(configSalvas));
      }

      const agentesSalvos = localStorage.getItem('configuracoes_agentes_ia');
      if (agentesSalvos) {
        setAgentesIA(JSON.parse(agentesSalvos));
      } else {
        // Agentes IA padrão
        const agentesPadrao: AgenteIA[] = [
          {
            id: "assistente-cenarios",
            nome: "Assistente de Cenários",
            descricao: "Gera sugestões para criação de cenários de simulação",
            icone: () => null, // Placeholder, será substituído pelos ícones reais
            ativo: true,
            limiteDiario: 50,
            custoPorUso: 0.08,
            modelo: "gpt-4o-mini",
            parametros: {
              temperatura: 0.7,
              maxTokens: 1000,
              contexto: "cenarios_simulacao"
            }
          },
          {
            id: "assistente-debriefing",
            nome: "Assistente de Debriefing",
            descricao: "Gera scripts e sugestões para sessões de debriefing",
            icone: () => null,
            ativo: true,
            limiteDiario: 30,
            custoPorUso: 0.12,
            modelo: "gpt-4o",
            parametros: {
              temperatura: 0.6,
              maxTokens: 1500,
              contexto: "debriefing_medico"
            }
          },
          {
            id: "analisador-performance",
            nome: "Analisador de Performance",
            descricao: "Analisa dados de performance e gera relatórios",
            icone: () => null,
            ativo: false,
            limiteDiario: 20,
            custoPorUso: 0.15,
            modelo: "gpt-4o",
            parametros: {
              temperatura: 0.5,
              maxTokens: 2000,
              contexto: "analise_performance"
            }
          },
          {
            id: "gerador-relatorios",
            nome: "Gerador de Relatórios",
            descricao: "Cria relatórios automatizados e insights",
            icone: () => null,
            ativo: true,
            limiteDiario: 10,
            custoPorUso: 0.20,
            modelo: "gpt-4o",
            parametros: {
              temperatura: 0.4,
              maxTokens: 3000,
              contexto: "relatorios_gerenciais"
            }
          }
        ];
        setAgentesIA(agentesPadrao);
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      showError("Erro ao carregar configurações");
      setLoading(false);
    }
  };

  const handleSalvarConfiguracoes = async () => {
    setSalvando(true);
    try {
      localStorage.setItem('configuracoes_centro_custos', JSON.stringify(configuracoes));
      localStorage.setItem('configuracoes_agentes_ia', JSON.stringify(agentesIA));
      showSuccess("Configurações salvas com sucesso!");
    } catch (error) {
      showError("Erro ao salvar configurações");
    } finally {
      setSalvando(false);
    }
  };

  const handleRestaurarPadroes = () => {
    if (confirm("Tem certeza que deseja restaurar as configurações padrão? Isso irá substituir todas as configurações atuais.")) {
      const configPadrao: Configuracao[] = [
        {
          id: "nome_centro_custos",
          nome: "Nome do Centro de Custos",
          valor: "Centro de Custos Principal",
          descricao: "Nome identificador do centro de custos",
          tipo: "texto"
        },
        {
          id: "email_responsavel",
          nome: "Email do Responsável",
          valor: "responsavel@exemplo.com",
          descricao: "Email para notificações importantes",
          tipo: "texto"
        },
        {
          id: "alerta_estoque_baixo",
          nome: "Alerta de Estoque Baixo",
          valor: true,
          descricao: "Ativar alertas quando estoque estiver abaixo do mínimo",
          tipo: "boolean"
        },
        {
          id: "dias_alerta_vencimento",
          nome: "Dias para Alerta de Vencimento",
          valor: 30,
          descricao: "Número de dias antes do vencimento para alertar",
          tipo: "numero"
        }
      ];
      setConfiguracoes(configPadrao);
      showSuccess("Configurações restauradas com sucesso!");
    }
  };

  const handleExportarConfiguracoes = () => {
    try {
      const dataStr = JSON.stringify({ configuracoes, agentesIA }, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `configuracoes_centro_custos_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      showSuccess("Configurações exportadas com sucesso!");
    } catch (error) {
      showError("Erro ao exportar configurações");
    }
  };

  const handleImportarConfiguracoes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const configImportadas = JSON.parse(text);
        if (configImportadas.configuracoes) {
          setConfiguracoes(configImportadas.configuracoes);
        }
        if (configImportadas.agentesIA) {
          setAgentesIA(configImportadas.agentesIA);
        }
        showSuccess("Configurações importadas com sucesso!");
      } catch (error) {
        showError("Erro ao importar configurações. Verifique o formato do arquivo.");
      }
    };
    reader.readAsText(file);
  };

  const handleConfigChange = (id: string, valor: any) => {
    setConfiguracoes(prev => 
      prev.map(config => config.id === id ? { ...config, valor } : config)
    );
  };

  const handleAgenteChange = (id: string, campo: keyof AgenteIA, valor: any) => {
    setAgentesIA(prev => 
      prev.map(agente => 
        agente.id === id ? { ...agente, [campo]: valor } : agente
      )
    );
  };

  const handleParametroChange = (agenteId: string, parametro: string, valor: any) => {
    setAgentesIA(prev => 
      prev.map(agente => 
        agente.id === agenteId 
          ? { ...agente, parametros: { ...agente.parametros, [parametro]: valor } }
          : agente
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-2 text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-gray-600">Gerencie as configurações do centro de custos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportarConfiguracoes}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" onClick={handleRestaurarPadroes}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Restaurar Padrões
          </Button>
          <Button onClick={handleSalvarConfiguracoes} disabled={salvando}>
            <Save className="h-4 w-4 mr-2" />
            {salvando ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      <GeneralConfigSection 
        configuracoes={configuracoes} 
        onConfigChange={handleConfigChange} 
      />

      <AIAgentsSection 
        agentesIA={agentesIA} 
        onAgenteChange={handleAgenteChange}
        onParametroChange={handleParametroChange}
      />

      <ImportSection onImport={handleImportarConfiguracoes} />
    </div>
  );
};

export default ConfiguracoesTab;