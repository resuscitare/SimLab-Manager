"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Sparkles, 
  Copy, 
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  Heart,
  Thermometer,
  Gauge,
  Eye,
  MessageSquare,
  User,
  Wind,
  Brain,
  Droplet
} from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Frame, ParameterSet } from "@/types/prisma";

interface PrismaFramesTabProps {
  frames: Frame[];
  onFramesChange: (frames: Frame[]) => void;
}

const PrismaFramesTab = ({ frames, onFramesChange }: PrismaFramesTabProps) => {
  const [frameExpandido, setFrameExpandido] = useState<string | null>(frames[0]?.id || null);
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'completos' | 'incompletos'>('todos');

  // Estatísticas dos frames
  const stats = useMemo(() => {
    const completos = frames.filter(f => f.parameterSet).length;
    const incompletos = frames.length - completos;
    const duracaoTotal = frames.reduce((acc, f) => acc + (f.durationEstimateMin || 0), 0);
    
    return {
      total: frames.length,
      completos,
      incompletos,
      duracaoTotal,
      percentualCompleto: frames.length > 0 ? Math.round((completos / frames.length) * 100) : 0
    };
  }, [frames]);

  // Frames filtrados
  const framesFiltrados = useMemo(() => {
    return frames.filter(frame => {
      if (filtroStatus === 'completos') return !!frame.parameterSet;
      if (filtroStatus === 'incompletos') return !frame.parameterSet;
      return true;
    });
  }, [frames, filtroStatus]);

  const adicionarFrame = useCallback(() => {
    const novoFrame: Frame = {
      id: Date.now().toString(),
      scenarioId: "temp", // Will be set when saving
      frameIdentifier: (frames.length + 1).toString(),
      title: `Frame ${frames.length + 1}`,
      durationEstimateMin: 5,
      participantType: "Simulador",
      operatorInstructions: [],
      expectedParticipantActions: [],
      sourceTransitions: [],
      targetTransitions: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const novosFrames = [...frames, novoFrame];
    onFramesChange(novosFrames);
    setFrameExpandido(novoFrame.id);
  }, [frames, onFramesChange]);

  const removerFrame = useCallback((id: string) => {
    if (frames.length <= 1) return;
    
    const novosFrames = frames
      .filter(frame => frame.id !== id)
      .map((frame, index) => ({ 
        ...frame, 
        frameIdentifier: (index + 1).toString() 
      }));
    
    onFramesChange(novosFrames);
    
    if (frameExpandido === id) {
      setFrameExpandido(novosFrames[0]?.id || null);
    }
  }, [frames, onFramesChange, frameExpandido]);

  const duplicarFrame = useCallback((frameOriginal: Frame) => {
    const novoFrame: Frame = {
      ...frameOriginal,
      id: Date.now().toString(),
      frameIdentifier: (frames.length + 1).toString(),
      title: `${frameOriginal.title} (Cópia)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const novosFrames = [...frames, novoFrame];
    onFramesChange(novosFrames);
    setFrameExpandido(novoFrame.id);
  }, [frames, onFramesChange]);

  const atualizarFrame = useCallback((id: string, campo: string, valor: any) => {
    const novosFrames = frames.map(frame => {
      if (frame.id === id) {
        return { ...frame, [campo]: valor, updatedAt: new Date() };
      }
      return frame;
    });
    
    onFramesChange(novosFrames);
  }, [frames, onFramesChange]);

  const atualizarParametro = useCallback((frameId: string, campo: keyof ParameterSet, valor: any) => {
    const novosFrames = frames.map(frame => {
      if (frame.id === frameId) {
        const parametrosAtuais = frame.parameterSet || {
          id: Date.now().toString(),
          frameId: frameId
        };
        
        const parametrosAtualizados = {
          ...parametrosAtuais,
          [campo]: valor
        };
        
        return { 
          ...frame, 
          parameterSet: parametrosAtualizados,
          updatedAt: new Date()
        };
      }
      return frame;
    });
    
    onFramesChange(novosFrames);
  }, [frames, onFramesChange]);

  const gerarSugestaoSinaisVitais = useCallback((frameId: string) => {
    // Simulação de sugestão de IA baseada no tipo de cenário
    const sugestoes: Partial<ParameterSet> = {
      // Parâmetros Circulatórios
      FC: 85,
      Pulse: 85,
      SatO2: 94,
      PASist: 120,
      PADiast: 80,
      PAMean: 93,
      
      // Parâmetros Respiratórios
      FR: 18,
      etCO2: 35,
      inO2: 21,
      
      // Temperatura
      Temp: 36.8,
      
      // Outros
      Glicemia: 95,
      Pupilas: "Isocóricas fotorreagentes"
    };
    
    Object.entries(sugestoes).forEach(([campo, valor]) => {
      if (campo !== undefined && valor !== undefined) {
        atualizarParametro(frameId, campo as keyof ParameterSet, valor);
      }
    });
  }, [atualizarParametro]);

  const getParametroIcon = (parametro: string) => {
    const iconMap: Record<string, any> = {
      FC: Heart,
      Pulse: Heart,
      SatO2: Eye,
      PASist: Gauge,
      PADiast: Gauge,
      PAMean: Gauge,
      FR: Wind,
      etCO2: Droplet,
      Temp: Thermometer,
      Glicemia: Brain,
      Pupilas: Eye
    };
    return iconMap[parametro] || Activity;
  };

  const getParametroLabel = (parametro: string) => {
    const labelMap: Record<string, string> = {
      FC: "FC (bpm)",
      Pulse: "Pulso (bpm)",
      SatO2: "SatO₂ (%)",
      PASist: "PA Sistólica",
      PADiast: "PA Diastólica",
      PAMean: "PA Média",
      FR: "FR (rpm)",
      etCO2: "etCO₂ (mmHg)",
      inO2: "FiO₂ (%)",
      Temp: "Temp (°C)",
      Glicemia: "Glicemia (mg/dL)",
      Pupilas: "Pupilas"
    };
    return labelMap[parametro] || parametro;
  };

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Frames do Cenário</CardTitle>
              <CardDescription>Defina a progressão fisiológica e comportamental do caso clínico</CardDescription>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm">Filtro:</Label>
                <Select value={filtroStatus} onValueChange={(value: 'todos' | 'completos' | 'incompletos') => setFiltroStatus(value)}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="completos">Completos</SelectItem>
                    <SelectItem value="incompletos">Incompletos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-blue-600">Total</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.completos}</div>
              <div className="text-sm text-green-600">Completos</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.incompletos}</div>
              <div className="text-sm text-yellow-600">Incompletos</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.duracaoTotal}min</div>
              <div className="text-sm text-purple-600">Duração</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{stats.percentualCompleto}%</div>
              <div className="text-sm text-gray-600">Progresso</div>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.percentualCompleto}%` }}
            />
          </div>

          {/* Controles */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge variant={frames.length >= 3 ? "default" : "destructive"}>
                {frames.length} frames
              </Badge>
              {frames.length < 3 && (
                <Badge variant="outline" className="text-yellow-600">
                  Mínimo: 3 frames
                </Badge>
              )}
            </div>
            
            <Button onClick={adicionarFrame} disabled={frames.length >= 10}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Frame
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Frames */}
      <div className="space-y-4">
        {framesFiltrados.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {filtroStatus === 'todos' 
                  ? "Nenhum frame criado ainda. Clique em 'Adicionar Frame' para começar."
                  : `Nenhum frame ${filtroStatus === 'completos' ? 'completo' : 'incompleto'} encontrado.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          framesFiltrados.map((frame, index) => (
            <Card key={frame.id} className={cn(
              "transition-all duration-200",
              frame.parameterSet ? "border-green-300" : "border-yellow-300"
            )}>
              {/* Cabeçalho do Frame */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-3">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  
                  <Badge variant={frame.parameterSet ? "default" : "secondary"} className={cn(
                    "flex items-center gap-1",
                    frame.parameterSet ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  )}>
                    {frame.parameterSet ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    Frame {frame.frameIdentifier}
                  </Badge>
                  
                  <Input
                    value={frame.title}
                    onChange={(e) => atualizarFrame(frame.id, 'title', e.target.value)}
                    placeholder="Nome da etapa"
                    className="w-64 font-medium"
                  />
                  
                  {frame.durationEstimateMin && (
                    <Badge variant="outline" className="text-xs">
                      {frame.durationEstimateMin}min
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => gerarSugestaoSinaisVitais(frame.id)}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    IA
                  </Button>
                  
                  <Button variant="ghost" size="icon" onClick={() => duplicarFrame(frame)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFrameExpandido(frameExpandido === frame.id ? null : frame.id)}
                  >
                    {frameExpandido === frame.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removerFrame(frame.id)}
                    disabled={frames.length <= 1}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Conteúdo Expandido */}
              {frameExpandido === frame.id && (
                <div className="p-6 space-y-6">
                  {/* Informações Básicas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Identificador do Frame</Label>
                      <Input
                        value={frame.frameIdentifier}
                        onChange={(e) => atualizarFrame(frame.id, 'frameIdentifier', e.target.value)}
                        placeholder="Ex: 1, 2A, Piora"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Duração Estimada (minutos)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="60"
                        value={frame.durationEstimateMin || ''}
                        onChange={(e) => atualizarFrame(frame.id, 'durationEstimateMin', parseInt(e.target.value) || 5)}
                        placeholder="5"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Tipo de Participante</Label>
                      <Select value={frame.participantType} onValueChange={(value) => atualizarFrame(frame.id, 'participantType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Simulador">Simulador</SelectItem>
                          <SelectItem value="Paciente Padronizado">Paciente Padronizado</SelectItem>
                          <SelectItem value="Staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  {/* Parâmetros Fisiológicos - Organizados por Categoria */}
                  <Tabs defaultValue="circulatorio" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="circulatorio">Circulatório</TabsTrigger>
                      <TabsTrigger value="respiratorio">Respiratório</TabsTrigger>
                      <TabsTrigger value="outros">Outros</TabsTrigger>
                      <TabsTrigger value="instrucoes">Instruções</TabsTrigger>
                    </TabsList>

                    {/* Parâmetros Circulatórios */}
                    <TabsContent value="circulatorio" className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          Parâmetros Circulatórios
                        </h4>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => gerarSugestaoSinaisVitais(frame.id)}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          Sugerir com IA
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[
                          { field: 'FC' as keyof ParameterSet, icon: Heart, color: 'text-red-500' },
                          { field: 'Pulse' as keyof ParameterSet, icon: Heart, color: 'text-red-400' },
                          { field: 'SatO2' as keyof ParameterSet, icon: Eye, color: 'text-blue-500' },
                          { field: 'PASist' as keyof ParameterSet, icon: Gauge, color: 'text-green-500' },
                          { field: 'PADiast' as keyof ParameterSet, icon: Gauge, color: 'text-green-400' },
                          { field: 'PAMean' as keyof ParameterSet, icon: Gauge, color: 'text-green-600' },
                          { field: 'CO' as keyof ParameterSet, icon: Activity, color: 'text-purple-500' }
                        ].map(({ field, icon: Icon, color }) => (
                          <div key={field} className="space-y-2">
                            <Label className="flex items-center gap-1 text-sm">
                              <Icon className={`h-3 w-3 ${color}`} />
                              {getParametroLabel(field)}
                            </Label>
                            <Input
                              type="number"
                              value={frame.parameterSet?.[field] || ''}
                              onChange={(e) => atualizarParametro(frame.id, field, e.target.value ? parseFloat(e.target.value) : undefined)}
                              placeholder="---"
                              className="text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Parâmetros Respiratórios */}
                    <TabsContent value="respiratorio" className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Wind className="h-4 w-4 text-blue-500" />
                        Parâmetros Respiratórios
                      </h4>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          { field: 'FR' as keyof ParameterSet, icon: Wind, color: 'text-blue-500' },
                          { field: 'etCO2' as keyof ParameterSet, icon: Droplet, color: 'text-cyan-500' },
                          { field: 'inO2' as keyof ParameterSet, icon: Activity, color: 'text-orange-500' }
                        ].map(({ field, icon: Icon, color }) => (
                          <div key={field} className="space-y-2">
                            <Label className="flex items-center gap-1 text-sm">
                              <Icon className={`h-3 w-3 ${color}`} />
                              {getParametroLabel(field)}
                            </Label>
                            <Input
                              type="number"
                              value={frame.parameterSet?.[field] || ''}
                              onChange={(e) => atualizarParametro(frame.id, field, e.target.value ? parseFloat(e.target.value) : undefined)}
                              placeholder="---"
                              className="text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Outros Parâmetros */}
                    <TabsContent value="outros" className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-500" />
                        Outros Parâmetros
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              { field: 'Temp' as keyof ParameterSet, label: 'Temp (°C)' },
                              { field: 'Glicemia' as keyof ParameterSet, label: 'Glicemia (mg/dL)' }
                            ].map(({ field, label }) => (
                              <div key={field} className="space-y-2">
                                <Label className="text-sm">{label}</Label>
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={frame.parameterSet?.[field] || ''}
                                  onChange={(e) => atualizarParametro(frame.id, field, e.target.value ? parseFloat(e.target.value) : undefined)}
                                  placeholder="---"
                                  className="text-sm"
                                />
                              </div>
                            ))}
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm">Pupilas</Label>
                            <Input
                              value={frame.parameterSet?.Pupilas || ''}
                              onChange={(e) => atualizarParametro(frame.id, 'Pupilas', e.target.value)}
                              placeholder="Ex: Isocóricas fotorreagentes"
                              className="text-sm"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Achados Clínicos Adicionais</Label>
                            <Textarea
                              value={frame.otherFindings || ''}
                              onChange={(e) => atualizarFrame(frame.id, 'otherFindings', e.target.value)}
                              placeholder="Ex: Ausculta pulmonar normal, pele pálida e úmida..."
                              rows={3}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm">Descrição Dinâmica</Label>
                            <Textarea
                              value={frame.parameterSet?.dynamicDescription || ''}
                              onChange={(e) => atualizarParametro(frame.id, 'dynamicDescription', e.target.value)}
                              placeholder="Como os parâmetros devem mudar neste frame..."
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Instruções e Ações Esperadas */}
                    <TabsContent value="instrucoes" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-medium flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                            Instruções para Operador
                          </h4>
                          <Textarea
                            placeholder="Instruções específicas para o operador do simulador..."
                            rows={4}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-medium flex items-center gap-2">
                            <User className="h-4 w-4 text-green-500" />
                            Ações Esperadas dos Participantes
                          </h4>
                          <Textarea
                            placeholder="Ações esperadas dos participantes neste frame..."
                            rows={4}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Validação Geral */}
      {frames.length > 0 && (
        <Card className={cn(
          "border-2",
          frames.length >= 3 && stats.completos >= 3 
            ? "border-green-300 bg-green-50" 
            : "border-yellow-300 bg-yellow-50"
        )}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              {frames.length >= 3 && stats.completos >= 3 ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              )}
              <div>
                <h4 className="font-medium">
                  {frames.length >= 3 && stats.completos >= 3 
                    ? "Frames configurados corretamente!" 
                    : "Atenção necessária"
                  }
                </h4>
                <div className="text-sm text-gray-600 mt-1">
                  {frames.length < 3 && (
                    <p>• É necessário ter pelo menos 3 frames para o cenário</p>
                  )}
                  {stats.incompletos > 0 && (
                    <p>• {stats.incompletos} frame(s) precisam ser completados com parâmetros</p>
                  )}
                  {frames.length >= 3 && stats.completos >= 3 && (
                    <p>• Todos os requisitos mínimos foram atendidos</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PrismaFramesTab;