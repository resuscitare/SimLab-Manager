import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Agendamentos from "./pages/Agendamentos";
import NovoAgendamento from "./pages/NovoAgendamento";
import Cenarios from "./pages/Cenarios";
import NovoCenario from "./pages/NovoCenario";
import Checklists from "./pages/Checklists";
import NovoChecklist from "./pages/NovoChecklist";
import EditarChecklist from "./pages/EditarChecklist";
import EditarDebriefingTemplate from "./pages/EditarDebriefingTemplate";
import AssistenteIA from "./pages/AssistenteIA";
import Equipamentos from "./pages/Equipamentos";
import Materiais from "./pages/Materiais";
import Instrutores from "./pages/Instrutores";
import Locais from "./pages/Locais";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/agendamentos" element={<Agendamentos />} />
            <Route path="/agendamentos/novo" element={<NovoAgendamento />} />
            <Route path="/cenarios" element={<Cenarios />} />
            <Route path="/cenarios/novo" element={<NovoCenario />} />
            <Route path="/checklists" element={<Checklists />} />
            <Route path="/checklists/materiais/novo" element={<NovoChecklist />} />
            <Route path="/checklists/materiais/editar/:id" element={<EditarChecklist />} />
            <Route path="/debriefing-templates/editar/:id" element={<EditarDebriefingTemplate />} />
            <Route path="/ia" element={<AssistenteIA />} />
            <Route path="/equipamentos" element={<Equipamentos />} />
            <Route path="/materiais" element={<Materiais />} />
            <Route path="/instrutores" element={<Instrutores />} />
            <Route path="/locais" element={<Locais />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;