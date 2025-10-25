import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Agendamentos from "./pages/Agendamentos";
import NovoCenario from "./pages/NovoCenario";
import Checklists from "./pages/Checklists";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClient client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/agendamentos" element={<Agendamentos />} />
            <Route path="/cenarios" element={<Cenarios />} />
            <Route path="/cenarios/novo" element={<NovoCenario />} />
            <Route path="/checklists" element={<Checklists />} />
            <Route path="/checklists/novo" element={<NovoChecklist />} />
            <Route path="/checklists/editar/:id" element={<EditarChecklist />} />
            <Route path="/ia" element={<AssistenteIA />} />
            <Route path="/equipamentos" element={<Equipamentos />} />
            <Route path="/instrutores" element={<Instrutores />} />
            <Route path="/login" element={<Login />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
  </QueryClient>
);

export default App;