import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Agendamentos from "./pages/Agendamentos";
import NovoAgendamento from "./pages/NovoAgendamento";
import Cenarios from "./pages/Cenarios";
import NovoCenario from "./pages/NovoCenario";
import Checklists from "./pages/Checklists";
import NovoChecklist from "./pages/NovoChecklist";
import EditarChecklist from "./pages/EditarChecklist";
import AssistenteIA from "./pages/AssistenteIA";
import Equipamentos from "./pages/Equipamentos";
import Instrutores from "./pages/Instrutores";
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
            <Route path="/" element={<Dashboard />} />
            <Route path="/agendamentos" element={<Agendamentos />} />
            <Route path="/agendamentos/novo" element={<NovoAgendamento />} />
            <Route path="/cenarios" element={<Cenarios />} />
            <Route path="/cenarios/novo" element={<NovoCenario />} />
            <Route path="/checklists" element={<Checklists />} />
            <Route path="/checklists/novo" element={<NovoChecklist />} />
            <Route path="/checklists/editar/:id" element={<EditarChecklist />} />
            <Route path="/ia" element={<AssistenteIA />} />
            <Route path="/equipamentos" element={<Equipamentos />} />
            <Route path="/instrutores" element={<Instrutores />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;