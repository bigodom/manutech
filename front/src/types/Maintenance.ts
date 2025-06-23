// src/types/maintenance.ts

export type Priority = "HIGH" | "MEDIUM" | "LOW";

/**
 * Interface que define a estrutura de uma solicitação de manutenção.
 * Esta é a versão consolidada, alinhada com o backend e o frontend.
 */
export interface Maintenance {
  id: number;
  equipment: string;
  description: string;
  requestor: string;
  responsible: string;
  sector?: string;
  priority: Priority;
  startDate: string | null;
  status: boolean;
  location: string | null;
  createdAt: string;
  updatedAt?: string; // Opcional, pode não estar presente em todas as respostas
  completionDate?: string | null; // Opcional, pode ser null ou ausente
  notes?: string; // Opcional, usado em MaintenanceTable
}

// Para o formulário de criação/edição, baseado na interface Maintenance
export type MaintenanceFormData = Omit<Maintenance, "id" | "createdAt" | "updatedAt">;

/**
 * Interface que define as propriedades esperadas pelo componente MaintenanceTable.
 */
export interface MaintenanceTableProps {
  requests: Maintenance[];
  onUpdate: () => void;
}
