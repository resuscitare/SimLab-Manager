# 🎨 Design System e UI Specification - SimLab Manager
**Complemento ao PRD v1.0**

---

## 📋 Sumário

1. [Paleta de Cores](#paleta-de-cores)
2. [Layout e Estrutura](#layout-e-estrutura)
3. [Componentes Principais](#componentes-principais)
4. [Dashboards](#dashboards)
5. [Sidebar Colapsável](#sidebar-colapsável)
6. [Implementação Técnica](#implementação-técnica)

---

## 🎨 Paleta de Cores

### Tema Principal: Verde Médico/Saúde

Baseado no contexto de simulação em saúde, utilizaremos variações de verde que remetem a ambiente hospitalar, saúde e crescimento.

#### Escala de Verde (shadcn/ui format)

```css
/* CSS Variables - Adicionar ao globals.css */
:root {
  /* Green Scale - Primary */
  --color-green-50: 240 253 244;   /* #f0fdf4 - Muito claro */
  --color-green-100: 220 252 231;  /* #dcfce7 */
  --color-green-200: 187 247 208;  /* #bbf7d0 */
  --color-green-300: 134 239 172;  /* #86efac */
  --color-green-400: 74 222 128;   /* #4ade80 */
  --color-green-500: 34 197 94;    /* #22c55e - Base */
  --color-green-600: 22 163 74;    /* #16a34a - Primary */
  --color-green-700: 21 128 61;    /* #15803d */
  --color-green-800: 22 101 52;    /* #166534 */
  --color-green-900: 20 83 45;     /* #14532d - Muito escuro */
  --color-green-950: 5 46 22;      /* #052e16 - Quase preto */
  
  /* shadcn/ui Semantic Colors com Verde */
  --background: 0 0% 100%;
  --foreground: var(--color-green-950);
  
  --card: 0 0% 100%;
  --card-foreground: var(--color-green-950);
  
  --popover: 0 0% 100%;
  --popover-foreground: var(--color-green-950);
  
  --primary: var(--color-green-600);        /* Verde principal */
  --primary-foreground: 0 0% 100%;
  
  --secondary: var(--color-green-100);
  --secondary-foreground: var(--color-green-900);
  
  --muted: var(--color-green-50);
  --muted-foreground: var(--color-green-700);
  
  --accent: var(--color-green-100);
  --accent-foreground: var(--color-green-900);
  
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 100%;
  
  --border: var(--color-green-200);
  --input: var(--color-green-200);
  --ring: var(--color-green-600);
  
  --radius: 0.5rem;
  
  /* Custom variables para SimLab */
  --sidebar-background: var(--color-green-900);
  --sidebar-foreground: var(--color-green-50);
  --sidebar-accent: var(--color-green-700);
  --sidebar-accent-foreground: var(--color-green-50);
  
  --chart-1: var(--color-green-500);
  --chart-2: 173 58% 39%;     /* Teal */
  --chart-3: 197 37% 24%;     /* Blue */
  --chart-4: 43 74% 66%;      /* Yellow */
  --chart-5: 27 87% 67%;      /* Orange */
}

.dark {
  --background: var(--color-green-950);
  --foreground: var(--color-green-50);
  
  --card: var(--color-green-900);
  --card-foreground: var(--color-green-50);
  
  --popover: var(--color-green-900);
  --popover-foreground: var(--color-green-50);
  
  --primary: var(--color-green-500);
  --primary-foreground: var(--color-green-950);
  
  --secondary: var(--color-green-800);
  --secondary-foreground: var(--color-green-50);
  
  --muted: var(--color-green-800);
  --muted-foreground: var(--color-green-300);
  
  --accent: var(--color-green-800);
  --accent-foreground: var(--color-green-50);
  
  --border: var(--color-green-800);
  --input: var(--color-green-800);
  --ring: var(--color-green-500);
  
  --sidebar-background: var(--color-green-950);
  --sidebar-foreground: var(--color-green-100);
  --sidebar-accent: var(--color-green-800);
  --sidebar-accent-foreground: var(--color-green-100);
}
```

#### Paleta de Suporte

```css
:root {
  /* Status Colors */
  --color-success: var(--color-green-600);
  --color-warning: 38 92% 50%;    /* Amber-500 */
  --color-error: 0 84% 60%;       /* Red-500 */
  --color-info: 221 83% 53%;      /* Blue-500 */
  
  /* Specific to SimLab */
  --color-draft: 43 74% 66%;      /* Yellow - Rascunho */
  --color-published: var(--color-green-600); /* Verde - Publicado */
  --color-ai-active: 271 91% 65%; /* Purple - IA ativa */
}
```

---

## 📐 Layout e Estrutura

### Estrutura Base com Sidebar Colapsável

```tsx
// app/layout.tsx ou app/(dashboard)/layout.tsx
import { SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "18rem",           // 288px expandida
        "--sidebar-width-icon": "3rem",       // 48px colapsada
        "--header-height": "3.5rem",          // 56px
      } as React.CSSProperties}
    >
      {children}
    </SidebarProvider>
  )
}
```

### Grid System

```tsx
// Layouts responsivos padrão
const layouts = {
  // Dashboard principal
  dashboard: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
  
  // Listagem de cenários
  scenarioList: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
  
  // Formulário de cenário (abas)
  scenarioForm: "flex flex-col gap-6",
  
  // Visualização de cenário
  scenarioView: "grid gap-6 lg:grid-cols-3",
}
```

---

## 🧩 Componentes Principais

### 1. AppSidebar (Colapsável)

#### Especificação
- **Estado Padrão:** Expandida em desktop (≥1024px), colapsada em mobile
- **Largura Expandida:** 288px (18rem)
- **Largura Colapsada:** 48px (3rem)
- **Posição:** Fixa à esquerda
- **Comportamento:** Transição suave (200ms ease-in-out)

#### Estrutura

```tsx
// components/app-sidebar.tsx
import { Calendar, Home, Inbox, Search, Settings, FileText, CheckSquare, Sparkles } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }) {
  const items = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Cenários", url: "/cenarios", icon: FileText },
    { title: "Checklists", url: "/checklists", icon: CheckSquare },
    { title: "Assistente IA", url: "/ai-assistant", icon: Sparkles },
    { title: "Buscar", url: "/search", icon: Search },
    { title: "Calendário", url: "/calendar", icon: Calendar },
  ]

  const adminItems = [
    { title: "Usuários", url: "/admin/users", icon: Inbox },
    { title: "Métricas IA", url: "/admin/ai-metrics", icon: Sparkles },
    { title: "Configurações", url: "/admin/settings", icon: Settings },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <FileText className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">SimLab</span>
                  <span className="truncate text-xs">Manager</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Menu Principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Menu Admin (condicional) */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {/* User Profile */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-sm font-semibold">DM</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Dra. Mariana</span>
                <span className="truncate text-xs">Facilitadora</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
```

### 2. SiteHeader com Breadcrumb

```tsx
// components/site-header.tsx
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Bell, Search } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex flex-1 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Cenários</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Search (opcional) */}
        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden lg:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar cenários..."
              className="w-[300px] pl-8"
            />
          </div>
          
          {/* Notifications */}
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notificações</span>
          </button>
        </div>
      </div>
    </header>
  )
}
```

---

## 📊 Dashboards

### Dashboard 1: Visão Geral (Home)

**Rota:** `/dashboard`  
**Usuário:** Facilitadores e Admins

#### Layout

```tsx
// app/(dashboard)/dashboard/page.tsx
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardPage() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "18rem",
        "--header-height": "3.5rem",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Cards de Métricas */}
              <SectionCards />
              
              {/* Gráfico Interativo */}
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              
              {/* Tabela de Dados */}
              <DataTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

#### Componente: SectionCards

```tsx
// components/section-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckSquare, Clock, TrendingUp } from "lucide-react"

export function SectionCards() {
  const cards = [
    {
      title: "Total de Cenários",
      value: "24",
      description: "+3 este mês",
      icon: FileText,
      trend: "+12.5%",
    },
    {
      title: "Cenários Ativos",
      value: "18",
      description: "Publicados",
      icon: CheckSquare,
      trend: "+5.2%",
    },
    {
      title: "Tempo Médio",
      value: "52min",
      description: "Para criar cenário",
      icon: Clock,
      trend: "-32.1%",
      trendPositive: true, // redução é positiva aqui
    },
    {
      title: "Uso de IA",
      value: "87%",
      description: "Dos cenários usam IA",
      icon: TrendingUp,
      trend: "+18.3%",
    },
  ]

  return (
    <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
            <p className={`text-xs mt-1 ${
              card.trendPositive !== false && card.trend.startsWith('+')
                ? 'text-green-600'
                : card.trend.startsWith('-')
                ? 'text-green-600' // redução é boa para tempo
                : 'text-muted-foreground'
            }`}>
              {card.trend} vs mês anterior
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

#### Componente: ChartAreaInteractive

```tsx
// components/chart-area-interactive.tsx
"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const chartData = [
  { month: "Jan", cenarios: 5, ia_usado: 3 },
  { month: "Fev", cenarios: 7, ia_usado: 5 },
  { month: "Mar", cenarios: 9, ia_usado: 8 },
  { month: "Abr", cenarios: 12, ia_usado: 11 },
  { month: "Mai", cenarios: 15, ia_usado: 14 },
  { month: "Jun", cenarios: 18, ia_usado: 16 },
]

const chartConfig = {
  cenarios: {
    label: "Cenários Criados",
    color: "hsl(var(--chart-1))",
  },
  ia_usado: {
    label: "Com Assistência IA",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Evolução de Cenários</CardTitle>
          <CardDescription>
            Mostrando cenários criados nos últimos 6 meses
          </CardDescription>
        </div>
        <Select defaultValue="6m">
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Selecionar período"
          >
            <SelectValue placeholder="Últimos 6 meses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="3m" className="rounded-lg">
              Últimos 3 meses
            </SelectItem>
            <SelectItem value="6m" className="rounded-lg">
              Últimos 6 meses
            </SelectItem>
            <SelectItem value="12m" className="rounded-lg">
              Último ano
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillCenarios" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-cenarios)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-cenarios)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillIA" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-ia_usado)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-ia_usado)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="ia_usado"
              type="natural"
              fill="url(#fillIA)"
              stroke="var(--color-ia_usado)"
              stackId="a"
            />
            <Area
              dataKey="cenarios"
              type="natural"
              fill="url(#fillCenarios)"
              stroke="var(--color-cenarios)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

#### Componente: DataTable

```tsx
// components/data-table.tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

interface Scenario {
  id: string
  nome: string
  autor: string
  data: string
  status: "publicado" | "rascunho"
  usouIA: boolean
}

export function DataTable() {
  const cenarios: Scenario[] = [
    {
      id: "1",
      nome: "Parada Cardiorrespiratória em AESP",
      autor: "Dra. Mariana Silva",
      data: "2025-10-20",
      status: "publicado",
      usouIA: true,
    },
    {
      id: "2",
      nome: "Infarto Agudo do Miocárdio",
      autor: "Dr. Roberto Costa",
      data: "2025-10-18",
      status: "publicado",
      usouIA: true,
    },
    {
      id: "3",
      nome: "Sepse em Paciente Pediátrico",
      autor: "Dra. Mariana Silva",
      data: "2025-10-15",
      status: "rascunho",
      usouIA: false,
    },
  ]

  return (
    <div className="px-4 lg:px-6">
      <Table>
        <TableCaption>Cenários criados recentemente</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome do Cenário</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>IA</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cenarios.map((cenario) => (
            <TableRow key={cenario.id}>
              <TableCell className="font-medium">{cenario.nome}</TableCell>
              <TableCell>{cenario.autor}</TableCell>
              <TableCell>{new Date(cenario.data).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell>
                <Badge
                  variant={cenario.status === "publicado" ? "default" : "secondary"}
                >
                  {cenario.status === "publicado" ? "Publicado" : "Rascunho"}
                </Badge>
              </TableCell>
              <TableCell>
                {cenario.usouIA && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    ✨ IA
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

---

### Dashboard 2: Visão de Conteúdo Simples

**Rota:** `/cenarios` ou `/admin/users`  
**Layout:** Grid responsivo com placeholders

```tsx
// app/(dashboard)/cenarios/page.tsx
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function CenariosPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Cenários</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Grid de Cards de Ação */}
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <p className="text-muted-foreground">Criar Novo Cenário</p>
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <p className="text-muted-foreground">Meus Cenários</p>
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <p className="text-muted-foreground">Templates</p>
            </div>
          </div>
          
          {/* Área de Conteúdo Principal */}
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-6">
            <h2 className="text-lg font-semibold mb-4">Lista de Cenários</h2>
            <p className="text-muted-foreground">
              Aqui ficará a listagem completa com filtros, busca e cards de cenários.
            </p>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

---

## 🎛️ Sidebar Colapsável - Especificações Detalhadas

### Comportamento

```tsx
// Estados da Sidebar
type SidebarState = "expanded" | "collapsed"

// Breakpoints
const breakpoints = {
  mobile: "< 1024px",    // Sempre collapsed por padrão
  desktop: ">= 1024px",  // Expanded por padrão, toggle manual
}

// Transições
const transitions = {
  width: "width 200ms ease-in-out",
  opacity: "opacity 150ms ease-in-out",
  transform: "transform 200ms ease-in-out",
}
```

### Comportamento Responsivo

```tsx
// Lógica de comportamento
const sidebarBehavior = {
  mobile: {
    defaultState: "collapsed",
    toggleBehavior: "overlay", // Aparece por cima do conteúdo
    closeOnNavigate: true,     // Fecha ao navegar
    showBackdrop: true,        // Mostra overlay escuro
  },
  desktop: {
    defaultState: "expanded",
    toggleBehavior: "push",    // Empurra o conteúdo
    closeOnNavigate: false,    // Mantém aberta ao navegar
    showBackdrop: false,       // Sem overlay
  },
}
```

### Ícones e Labels

```tsx
// Quando collapsed, mostrar apenas ícones
// Quando expanded, mostrar ícone + label

// Exemplo de item
<SidebarMenuItem>
  <SidebarMenuButton asChild tooltip="Cenários">
    <a href="/cenarios">
      <FileText />
      <span>Cenários</span> {/* Oculto quando collapsed */}
    </a>
  </SidebarMenuButton>
</SidebarMenuItem>
```

### Tooltip em Modo Collapsed

```tsx
// shadcn/ui já tem suporte nativo
// Configurar no SidebarMenuButton:

<SidebarMenuButton 
  asChild 
  tooltip={{
    children: "Nome do Item",
    side: "right",
    align: "center",
    delayDuration: 200,
  }}
>
  <a href="/rota">
    <Icon />
    <span>Nome do Item</span>
  </a>
</SidebarMenuButton>
```

---

## 🛠️ Implementação Técnica

### Passo 1: Instalar shadcn/ui

```bash
# Inicializar shadcn/ui
npx shadcn-ui@latest init

# Adicionar componentes necessários
npx shadcn-ui@latest add sidebar
npx shadcn-ui@latest add breadcrumb
npx shadcn-ui@latest add card
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add button
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add select
npx shadcn-ui@latest add input

# Adicionar chart components (Recharts)
npx shadcn-ui@latest add chart
```

### Passo 2: Configurar Tema Verde

```tsx
// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // ... outros
        green: {
          50: "hsl(var(--color-green-50))",
          100: "hsl(var(--color-green-100))",
          200: "hsl(var(--color-green-200))",
          300: "hsl(var(--color-green-300))",
          400: "hsl(var(--color-green-400))",
          500: "hsl(var(--color-green-500))",
          600: "hsl(var(--color-green-600))",
          700: "hsl(var(--color-green-700))",
          800: "hsl(var(--color-green-800))",
          900: "hsl(var(--color-green-900))",
          950: "hsl(var(--color-green-950))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

### Passo 3: Aplicar CSS Variables

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Adicionar todas as CSS variables da seção Paleta de Cores */
    --color-green-50: 240 253 244;
    /* ... etc */
    
    --sidebar-width: 18rem;
    --sidebar-width-icon: 3rem;
    --header-height: 3.5rem;
  }

  .dark {
    /* Dark mode variables */
  }
}

@layer utilities {
  /* Animações customizadas */
  .animate-slide-in {
    animation: slide-in 0.2s ease-out;
  }
  
  @keyframes slide-in {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
}
```

### Passo 4: Estrutura de Pastas

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── signup/
│       └── page.tsx
├── (dashboard)/
│   ├── layout.tsx          # Layout com Sidebar
│   ├── dashboard/
│   │   └── page.tsx        # Dashboard 1
│   ├── cenarios/
│   │   ├── page.tsx        # Lista
│   │   ├── [id]/
│   │   │   └── page.tsx    # Visualizar
│   │   └── novo/
│   │       └── page.tsx    # Criar
│   ├── checklists/
│   │   └── page.tsx
│   └── admin/
│       ├── users/
│       │   └── page.tsx
│       └── ai-metrics/
│           └── page.tsx    # Dashboard de IA
└── globals.css

components/
├── app-sidebar.tsx
├── site-header.tsx
├── section-cards.tsx
├── chart-area-interactive.tsx
├── data-table.tsx
└── ui/
    ├── sidebar.tsx
    ├── breadcrumb.tsx
    ├── card.tsx
    └── ... (shadcn components)
```

---

## 📱 Responsividade

### Breakpoints

```tsx
// Usar container queries (@container) quando possível
const breakpoints = {
  sm: "640px",   // Mobile landscape
  md: "768px",   // Tablet
  lg: "1024px",  // Desktop (sidebar expande aqui)
  xl: "1280px",  // Large desktop
  "2xl": "1536px", // Extra large
}
```

### Comportamento por Dispositivo

```tsx
// Mobile (< 1024px)
- Sidebar colapsada por padrão
- Aparece em overlay ao clicar no toggle
- Fecha automaticamente ao navegar
- Backdrop escuro quando aberta

// Desktop (>= 1024px)
- Sidebar expandida por padrão
- Toggle alterna entre expandida/colapsada
- Conteúdo se adapta (push, não overlay)
- Estado persiste entre navegações
- Sem backdrop

// Tablet (768px - 1023px)
- Comportamento híbrido
- Considerar collapsed por padrão
- Overlay como no mobile
```

---

## ✨ Animações e Transições

### Sidebar Toggle

```css
/* Transição suave */
.sidebar {
  transition: width 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-content {
  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Quando colapsada */
.sidebar[data-state="collapsed"] {
  width: var(--sidebar-width-icon);
}

.sidebar[data-state="collapsed"] .sidebar-label {
  opacity: 0;
  pointer-events: none;
}
```

### Loading States

```tsx
// Para gráficos e tabelas
<Card>
  <CardContent>
    {isLoading ? (
      <div className="flex items-center justify-center h-[250px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    ) : (
      <ChartAreaInteractive data={data} />
    )}
  </CardContent>
</Card>
```

---

## 🎨 Customizações Específicas do SimLab

### Badge de Status

```tsx
// components/ui/status-badge.tsx
import { Badge } from "@/components/ui/badge"

type Status = "publicado" | "rascunho" | "ia-usado"

export function StatusBadge({ status }: { status: Status }) {
  const configs = {
    publicado: {
      label: "Publicado",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    rascunho: {
      label: "Rascunho",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    "ia-usado": {
      label: "✨ IA",
      className: "bg-purple-100 text-purple-800 border-purple-200",
    },
  }

  const config = configs[status]

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
```

### Botão de IA

```tsx
// components/ai-suggest-button.tsx
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function AISuggestButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="gap-2 border-purple-200 hover:bg-purple-50 hover:text-purple-700"
    >
      <Sparkles className="h-4 w-4" />
      Sugerir com IA
      <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
        BETA
      </span>
    </Button>
  )
}
```

---

## 📊 Métricas de Performance

### Lighthouse Targets

```
Performance:     > 90
Accessibility:   > 95
Best Practices:  > 90
SEO:            > 90
```

### Core Web Vitals

```
LCP (Largest Contentful Paint):  < 2.5s
FID (First Input Delay):          < 100ms
CLS (Cumulative Layout Shift):    < 0.1
```

### Otimizações

```tsx
// 1. Lazy loading de componentes pesados
const ChartAreaInteractive = dynamic(
  () => import('@/components/chart-area-interactive'),
  { loading: () => <ChartSkeleton /> }
)

// 2. Virtualization para listas longas
import { useVirtualizer } from '@tanstack/react-virtual'

// 3. Debounce em buscas
import { useDebouncedCallback } from 'use-debounce'

// 4. Imagens otimizadas
import Image from 'next/image'
```

---

## ✅ Checklist de Implementação

### Setup Inicial
- [ ] Instalar e configurar shadcn/ui
- [ ] Adicionar componentes necessários
- [ ] Configurar tema verde (CSS variables)
- [ ] Configurar Tailwind com cores customizadas

### Componentes Base
- [ ] Implementar AppSidebar colapsável
- [ ] Implementar SiteHeader com breadcrumb
- [ ] Criar layout base com SidebarProvider
- [ ] Testar responsividade (mobile/desktop)

### Dashboard 1 (Home)
- [ ] Criar SectionCards (métricas)
- [ ] Implementar ChartAreaInteractive
- [ ] Criar DataTable com dados mock
- [ ] Integrar todos no layout

### Dashboard 2 (Simples)
- [ ] Criar layout de grid responsivo
- [ ] Implementar placeholders
- [ ] Testar navegação com breadcrumb

### Customizações SimLab
- [ ] Criar StatusBadge customizado
- [ ] Implementar AISuggestButton
- [ ] Adicionar animações de loading
- [ ] Criar skeleton loaders

### Testes
- [ ] Testar sidebar em mobile/desktop
- [ ] Verificar transições suaves
- [ ] Validar acessibilidade (keyboard navigation)
- [ ] Testar modo escuro
- [ ] Lighthouse audit (>90 em todos)

---

## 📚 Recursos e Referências

### Documentação
- **shadcn/ui:** https://ui.shadcn.com
- **Tailwind CSS:** https://tailwindcss.com
- **Recharts:** https://recharts.org
- **Lucide Icons:** https://lucide.dev

### Exemplos
- **shadcn/ui Sidebar:** https://ui.shadcn.com/docs/components/sidebar
- **Dashboard Template:** https://ui.shadcn.com/blocks

### Inspiração de Design
- **Vercel Dashboard:** https://vercel.com
- **Linear App:** https://linear.app
- **Notion:** https://notion.so

---

## 🎉 Conclusão

Este Design System fornece uma base sólida e escalável para o SimLab Manager, com:

✅ **Tema verde consistente** alinhado ao contexto de saúde  
✅ **Sidebar colapsável** responsiva e acessível  
✅ **2 layouts de dashboard** prontos para uso  
✅ **Componentes reutilizáveis** baseados em shadcn/ui  
✅ **Performance otimizada** seguindo Core Web Vitals  

**Próximos passos:**
1. Implementar os componentes seguindo este guia
2. Iterar com base em feedback de usuários
3. Expandir biblioteca de componentes conforme necessidade

---

**Documento criado por:** Claude (Consultor de Design)  
**Data:** 22/10/2025  
**Versão:** 1.0  
**Complementa:** PRD_SimLab_Manager_OTIMIZADO.md
