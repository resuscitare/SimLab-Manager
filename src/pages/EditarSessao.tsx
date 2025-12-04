import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Import adicionado
import SessionForm from '@/components/session/SessionForm'; // Import adicionado

interface Session {
  id: string;
  sessionType: string;
  instructor: string;
  date: Date;
  room: string;
  participants: number;
  observations: string;
}

const EditarSessao = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados da sessão (API call)
    const fetchSession = async () => {
      // Exemplo de dados
      const data: Session = {
        id: id || '',
        sessionType: 'treinamento',
        instructor: 'instrutor1',
        date: new Date(),
        room: 'sala-a',
        participants: 8,
        observations: 'Sessão de treinamento inicial.',
      };
      setSession(data);
      setLoading(false);
    };
    fetchSession();
  }, [id]);

  const handleSubmit = (data: any) => {
    // Lógica para atualizar a sessão (API call)
    console.log('Atualizando sessão:', data);
    navigate('/sessao/lista');
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!session) {
    return <div>Sessão não encontrada.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Editar Sessão</h1>
        <Button variant="outline" onClick={() => navigate('/sessao/lista')}>
          Voltar
        </Button>
      </div>
      <SessionForm
        initialData={session}
        isEditMode={true}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditarSessao;