"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Plus, X, Save, Eye, AlertCircle, CheckCircle, Package, Users, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import FramesTab from "@/components/cenario/FramesTab";

// Frame interface matching FramesTab expectations
interface Frame {
  id: string;
  ordem: number;
  nomeEtapa: string;
  frameIdentifier: string;
  durationEstimateMin?: number;
  participantType?: string;
  
  // Parâmetros fisiológicos principais
  fc?: number;
  fc_tooltip?: string;
  ecgDescription?: string;
  ecgDescription_tooltip?: string;
  pulse?: number;
  pulse_tooltip?: string;
  satO2?: number;
  satO2_tooltip?: string;
  paSistolica?: number;
  paSistolica_tooltip?: string;
  paDiastolica?: number;
  paDiastolica_tooltip?: string;
  paMedia?: number;
  paMedia_tooltip?: string;
  papSistolica?: number;
  papSistolica_tooltip?: string;
  papDiastolica?: number;
  papDiastolica_tooltip?: string;
  papMedia?: number;
  papMedia_tooltip?: string;
  wpMedia?: number;
  wpMedia_tooltip?: string;
  cvpMedia?: number;
  cvpMedia_tooltip?: string;
  co?: number;
  co_tooltip?: string;
  
  // Parâmetros respiratórios
  fr?: number;
  fr_tooltip?: string;
  etCO2?: number;
  etCO2_tooltip?: string;
  iCO2?: number;
  iCO2_tooltip?: string;
  inO2?: number;
  inO2_tooltip?: string;
  etO2?: number;
  etO2_tooltip?: string;
  
  // Temperatura
  temp?: number;
  temp_tooltip?: string;
  tblood?: number;
  tblood_tooltip?: string;
  
  // Neurológicos e outros
  icpMedia?: number;
  icpMedia_tooltip?: string;
  glicemia?: number;
  glicemia_tooltip?: string;
  pupilas?: string;
  pupilas_tooltip?: string;
  ph?: number;
  ph_tooltip?: string;
  inN2O?: number;
  inN2O_tooltip?: string;
  etN2O?: number;
  etN2O_tooltip?: string;
  anestheticAgent?: string;
  anestheticAgent_tooltip?: string;
  inAGT?: number;
  inAGT_tooltip<dyad-problem-report summary="1 problems">
<problem file="src/components/cenario/FramesTab.tsx" line="601" column="13" code="2322">Type 'string | number | true' is not assignable to type 'string | number | readonly string[]'.
  Type 'boolean' is not assignable to type 'string | number | readonly string[]'.</problem>
</dyad-problem-report>
<dyad-write path="src/components/cenario/FramesTab.tsx" description="Fixing TypeScript error in parameter input step">
        <Input
          id={`${param.key}-${frame.id}`}
          type={param.unit === '%' || param.key === 'ph' ? "number" : "text"}
          min={param.unit === '%' ? 0 : undefined}
          max={param.unit === '%' ? 100 : undefined}
          step={param.key === 'ph' ? 0.01 : undefined}
          value={value || ''}
          onChange={(e) => onUpdate(param.key, e.target.value)}
          className="pr-12"
        />