import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Agendamentos from "./pages/Agendamentos";
import NovoAgendamento from "./pages/NovoAgendamento";
import Cenarios from "./pages/Cenarios";
import NovoCenario from "./pages/NovoCenario";
import Checklists from "./pages/Checklists";
import AssistenteIA from "./pages/AssistenteIA";
import Equipamentos from "./pages/Equipamentos";
import Instrutores from "./pages/Instrutores";
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
            <Route path="/cenarios/ia" element={<AssistenteIA />} />
            <Route path="/checklists" element={<Checklists />} />
            <Route path="/ia" element={<AssistenteIA />} />
            <Route path="/equipamentos" element={<Equipamentos />} />
            <Route path="/instrutores" element={<Instrutores />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;