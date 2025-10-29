"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NovoAgendamento = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [tipo, setTipo] = useState("");

  const salas = [
    { id: "sala-a", nome: "Sala A", capacidade: 12 },
    { id: "sala-b", nome: "Sala B", capacidade: 8 },
    { id: "sala-c", nome: "Sala C", capacidade: 15 }
  ];

  const instrutores = [
    { id: "1", nome: "Dr. Carlos Silva", especialidade: "RCP" },
    { id: "2", nome: "Dra. Ana Costa", especialidade: "Ventilação" },
    { id: "3", nome: "Dr. Roberto Santos", especialidade: "Trauma" },
    { id: "4", nome: "Dr. Paulo Oliveira", especialidade: "Pediatria" }
  ];

  const tiposSessao = [
    "RCP Básica",
    "RCP Avançada",
    "Ventilação Mecânica",
    "Trauma",
    "Pediatria",
    "Obstetrícia",
    "Emergências Cardíacas"
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Novo Agendamento</h1>
          <p className="text-gray-600">Agende uma nova sessão de simulação</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/agendamentos")}>
          Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Sessão</CardTitle>
          <CardDescription>Preencha os dados da sessão de simulação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Sessão</Label>
              <Input
                id="tipo"
                list="tipos-sessao-list"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                placeholder="Digite ou selecione o tipo de sessão"
              />
              <datalist id="tipos-sessao-list">
                {tiposSessao.map((tipo) => (
                  <option key={tipo} value={tipo} />
                ))}
              </datalist>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instrutor">Instrutor Responsável</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o instrutor" />
                </SelectTrigger>
                <SelectContent>
                  {instrutores.map((instrutor) => (
                    <SelectItem key={instrutor.id} value={instrutor.id}>
                      {instrutor.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data da Sessão</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="horario">Horário</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00">08:00 - 10:00</SelectItem>
                  <SelectItem value="10:00">10:00 - 12:00</SelectItem>
                  <SelectItem value="14:00">14:00 - 16:00</SelectItem>
                  <SelectItem value="16:00">16:00 - 18:00</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sala">Sala</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a sala" />
                </SelectTrigger>
                <SelectContent>
                  {salas.map((sala) => (
                    <SelectItem key={sala.id} value={sala.id}>
                      {sala.nome} ({sala.capacidade} pessoas)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="participantes">Número de Participantes</Label>
              <Input id="participantes" type="number" min="1" max="20" placeholder="Ex: 8" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea 
              id="observacoes" 
              placeholder="Informações adicionais sobre a sessão..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => navigate("/agendamentos")}>
              Cancelar
            </Button>
            <Button>Agendar Sessão</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NovoAgendamento;