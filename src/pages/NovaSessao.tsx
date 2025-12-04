import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Import adicionado
import SessionForm from '@/components/session/SessionForm'; // Import adicionado

const NovaSessao = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    // Lógica para salvar a sessão (API call, etc.)
    console.log('Salvando sessão:', data);
    // Após salvar, redirecionar para lista ou detalhes
    navigate('/sessao/lista');
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Nova Sessão</h1>
        <Button variant="outline" onClick={() => navigate('/sessao/lista')}>
          Voltar
        </Button>
      </div>
      <SessionForm onSubmit={handleSubmit} />
    </div>
  );
};

export default NovaSessao;