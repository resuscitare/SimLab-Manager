"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, Users } from "lucide-react";

const AgendamentosTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Agendamentos</h2>
          <p className="text-muted-foreground">Visualize e gerencie todas as sessões agendadas</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agendamentos</CardTitle>
          <CardDescription>Sessões de simulação agendadas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Cenário</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>15/01/2024</TableCell>
                <TableCell>14:00</TableCell>
                <TableCell>Parada Cardiorrespiratória</TableCell>
                <TableCell>Enfermagem 3º período</TableCell>
                <TableCell><Badge variant="default">Confirmado</Badge></TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon"><Calendar className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgendamentosTab;