"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Activity, Clock, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Agendamentos Hoje",
      value: "12",
      description: "+2 em relação a ontem",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Equipamentos Ativos",
      value: "8",
      description: "3 em manutenção",
      icon: Activity,
      color: "text-green-600"
    },
    {
      title: "Instrutores Disponíveis",
      value: "5",
      description: "2 em treinamento",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Próxima Sessão",
      value: "14:30",
      description: "RCP Avançada - Sala A",
      icon: Clock,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard do Laboratório</h1>
          <p className="text-gray-600">Bem-vindo ao sistema de gestão da Resuscitare</p>
        </div>
        <Button onClick={() => navigate("/agendamentos/novo")}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos do Dia</CardTitle>
            <CardDescription>Próximas sessões agendadas para hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "09:00", title: "RCP Básica", instructor: "Dr. Silva", room: "Sala A" },
                { time: "11:00", title: "Ventilação Mecânica", instructor: "Dra. Costa", room: "Sala B" },
                { time: "14:30", title: "RCP Avançada", instructor: "Dr. Santos", room: "Sala A" },
                { time: "16:00", title: "Trauma", instructor: "Dr. Oliveira", room: "Sala C" }
              ].map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{session.time} - {session.title}</div>
                    <div className="text-sm text-gray-500">{session.instructor} • {session.room}</div>
                  </div>
                  <Button variant="outline" size="sm">Detalhes</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status dos Equipamentos</CardTitle>
            <CardDescription>Estado atual dos simuladores e equipamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Simulador Adulto", status: "Disponível", room: "Sala A" },
                { name: "Simulador Pediátrico", status: "Em Uso", room: "Sala B" },
                { name: "Desfibrilador", status: "Manutenção", room: "Central" },
                { name: "Ventilador Mecânico", status: "Disponível", room: "Sala C" }
              ].map((equipment, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{equipment.name}</div>
                    <div className="text-sm text-gray-500">{equipment.room}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    equipment.status === "Disponível" ? "bg-green-100 text-green-800" :
                    equipment.status === "Em Uso" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {equipment.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;