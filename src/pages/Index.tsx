"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, Users, FileText, CheckSquare, Sparkles, Package, Plus, TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Index = () => {
  const navigate = useNavigate();

  // Mock data for the dashboard
  const stats = [
    {
      title: "Cenários Ativos",
      value: "24",
      description: "+3 este mês",
      icon: FileText,
      color: "text-blue-600",
      trend: "+12.5%"
    },
    {
      title: "Agendamentos Hoje",
      value: "8",
      description: "2 em andamento",
      icon: Calendar,
      color: "text-green-600",
      trend: "+5.2%"
    },
    {
      title: "Checklists Completos",
      value: "18",
      description: "6 em desenvolvimento",
      icon: CheckSquare,
      color: "text-purple-600",
      trend: "+8.7%"
    },
    {
      title: "Uso de IA",
      value: "87%",
      description: "Dos cenários usam IA",
      icon: Sparkles,
      color: "text-orange-600",
      trend: "+15.3%"
    }
  ];

  const usageData = [
    { day: 'Seg', cenarios: 4, agendamentos: 3 },
    { day: 'Ter', cenarios: 6, agendamentos: 5 },
    { day: 'Qua', cenarios: 8, agendamentos: 7 },
    { day: 'Qui', cenarios: 5, agendamentos: 6 },
    { day: 'Sex', cenarios: 9, agendamentos: 8 },
    { day: 'Sáb', cenarios: 3, agendamentos: 2 },
    { day: 'Dom', cenarios: 2, agendamentos: 1 }
  ];

  const recentActivities = [
    { 
      user: "Dra. Mariana Silva", 
      action: "criou cenário", 
      target: "RCP Pediátrica", 
      time: "10min atrás",
      type: "scenario"
    },
    { 
      user: "Dr. Roberto Costa", 
      action: "agendou sessão", 
      target: "Trauma - Sala B", 
      time: "25min atrás",
      type: "schedule"
    },
    { 
      user: "Sistema", 
      action: "gerou sugestão de IA", 
      target: "Objetivos de Aprendizagem", 
      time: "1h atrás",
      type: "ai"
    },
    { 
      user: "Dra. Ana Costa", 
      action: "atualizou checklist", 
      target: "Materiais Sala A", 
      time: "2h atrás",
      type: "checklist"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'scenario': return <FileText className="h-4 w-4 text-blue-600" />;
      case 'schedule': return <Calendar className="h-4 w-4 text-green-600" />;
      case 'ai': return <Sparkles className="h-4 w-4 text-orange-600" />;
      case 'checklist': return <CheckSquare className="h-4 w-4 text-purple-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard do SimLab</h1>
          <p className="text-gray-600">Bem-vindo ao sistema de gestão da Resuscitare</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate("/cenarios/novo")}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Cenário
          </Button>
          <Button onClick={() => navigate("/agendamentos/novo")}>
            <Calendar className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <span className="text-xs font-medium text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Atividade da Semana</CardTitle>
            <CardDescription className="text-muted-foreground">
              Cenários criados e agendamentos realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="cenarios" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary)/0.2)" 
                  name="Cenários"
                />
                <Area 
                  type="monotone" 
                  dataKey="agendamentos" 
                  stroke="hsl(var(--green-600))" 
                  fill="hsl(var(--green-600)/0.2)" 
                  name="Agendamentos"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Atividades Recentes</CardTitle>
            <CardDescription className="text-muted-foreground">
              Últimas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border border-border rounded-lg bg-sidebar">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground">
                      <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                      <span className="font-semibold">{activity.target}</span>
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Ações Rápidas</CardTitle>
          <CardDescription className="text-muted-foreground">
            Acesse rapidamente as funcionalidades principais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2 bg-sidebar hover:bg-sidebar-accent"
              onClick={() => navigate("/cenarios")}
            >
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium">Cenários</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2 bg-sidebar hover:bg-sidebar-accent"
              onClick={() => navigate("/agendamentos")}
            >
              <Calendar className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium">Agendamentos</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2 bg-sidebar hover:bg-sidebar-accent"
              onClick={() => navigate("/checklists")}
            >
              <CheckSquare className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium">Checklists</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2 bg-sidebar hover:bg-sidebar-accent"
              onClick={() => navigate("/ia")}
            >
              <Sparkles className="h-6 w-6 text-orange-600" />
              <span className="text-sm font-medium">Assistente IA</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;