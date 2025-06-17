import { useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { Maintenance, Priority } from "@/types/Maintenance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MaintenanceDialog } from "./MaintenanceDialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Mapeamento de prioridades para cores e texto
const priorityStyles: Record<Priority, string> = {
  HIGH: "bg-red-500 text-white",
  MEDIUM: "bg-yellow-500 text-white",
  LOW: "bg-blue-500 text-white",
};

interface MaintenanceTableProps {
  data: Maintenance[];
  onRefetch: () => void;
}

export function MaintenanceTable({ data, onRefetch }: MaintenanceTableProps) {
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleRowClick = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setDialogOpen(true);
  };

  const handleDialogClose = (success: boolean) => {
    setDialogOpen(false);
    setSelectedMaintenance(null);
    if (success) {
      onRefetch();
    }
  };

  const columns: ColumnDef<Maintenance>[] = [
    { accessorKey: "equipment", header: "Equipamento" },
    { accessorKey: "requestor", header: "Solicitante" },
    {
      accessorKey: "priority",
      header: "Prioridade",
      cell: ({ row }) => {
        const priority = row.original.priority;
        return <Badge className={priorityStyles[priority]}>{priority}</Badge>;
      },
    },
    {
      accessorKey: "startDate",
      header: "Data de Início",
      cell: ({ row }) => {
        const date = row.original.startDate;
        return date ? format(new Date(date), "dd/MM/yyyy") : "N/A";
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => handleRowClick(row.original)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedMaintenance && (
        <MaintenanceDialog
          isOpen={isDialogOpen}
          onOpenChange={handleDialogClose}
          maintenance={selectedMaintenance}
          onSuccess={onRefetch}
        />
      )}
    </>
  );
}