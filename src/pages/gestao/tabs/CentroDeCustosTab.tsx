"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, Package, BookOpen } from "lucide-react";

// Mock data for course costs
const courseCostsData = [
  {
    id: "1",
    courseName: "Suporte Básico de Vida",
    instructorPayment: 1500,
    accommodation: 0,
    food: 250,
    coffeeBreak: 150,
    fuel: 50,
    coursePrice: 350,
    students: 30,
  },
  {
    id: "2",
    courseName: "Ventilação Mecânica Avançada",
    instructorPayment: 2500,
    accommodation: 800,
    food: 500,
    coffeeBreak: 300,
    fuel: 150,
    coursePrice: 1200,
    students: 20,
  },
  {
    id: "3",
    courseName: "Atendimento ao Trauma",
    instructorPayment: 2000,
    accommodation: 0,
    food: 300,
    coffeeBreak: 200,
    fuel: 100,
    coursePrice: 800,
    students: 25,
  },
];

// Mock data for material costs
const materialCostsData = [
  { id: "mat-1", name: "Kit Intubação", category: "Equipamentos", totalValue: 1250.75 },
  { id: "mat-2", name: "Ampolas de Adrenalina", category: "Medicamentos", totalValue: 350.50 },
  { id: "mat-3", name: "Manequim RCP Adulto", category: "Simuladores", totalValue: 15800.00 },
  { id: "mat-4", name: "Seringas Descartáveis (Caixa)", category: "Materiais", totalValue: 120.00 },
];

const CentroDeCustosTab = () => {
  const calculateCourseTotals = (course: typeof courseCostsData[0]) => {
    const totalCost = course.instructorPayment + course.accommodation + course.food + course.coffeeBreak + course.fuel;
    const totalRevenue = course.coursePrice * course.students;
    const netResult = totalRevenue - totalCost;
    return { totalCost, totalRevenue, netResult };
  };

  const overallTotals = courseCostsData.reduce(
    (acc, course) => {
      const { totalCost, totalRevenue, netResult } = calculateCourseTotals(course);
      acc.totalCost += totalCost;
      acc.totalRevenue += totalRevenue;
      acc.netResult += netResult;
      return acc;
    },
    { totalCost: 0, totalRevenue: 0, netResult: 0 }
  );

  const totalMaterialCost = materialCostsData.reduce((acc, item) => acc + item.totalValue, 0);
  const grandTotalCost = overallTotals.totalCost + totalMaterialCost;
  const grandNetResult = overallTotals.totalRevenue - grandTotalCost;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total (Cursos)</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ {overallTotals.totalRevenue.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-gray-500">Receita bruta dos cursos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo Total (Cursos + Materiais)</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">R$ {grandTotalCost.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-gray-500">Soma de todos os custos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resultado Líquido</CardTitle>
            {grandNetResult >= 0 ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${grandNetResult >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {grandNetResult.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-gray-500">Receita - Custo Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo de Materiais</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">R$ {totalMaterialCost.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-gray-500">Valor total do estoque</p>
          </CardContent>
        </Card>
      </div>

      {/* Course Costs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" />Custos por Curso</CardTitle>
          <CardDescription>Análise financeira detalhada de cada curso oferecido.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Curso</TableHead>
                <TableHead className="text-right">Receita</TableHead>
                <TableHead className="text-right">Custo Total</TableHead>
                <TableHead className="text-right">Resultado</TableHead>
                <TableHead className="text-right">Margem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseCostsData.map((course) => {
                const { totalCost, totalRevenue, netResult } = calculateCourseTotals(course);
                const margin = totalRevenue > 0 ? (netResult / totalRevenue) * 100 : 0;
                return (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.courseName}</TableCell>
                    <TableCell className="text-right text-green-600">R$ {totalRevenue.toLocaleString('pt-BR')}</TableCell>
                    <TableCell className="text-right text-red-600">R$ {totalCost.toLocaleString('pt-BR')}</TableCell>
                    <TableCell className={`text-right font-bold ${netResult >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {netResult.toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={margin >= 0 ? "default" : "destructive"}>{margin.toFixed(1)}%</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Material Costs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" />Custos de Materiais</CardTitle>
          <CardDescription>Visão geral dos custos associados ao inventário de materiais.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materialCostsData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell><Badge variant="secondary">{item.category}</Badge></TableCell>
                  <TableCell className="text-right font-bold">R$ {item.totalValue.toLocaleString('pt-BR')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CentroDeCustosTab;