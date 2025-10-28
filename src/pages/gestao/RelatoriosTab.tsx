"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, FileText, BarChart3 } from "lucide-react";

const RelatoriosTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Relatórios</h2>
          <p className="text-muted-foreground">Gere e visualize relatórios do sistema</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Relatório
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Gerados</CardTitle>
          <CardDescription>Histórico de relatórios do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Gerado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Relatório Mensal</TableCell>
                <TableCell><Badge variant="secondary">Utilização</Badge></TableCell>
                <TableCell>01/01/2024 - 31/01/2024</TableCell>
                <TableCell>15/01/2024</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><FileText className="h-4 w-4" /></Button>
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

export default RelatoriosTab;