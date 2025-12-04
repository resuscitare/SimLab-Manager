import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NovaSessao from './pages/NovaSessao';
import EditarSessao from './pages/EditarSessao';
// Outras importações...

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Rotas existentes */}
          <Route path="/sessao/nova" element={<NovaSessao />} />
          <Route path="/sessao/editar/:id" element={<EditarSessao />} />
          {/* Outras rotas */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;