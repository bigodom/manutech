import type { Maintenance, MaintenanceFormData } from "@/types/Maintenance.ts";

const API_URL = "http://192.168.11.95:3014/maintenance"; // Conforme o backend

export const getMaintenances = async (): Promise<Maintenance[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch maintenances");
  return response.json();
};

export const createMaintenance = async (data: MaintenanceFormData): Promise<Maintenance> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create maintenance");
  return response.json();
};

export const updateMaintenance = async (id: number, data: Partial<MaintenanceFormData>): Promise<Maintenance> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update maintenance");
  return response.json();
};

export const deleteMaintenance = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete maintenance");
};