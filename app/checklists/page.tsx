"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, CheckSquare, FileText, MessageSquare, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LayoutWrapper from "@/components/LayoutWrapper";
import { useAuthStore } from "@/store/authStore";

interface DebriefingTemplate {
  id: string;
  titulo: string;
  tipo: "debriefing";
  modelo: string;
  autor: string;
  dataCriacao: string;
  cenariosAssociados: number;
  dados: any;
}

interface MaterialChecklist {
  id: string;
  titulo: string;
  tipo: "materiais";
  autor: string;
  dataCriacao: string;
  cenariosAssociados: number;
  itens: number;
}

export default function ChecklistsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [materialChecklists, setMaterialChecklists] = useState<MaterialChecklist[]>([]);
  const [debriefingTemplates, setDebriefingTemplates] = useState<DebriefingTemplate[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router, isAuthenticated]);

  useEffect(() => {
    try {
      const allItems = JSON.parse(localStorage.getItem('checklists') || '[]');
      const materials = allItems.filter((item: any) => item.tipo === 'materiais');
      const debriefings = allItems.filter((item: any) => item.tipo === 'debriefing');

      if (materials.length === 0 && debriefings.length === 0) {
          const mockMaterials: MaterialChecklist[] = [
              { id: "mat-1", titulo: "Checklist de Materiais - Sala A", tipo: "materiais", autor: "Dr. Roberto Costa", dataCriacao: "2024-01-08", cenariosAssociados: 5, itens: 25 },
              { id: "mat-2", titulo: "Checklist de Materiais - Sala B", tipo: "materiais", autor: "Dra. Ana Costa", dataCriacao: "2024-01-03", cenariosAssociados: 4, itens: 18 },
          ];
          const mockDebriefings: DebriefingTemplate[] = [
              { id: "deb-1", titulo: "Debriefing Padrão - RCP Básica", tipo: "debriefing", modelo: "GAS", autor: "Dra. Mariana Silva", dataCriacao: "2024-01-10", cenariosAssociados: 3, dados: {} },
              { id: "deb-2", titulo: "Debriefing de Equipe - Trauma", tipo: "debriefing", modelo: "TeamGAINS", autor: "Dr. Paulo Oliveira", dataCriacao: "2024-01-05", cenariosAssociados: 2, dados: {} },
          ];
          const allMocks = [...mockMaterials, ...mockDebriefings];
          localStorage.setItem('checklists', JSON.stringify(allMocks));
          setMaterialChecklists(mockMaterials);
          setDebriefingTemplates(mockDebriefings);
      } else {
          setMaterialChecklists(materials);
          setDebriefingTemplates(debriefings);
      }
    } catch (e) {
      console.error("Failed to load checklists from localStorage", e);
    }
  }, []);

  return (
    <LayoutWrapper>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Checklists e Templates</h1>
            <p className="text-gray-600">Gerencie checklists de materiais e templates de debriefing.</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => router.push("/checklists/materiais/novo")}>
                <Package className="w-4 h-4 mr-2" />
                Checklist de Material
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/debriefing-templates/novo")}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Template de Debriefing
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-green-600" />Checklists de Materiais</CardTitle>
            <CardDescription>Listas de equipamentos e insumos para preparação dos cenários.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Cenários</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materialChecklists.map((checklist) => (
                  <TableRow key={checklist.id}>
                    <TableCell className="font-medium">{checklist.titulo}</TableCell>
                    <TableCell>{checklist.autor}</TableCell>
                    <TableCell>{checklist.dataCriacao}</TableCell>
                    <TableCell>{checklist.cenariosAssociados}</TableCell>
                    <TableCell>{checklist.itens}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/checklists/materiais/editar/${checklist.id}`)}>Editar</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-blue-600" />Templates de Debriefing</CardTitle>
            <CardDescription>Modelos estruturados para guiar as sessões de debriefing.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Cenários</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {debriefingTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.titulo}</TableCell>
                    <TableCell><Badge variant="secondary">{template.modelo}</Badge></TableCell>
                    <TableCell>{template.autor}</TableCell>
                    <TableCell>{template.dataCriacao}</TableCell>
                    <TableCell>{template.cenariosAssociados || 0}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/debriefing-templates/editar/${template.id}`)}>Editar</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </LayoutWrapper>
  );
}
