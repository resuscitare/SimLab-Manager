"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface ModelCardProps {
  title: string;
  recommendation: string;
  features: string[];
  bestFor: string;
  onSelect: () => void;
}

const ModelCard = ({ title, recommendation, features, bestFor, onSelect }: ModelCardProps) => (
  <Card className="flex flex-col">
    <CardHeader>
      <CardTitle className="text-xl text-primary">{title}</CardTitle>
      <CardDescription>{recommendation}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow space-y-4">
      <div>
        <h4 className="font-semibold text-sm mb-2">Características:</h4>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-2">Melhor para:</h4>
        <p className="text-sm text-muted-foreground">{bestFor}</p>
      </div>
    </CardContent>
    <div className="p-6 pt-0">
      <Button className="w-full" onClick={onSelect}>Selecionar {title}</Button>
    </div>
  </Card>
);

interface DebriefingModelSelectorProps {
  onSelectModel: (model: "PEARLS" | "TeamGAINS" | "3D" | "GAS") => void;
}

const DebriefingModelSelector = ({ onSelectModel }: DebriefingModelSelectorProps) => {
  const models = [
    {
      title: "PEARLS",
      recommendation: "Debriefings abrangentes com tempo adequado (20-30 minutos)",
      features: [
        "Abordagem combinada mais validada internacionalmente",
        "5 fases estruturadas (Preparação, Reação, Descrição, Análise, Resumo)",
        "Oferece 3 opções de análise (Plus-Delta, Advocacy-Inquiry, Feedback Diretivo)",
        "Ideal para cenários complexos com múltiplos objetivos de aprendizagem",
      ],
      bestFor: "Facilitadores com treinamento formal, cenários com ênfase em raciocínio clínico e tomada de decisão.",
      onSelect: () => onSelectModel("PEARLS"),
    },
    {
      title: "TeamGAINS",
      recommendation: "Simulações focadas em trabalho em equipe e dinâmica interprofissional",
      features: [
        "6 fases estruturadas incluindo prebriefing",
        "Ênfase em dinâmica de equipe e comunicação",
        "Integra autocorreção guiada, Advocacy-Inquiry e perguntas circulares",
        "Inclui fase específica de 'transferência' para a prática clínica",
      ],
      bestFor: "Cenários de equipe multidisciplinar, emergências, gerenciamento de recursos da equipe (CRM).",
      onSelect: () => onSelectModel("TeamGAINS"),
    },
    {
      title: "3D",
      recommendation: "Cenários emocionalmente intensos ou traumáticos",
      features: [
        "3 fases focadas em processamento emocional e cognitivo",
        "Inicia com descompressão emocional (Defusing)",
        "Descobre modelos mentais através da reflexão (Discovering)",
        "Aprofunda conexões com prática clínica (Deepening)",
      ],
      bestFor: "Cenários de alta fidelidade emocional, PCR, trauma, comunicação de más notícias.",
      onSelect: () => onSelectModel("3D"),
    },
    {
      title: "GAS",
      recommendation: "Debriefings rápidos e objetivos (10-15 minutos)",
      features: [
        "3 fases simples e diretas",
        "Modelo oficial da American Heart Association",
        "Estrutura clara: Reunir → Analisar → Resumir",
        "Eficiente para cursos com múltiplos cenários",
      ],
      bestFor: "Cursos de suporte de vida (BLS, ACLS, PALS), sessões com tempo limitado, facilitadores iniciantes.",
      onSelect: () => onSelectModel("GAS"),
    },
  ];

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Escolha o Modelo de Debriefing</CardTitle>
        <CardDescription>
          Selecione o modelo que melhor se adapta aos seus objetivos de aprendizagem, tempo disponível e características dos participantes.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {models.map((model) => (
          <ModelCard key={model.title} {...model} />
        ))}
      </CardContent>
    </Card>
  );
};

export default DebriefingModelSelector;