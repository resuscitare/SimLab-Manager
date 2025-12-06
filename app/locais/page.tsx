'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import LayoutWrapper from '@/components/LayoutWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Warehouse } from 'lucide-react';

export default function LocaisPage() {
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
          <Warehouse className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Locais</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gestão de Locais</CardTitle>
            <CardDescription>
              Gerencie salas e espaços de simulação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Conteúdo em desenvolvimento...
            </p>
          </CardContent>
        </Card>
      </div>
    </LayoutWrapper>
  );
}
