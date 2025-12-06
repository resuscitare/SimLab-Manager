"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface SessionFormProps {
  // Props to be defined based on requirements
}

const SessionForm: React.FC<SessionFormProps> = (props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Formulário de Sessão
        </CardTitle>
        <CardDescription>
          Configure os detalhes da sessão
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Em desenvolvimento...
        </p>
      </CardContent>
    </Card>
  );
};

export default SessionForm;