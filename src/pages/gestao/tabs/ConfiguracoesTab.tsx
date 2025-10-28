"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save, Settings, Bell, Shield, Database } from "lucide-react";

const ConfiguracoesTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configurações</h2>
        <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
          <CardDescription>Configure as notificações do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificações por email</Label>
              <p className="text-sm text-muted-foreground">Reba notificações sobre novos agendamentos</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Alertas de estoque</Label>
              <p className="text-sm text-muted-foreground">Seja notificado quando o estoque estiver baixo</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Segurança
          </CardTitle>
          <CardDescription>Configure as opções de segurança</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tempo de sessão (minutos)</Label>
              <Input type="number" defaultValue="30" />
            </div>
            <div className="space-y-2">
              <Label>Tentativas de login</Label>
              <Input type="number" defaultValue="3" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default ConfiguracoesTab;