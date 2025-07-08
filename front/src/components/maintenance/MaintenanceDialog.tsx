// Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type ControllerRenderProps, type FieldValues } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import type { Maintenance, MaintenanceFormData, Priority, Status } from "@/types/Maintenance";
import * as api from "@/api/maintenanceApi";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"

// Schema de validação com Zod
const requiredString = z.string().min(1, "Este campo é obrigatório.");
const formSchema = z.object({
    equipment: requiredString,
    description: requiredString,
    requestor: requiredString,
    responsible: requiredString,
    location: z.string().nullable(),
    startDate: z.string().nullable(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
    status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELED"]),
});

interface MaintenanceDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    maintenance?: Maintenance | null;
    onSuccess: () => void;
}

export function MaintenanceDialog({ isOpen, onOpenChange, maintenance, onSuccess }: MaintenanceDialogProps) {
    const [isEditMode, setEditMode] = useState(false);
    //const { toast } = Toaster();
    const isCreateMode = !maintenance;

    const form = useForm<MaintenanceFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            equipment: maintenance?.equipment || "",
            description: maintenance?.description || "",
            requestor: maintenance?.requestor || "",
            responsible: maintenance?.responsible || "",
            location: maintenance?.location || "",
            startDate: maintenance?.startDate ? maintenance.startDate.split('T')[0] : "",
            priority: maintenance?.priority || "LOW",
            status: maintenance?.status || "PENDING",
        },
    });

    const handleDialogStateChange = (open: boolean) => {
        if (!open) {
            form.reset();
            setEditMode(false);
        }
        onOpenChange(open);
    };

    const onSubmit = async (data: MaintenanceFormData) => {
        try {
            const apiCall = isCreateMode
                ? api.createMaintenance(data)
                : api.updateMaintenance(maintenance!.id, data);

            await apiCall;
            toast.success("Sucesso!", {
                description: `Manutenção ${isCreateMode ? 'criada' : 'atualizada'} com sucesso.`,
                position: "top-center",
            });
            onSuccess();
            handleDialogStateChange(false);
        } catch (error) {
            toast.error("Erro", {
                description: (error as Error).message
            });
        }
    };

    const handleDelete = async () => {
        if (!maintenance) return;
        try {
            await api.deleteMaintenance(maintenance.id);
            toast("Sucesso!", {
                description: "Manutenção deletada."
            });
            onSuccess();
            handleDialogStateChange(false);
        } catch (error) {
            toast("Erro", {
                description: (error as Error).message
            });
        }
    };

    interface FormFieldComponentProps {
        name: keyof MaintenanceFormData;
        label: string;
        required?: boolean;
        // A correção está aqui: usamos o tipo específico do nosso formulário
        children: (field: ControllerRenderProps<MaintenanceFormData, keyof MaintenanceFormData>) => React.ReactNode;
    }

    const FormFieldComponent = ({ name, label, required = false, children }: FormFieldComponentProps) => (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label} {required && <span className="text-red-500">*</span>}</FormLabel>
                    <FormControl>
                        {isEditMode ? (
                            children(field) // A tipagem correta permite que 'children' seja chamado como função
                        ) : (
                            <p className="py-2 text-sm h-9 flex items-center">{field.value || "N/A"}</p>
                        )}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogStateChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>
                        {isCreateMode ? "Criar Nova Manutenção" : (isEditMode ? "Editar Manutenção" : "Detalhes da Manutenção")}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormFieldComponent name="equipment" label="Equipamento/Área" required>
                            {/* Altere esta linha */}
                            {(field) => <Input {...field} value={field.value ?? ''} />}
                        </FormFieldComponent>
                        <FormFieldComponent name="description" label="Descrição do Serviço" required>
                            {/* Altere esta linha */}
                            {(field) => <Input {...field} value={field.value ?? ''} />}
                        </FormFieldComponent>
                        <div className="grid grid-cols-2 gap-4">
                            <FormFieldComponent name="requestor" label="Solicitante" required>
                                {/* Altere esta linha */}
                                {(field) => <Input {...field} value={field.value ?? ''} />}
                            </FormFieldComponent>
                            <FormFieldComponent name="responsible" label="Responsável" required>
                                {/* Altere esta linha */}
                                {(field) => <Input {...field} value={field.value ?? ''} />}
                            </FormFieldComponent>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormFieldComponent name="priority" label="Prioridade">
                                {(field) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LOW">Baixa</SelectItem>
                                            <SelectItem value="MEDIUM">Média</SelectItem>
                                            <SelectItem value="HIGH">Alta</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </FormFieldComponent>
                            <FormFieldComponent name="status" label="Status">
                                {(field) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PENDING">Pendente</SelectItem>
                                            <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                                            <SelectItem value="COMPLETED">Concluída</SelectItem>
                                            <SelectItem value="CANCELED">Cancelada</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </FormFieldComponent>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormFieldComponent name="startDate" label="Data de Início">
                                {(field) => <Input type="date" {...field} value={field.value || ''} />}
                            </FormFieldComponent>
                            <FormFieldComponent name="location" label="Localização">
                                {(field) => <Input {...field} value={field.value || ''} />}
                            </FormFieldComponent>
                        </div>

                        <DialogFooter>
                            {!isCreateMode && !isEditMode && (
                                <>
                                    <Button type="button" variant="destructive" onClick={handleDelete}>Excluir</Button>
                                    <Button type="button" onClick={() => setEditMode(true)}>Editar</Button>
                                </>
                            )}
                            {(isCreateMode || isEditMode) && (
                                <>
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">Cancelar</Button>
                                    </DialogClose>
                                    <Button type="submit">Salvar</Button>
                                </>
                            )}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}