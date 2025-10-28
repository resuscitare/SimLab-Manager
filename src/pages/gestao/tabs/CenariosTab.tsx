"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Copy } from "lucide-react";

const CenariosTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Cenários</h2>
          <p className="text-muted-foreground">Administre todos os cenários de simulação</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Cenário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cenários Cadastrados</CardTitle>
          <CardDescription>Lista de todos os cenários disponíveis no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Parada Cardiorrespiratória</TableCell>
                <TableCell>Medicina</TableCell>
                <TableCell><Badge variant="default">Ativo</Badge></TableCell>
                <TableCell>15/01/2024</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Copy className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
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

export default CenariosTab;