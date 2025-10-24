"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  Calendar,
  Activity,
  Download
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const usageData = [
    { month: 'Jan', cenarios: 5, usuarios: 8 },
    { month: 'Fev', cenarios: 7, usuarios: 12 },
    { month: 'Mar', cenarios: 10, usuarios: 15 },
    { month: 'Abr', cenarios: 15, usuarios: 18 },
    { month: 'Mai', cenarios: 18, usuarios: 22 },
    { month: 'Jun', cenarios: 24, usuarios: 26 }
  ];

  const iaUsageData = [
    { name: 'Cenários com IA', value: 87 },
    { name: 'Cenários sem IA', value: 13 }
  ];

  const COLORS = ['#16a34a', '#94a3b8'];

  const alerts = [
    { id: 1, type: 'warning', message: '3 equipamentos em manutenção', timestamp: '2h atrás' },
    { id: 2, type: 'info', message: '5 agendamentos para hoje', timestamp: '1h atrás' },
    { id: 3, type: 'success', message: 'Novo usuário cadastrado', timestamp: '30m atrás' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
          <p className="text-gray-600">Visão geral e métricas do sistema</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">26</div>
            <p className="text-xs text-gray-500">+18% este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cenários Criados</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-gray-500">+25% este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uso de IA</CardTitle>
            <Sparkles className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-gray-500">21/24 cenários</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-gray-500">Este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução do Uso</CardTitle>
            <CardDescription>Crescimento mensal de cenários e usuários</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="cenarios" stroke="#16a34a" fill="#dcfce7" />
                <Area type="monotone" dataKey="usuarios" stroke="#3b82f6" fill="#dbeafe" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uso da IA</CardTitle>
            <CardDescription>Distribuição de cenários com assistência de IA</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={iaUsageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {iaUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Métricas de IA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Alertas do Sistema</CardTitle>
            <CardDescription>Notificações e avisos importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className={`p-1 rounded-full ${
                    alert.type === 'warning' ? 'bg-yellow-100' :
                    alert.type === 'info' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    <AlertTriangle className={`h-4 w-4 ${
                      alert.type === 'warning' ? 'text-yellow-600' :
                      alert.type === 'info' ? 'text-blue-600' : 'text-green-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas de IA</CardTitle>
            <CardDescription>Desempenho e uso da inteligência artificial</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Taxa de Aprovação</span>
                <span className="font-medium text-green-600">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Sugestões Geradas</span>
                <span className="font-medium">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tempo Médio de Resposta</span>
                <span className="font-medium">2.3s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Custo Médio por Sugestão</span>
                <span className="font-medium">R$ 0.08</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Últimas Atividades */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Últimas ações no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { user: "Dra. Mariana Silva", action: "criou cenário", target: "RCP Pediátrica", time: "10min atrás" },
              { user: "Dr. Roberto Costa", action: "agendou sessão", target: "Trauma - Sala B", time: "25min atrás" },
              { user: "Sistema", action: "gerou sugestão de IA", target: "Objetivos de Aprendizagem", time: "1h atrás" },
              { user: "Dra. Ana Costa", action: "atualizou checklist", target: "Materiais Sala A", time: "2h atrás" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Activity className="h-4 w-4 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;