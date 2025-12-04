import { cn } from "@/lib/utils";
import ChecklistEditor from "@/components/checklist/ChecklistEditor"; // Agora com default export

// Resto do componente (exemplo)
const NovoChecklist = () => {
  return (
    <div className={cn('container mx-auto py-10')}>
      <h1 className="text-2xl font-bold mb-8">Novo Checklist</h1>
      <ChecklistEditor />
    </div>
  );
};

export default NovoChecklist;