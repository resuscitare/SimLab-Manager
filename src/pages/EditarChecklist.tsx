"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Package, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import ChecklistEditor from "@/components/checklist/ChecklistEditor";

interface Checklist {
  id: string;
  titulo: string;
  tipo: "debriefing" | "materiais";
  secoes: Array<{
    id: string;
    titulo: string;
    itens: Array<{
      id: string;
      nome: string;
      quantidade?: string;
      checked?: boolean;
      observacoes?: string;
    }>;
  }>;
}

const EditarChecklist = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID do checklist não fornecido");
      setLoading(false);
      return;
    }

    // Carregar checklist do localStorage (mock)
    try {
      const checklists = JSON.parse(localStorage.getItem('checklists') || '[]');
      const checklistEncontrado = checklists.find((c: Checklist) => c.id === id);
      
      if (!checklistEncontrado) {
        setError("Checklist não encontrado");
      } else {
        setChecklist(checklistEncontrado);
      }
    } catch (err) {
      setError("Erro ao carregar checklist");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleSave = (checklistAtualizado: Checklist) => {
    try {
      const checklists = JSON.parse(localStorage.getItem('checklists') || '[]');
      const index = checklists.findIndex((c: Checklist) => c.id === id);
      
      if (index !== -1) {
        checklists[index] = checklistAtualizado;
        localStorage.setItem('checklists', JSON.stringify(checklists));
        console.log("Checklist atualizado:", checklistAtualizado);
        navigate("/checklists");
      } else {
        setError("Erro ao atualizar checklist");
      }
    } catch (err) {
      setError("Erro ao salvar alterações");
    }
  };

  const handleCancel = () => {
    navigate("/checklists");
  };

  const handleDelete = () => {
    if (!checklist || !id) return;
    
    if (confirm(`Tem certeza que deseja excluir o checklist "${checklist.titulo}"?`)) {
      try {
        const checklists = JSON.parse(localStorage.getItem('checklists') || '[]');
        const checklistsFiltrados = checklists.filter((c: Checklist) => c.id !== id);
        localStorage.setItem('checklists', JSON.stringify(checklistsFiltrados));
        navigate("/checklists");
      } catch (err) {
        setError("Erro ao excluir checklist");
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando checklist...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-semibold text-red-600 mb-2">Erro</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => navigate("/checklists")}>
                Voltar para Checklists
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!checklist) {
    return null;
  }

  // CORREÇÃO: Verificar se checklist.secoes existe antes de usar .length
  const totalItens = checklist.secoes ? checklist.secoes.reduce((acc, secao) => 
    acc + (secao.itens ? secao.itens.length : 0), 0) : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Editar Checklist</h1>
          <p className="text-gray-600">Modifique as informações do checklist</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      {/* Informações do Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {checklist.tipo === "debriefing" ? (
              <MessageSquare className="h-5 w-5 text-blue-600" />
            ) : (
              <Package className="h-5 w-5 text-green-600" />
            )}
            {checklist.titulo}
          </CardTitle>
          <CardDescription>
            Checklist de {checklist.tipo === "debriefing" ? "debriefing" : "materiais"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {checklist.secoes ? checklist.secoes.length : 0}
              </div>
              <div className="text-sm text-blue-600">Seções</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {totalItens}
              </div>
              <div className="text-sm text-green-600">Itens</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Badge variant={checklist.tipo === "debriefing" ? "default" : "secondary"}>
                {checklist.tipo === "debriefing" ? "Debriefing" : "Materiais"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor */}
      <ChecklistEditor
        checklist={checklist}
        onSave={handleSave}
        onCancel={handleCancel}
        tipo={checklist.tipo}
      />
    </div>
  );
};

export default EditarChecklist;