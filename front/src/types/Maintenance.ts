export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type Status = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";

export interface Maintenance {
  id: number;
  equipment: string;
  description: string;
  requestor: string;
  responsible: string;
  priority: Priority;
  startDate: string | null;
  status: Status;
  location: string | null;
  createdAt: string;
}

// Para o formulário de criação/edição
export type MaintenanceFormData = Omit<Maintenance, "id" | "createdAt">;