'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import LayoutWrapper from '@/components/LayoutWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function IAPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <LayoutWrapper>
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Assistente IA</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Assistente Inteligente
            </CardTitle>
            <CardDescription>
              Assistência com inteligência artificial para suas simulações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-dashed border-muted-foreground/50 p-8">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Em Desenvolvimento</h3>
                  <p className="text-muted-foreground max-w-md">
                    Estamos trabalhando em funcionalidades de IA para ajudar na criação de cenários,
                    análise de debriefings e sugestões de melhorias.
                  </p>
                </div>
                <div className="pt-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-700">
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    Em breve disponível
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-lg border bg-card">
                <h4 className="font-semibold mb-2">Criação de Cenários</h4>
                <p className="text-sm text-muted-foreground">
                  Assistência na criação de cenários realistas baseados em objetivos de aprendizagem.
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <h4 className="font-semibold mb-2">Análise de Debriefing</h4>
                <p className="text-sm text-muted-foreground">
                  Sugestões inteligentes para estruturação e condução de debriefings efetivos.
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <h4 className="font-semibold mb-2">Recomendações</h4>
                <p className="text-sm text-muted-foreground">
                  Insights baseados em melhores práticas e literatura científica atualizada.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutWrapper>
  );
}
