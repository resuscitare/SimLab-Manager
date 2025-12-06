"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import LayoutWrapper from "@/components/LayoutWrapper";
import { useAuthStore } from "@/store/authStore";

export default function NovoAgendamentoPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState({
    data: "",
    horarioInicio: "",
    horarioFim: "",
    tipo: "",
    instrutor: "",
    sala: "",
    participantes: "",
    observacoes: ""
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router, isAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica de salvar o agendamento
    console.log("Novo agendamento:", formData);
    alert("Agendamento criado com sucesso!");
    router.push("/agendamentos");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <LayoutWrapper>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Novo Agendamento</h1>
            <p className="text-gray-600">Agende uma nova sessão de simulação</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Agendamento</CardTitle>
              <CardDescription>Preencha os dados da sessão de simulação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="data">Data da Sessão *</Label>
                  <Input
                    id="data"
                    name="data"
                    type="date"
                    required
                    value={formData.data}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Sessão *</Label>
                  <Input
                    id="tipo"
                    name="tipo"
                    placeholder="Ex: RCP Básica, Trauma, Ventilação..."
                    required
                    value={formData.tipo}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horarioInicio">Horário de Início *</Label>
                  <Input
                    id="horarioInicio"
                    name="horarioInicio"
                    type="time"
                    required
                    value={formData.horarioInicio}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horarioFim">Horário de Término *</Label>
                  <Input
                    id="horarioFim"
                    name="horarioFim"
                    type="time"
                    required
                    value={formData.horarioFim}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instrutor">Instrutor Responsável *</Label>
                  <Input
                    id="instrutor"
                    name="instrutor"
                    placeholder="Nome do instrutor"
                    required
                    value={formData.instrutor}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sala">Sala *</Label>
                  <Input
                    id="sala"
                    name="sala"
                    placeholder="Ex: Sala A, Sala B..."
                    required
                    value={formData.sala}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="participantes">Número de Participantes *</Label>
                  <Input
                    id="participantes"
                    name="participantes"
                    type="number"
                    min="1"
                    placeholder="Ex: 8"
                    required
                    value={formData.participantes}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  placeholder="Informações adicionais sobre o agendamento..."
                  rows={4}
                  value={formData.observacoes}
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Agendamento
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </LayoutWrapper>
  );
}
