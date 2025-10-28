"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Download, 
  Upload,
  Bell,
  Shield,
  Database,
  Mail,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface Configuracao {
  id: string;
  nome: string;
  valor: string | boolean | number;
  descricao: string;
  tipo: "texto" | "numero" | "boolean" | "select";
  opcoes?: string[];
}

const ConfiguracoesTab = () => {
  const [configuracoes, setConfiguracoes] = useState<Configuracao[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = () => {
    try {
      // Carregar configurações do localStorage
      const configSalvas = localStorage.getItem('configuracoes_centro_custos');
      if (configSalvas) {
        const configParseadas = JSON.parse(configSalvas);
        setConfiguracoes(configParseadas);
      } else {
        // Configurações padrão
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
          },
          {
            id: "moeda_padrao",
            nome: "Moeda Padrão",
            valor: "BRL",
            descricao: "Moeda utilizada nos relatórios financeiros",
            tipo: "select",
            opcoes: ["BRL", "USD", "EUR"]
          },
          {
            id: "backup_automatico",
            nome: "Backup Automático",
            valor: true,
            descricao: "Realizar backup automático dos dados",
            tipo: "boolean"
          },
          {
            id: "relatorio_mensal",
            nome: "Relatório Mensal Automático",
            valor: true,
            descricao: "Gerar relatório mensal automaticamente",
            tipo: "boolean"
          },
          {
            id: "limite_itens_pagina",
            nome: "Limite de Itens por Página",
            valor: 20,
            descricao: "Número máximo de itens exibidos por página nas tabelas",
            tipo: "numero"
          }
        ];
        setConfiguracoes(configPadrao);
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      showError("Erro ao carregar configurações");
      setLoading(false);
    }
  };

  const handleConfigChange = (id: string, valor: string | boolean | number) => {
    setConfiguracoes(prev => 
      prev.map(config => 
        config.id === id ? { ...config, valor } : config
      )
    );
  };

  const handleSalvarConfiguracoes = async () => {
    setSalvando(true);
    try {
      localStorage.setItem('configuracoes_centro_custos', JSON.stringify(configuracoes));
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
      const dataStr = JSON.stringify(configuracoes, null, 2);
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
        setConfiguracoes(configImportadas);
        showSuccess("Configurações importadas com sucesso!");
      } catch (error) {
        showError("Erro ao importar configurações. Verifique o formato do arquivo.");
      }
    };
    reader.readAsText(file);
  };

  const renderCampoConfiguracao = (config: Configuracao) => {
    switch (config.tipo) {
      case "texto":
        return (
          <Input
            value={config.valor as string}
            onChange={(e) => handleConfigChange(config.id, e.target.value)}
            placeholder={config.descricao}
          />
        );
      case "numero":
        return (
          <Input
            type="number"
            value={config.valor as number}
            onChange={(e) => handleConfigChange(config.id, parseInt(e.target.value) || 0)}
            placeholder={config.descricao}
          />
        );
      case "boolean":
        return (
          <Switch
            checked={config.valor as boolean}
            onCheckedChange={(checked) => handleConfigChange(config.id, checked)}
          />
        );
      case "select":
        return (
          <Select value={config.valor as string} onValueChange={(value) => handleConfigChange(config.id, value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              {config.opcoes?.map(opcao => (
                <SelectItem key={opcao} value={opcao}>
                  {opcao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            value={config.valor as string}
            onChange={(e) => handleConfigChange(config.id, e.target.value)}
            placeholder={config.descricao}
          />
        );
    }
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

      {/* Configurações Gerais */}
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
            ["nome_centro_custos", "email_responsavel", "moeda_padrao"].includes(config.id)
          ).map(config => (
            <div key={config.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={config.id}>{config.nome}</Label>
                <p className="text-sm text-gray-500">{config.descricao}</p>
              </div>
              <div>
                {renderCampoConfiguracao(config)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Configurações de Alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Configurações de Alertas
          </CardTitle>
          <CardDescription>
            Configure como e quando receber alertas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {configuracoes.filter(config => 
            ["alerta_estoque_baixo", "dias_alerta_vencimento"].includes(config.id)
          ).map(config => (
            <div key={config.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={config.id}>{config.nome}</Label>
                <p className="text-sm text-gray-500">{config.descricao}</p>
              </div>
              <div>
                {renderCampoConfiguracao(config)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Configurações de Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Configurações de Sistema
          </CardTitle>
          <CardDescription>
            Configurações avançadas do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {configuracoes.filter(config => 
            ["backup_automatico", "relatorio_mensal", "limite_itens_pagina"].includes(config.id)
          ).map(config => (
            <div key={config.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={config.id}>{config.nome}</Label>
                <p className="text-sm text-gray-500">{config.descricao}</p>
              </div>
              <div>
                {renderCampoConfiguracao(config)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Importar Configurações */}
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
                onChange={handleImportarConfiguracoes}
                className="cursor-pointer"
              />
            </div>
            <p className="text-sm text-gray-500">
              O arquivo deve estar no formato JSON e conter todas as configurações necessárias.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfiguracoesTab;