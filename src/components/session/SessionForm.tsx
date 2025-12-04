import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar'; // Import único para Calendar

// Tipos para o formulário
interface SessionFormData {
  sessionType: string;
  instructor: string;
  date: Date | undefined;
  room: string;
  participants: number;
  observations: string;
}

// Schema de validação com Zod
const formSchema = z.object({
  sessionType: z.string().min(1, 'Tipo de sessão é obrigatório'),
  instructor: z.string().min(1, 'Instrutor é obrigatório'),
  date: z.date({ required_error: 'Data é obrigatória' }),
  room: z.string().min(1, 'Sala é obrigatória'),
  participants: z.coerce.number().min(1, 'Número de participantes deve ser pelo menos 1'),
  observations: z.string().max(500, 'Observações não pode exceder 500 caracteres'),
});

interface SessionFormProps {
  initialData?: Partial<SessionFormData>; // Dados iniciais para edição
  onSubmit: (data: SessionFormData) => void; // Callback para submissão
  isEditMode?: boolean; // Modo de edição (opcional)
}

export const SessionForm: React.FC<SessionFormProps> = ({
  initialData = {},
  onSubmit,
  isEditMode = false,
}) => {
  const form = useForm<SessionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sessionType: initialData.sessionType || '',
      instructor: initialData.instructor || '',
      date: initialData.date,
      room: initialData.room || '',
      participants: initialData.participants || 1,
      observations: initialData.observations || '',
    },
  });

  const [date, setDate] = React.useState<Date | undefined>(initialData.date);

  const onSubmitHandler = (data: SessionFormData) => {
    const submitData = { ...data, date: date || new Date() };
    onSubmit(submitData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-6">
        {/* Tipo de Sessão */}
        <FormField
          control={form.control}
          name="sessionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Sessão</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de sessão" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="treinamento">Treinamento</SelectItem>
                  <SelectItem value="simulacao">Simulação</SelectItem>
                  <SelectItem value="avaliacao">Avaliação</SelectItem>
                  <SelectItem value="debriefing">Debriefing</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Instrutor Responsável */}
        <FormField
          control={form.control}
          name="instructor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instrutor Responsável</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o instrutor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="instrutor1">Instrutor 1</SelectItem>
                  <SelectItem value="instrutor2">Instrutor 2</SelectItem>
                  <SelectItem value="instrutor3">Instrutor 3</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Data */}
        <FormField
          control={form.control}
          name="date"
          render={() => (
            <FormItem className="flex flex-col">
              <FormLabel>Data da Sessão</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-[280px] pl-3 text-left font-normal',
                        !date && 'text-muted-foreground',
                      )}
                    >
                      {date ? format(date, 'PPP') : <span>Selecione a data</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      setDate(selectedDate);
                      form.setValue('date', selectedDate);
                    }}
                    defaultMonth={date}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Selecione a data da sessão.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sala */}
        <FormField
          control={form.control}
          name="room"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sala</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a sala" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sala-a">Sala A</SelectItem>
                  <SelectItem value="sala-b">Sala B</SelectItem>
                  <SelectItem value="sala-c">Sala C</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Número de Participantes */}
        <FormField
          control={form.control}
          name="participants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Participantes</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ex: 8"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              </FormControl>
              <FormDescription>Número mínimo: 1</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Observações */}
        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observações adicionais (máx. 500 caracteres)..."
                  {...field}
                />
              </FormControl>
              <FormDescription>Opcional, mas útil para detalhes adicionais.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Cancelar
          </Button>
          <Button type="submit">
            {isEditMode ? 'Atualizar Sessão' : 'Criar Sessão'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

// Exporta como default
export default SessionForm;