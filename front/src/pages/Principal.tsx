import { useMemo, useState } from "react";
import { MaintenanceTable } from "@/components/maintenance/MaintenanceTable";
import { MaintenanceDialog } from "@/components/maintenance/MaintenanceDialog";
import { useMaintenances } from "@/hooks/useMaintenances";
import type { Priority, Maintenance } from "@/types/Maintenance";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const priorityOrder: Record<Priority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export function Dashboard() {
  const { maintenances, loading, error, refetch } = useMaintenances();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<Priority | "ALL">("ALL");

  const activeMaintenances = useMemo(() => {
    return maintenances
      .filter(m => m.status !== "COMPLETED" && m.status !== "CANCELED")
      .filter(m => priorityFilter === "ALL" || m.priority === priorityFilter)
      .sort((a, b) => {
        // Ordena por prioridade (HIGH > MEDIUM > LOW)
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        // Se a prioridade for a mesma, ordena por equipamento (alfabética)
        return a.equipment.localeCompare(b.equipment);
      });
  }, [maintenances, priorityFilter]);

  if (loading) return <div className="p-4">Carregando...</div>;
  if (error) return <div className="p-4 text-red-500">Erro: {error}</div>;

  return (
    <div className="flex flex-col h-full p-6 bg-white dark:bg-gray-950">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Manutenções Ativas</h2>
        <div className="flex items-center gap-4">
          <Select
             value={priorityFilter}
             onValueChange={(value: Priority | "ALL") => setPriorityFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas Prioridades</SelectItem>
              <SelectItem value="HIGH">Alta</SelectItem>
              <SelectItem value="MEDIUM">Média</SelectItem>
              <SelectItem value="LOW">Baixa</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setDialogOpen(true)}>Criar Manutenção</Button>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto">
        <MaintenanceTable data={activeMaintenances} onRefetch={refetch} />
      </main>

      <MaintenanceDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={refetch}
      />
    </div>
  );
}