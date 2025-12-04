import { cn } from "@/lib/utils";
import ChecklistEditor from "@/components/checklist/ChecklistEditor"; // Agora com default export

// Resto do componente (exemplo)
const EditarChecklist = () => {
  return (
    <div className={cn('container mx-auto py-10')}>
      <h1 className="text-2xl font-bold mb-8">Editar Checklist</h1>
      <ChecklistEditor />
    </div>
  );
};

export default EditarChecklist;