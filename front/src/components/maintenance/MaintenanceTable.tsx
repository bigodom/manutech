import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import type { Maintenance } from '@/types/Maintenance';

interface MaintenanceTableProps {
  requests: Maintenance[];
  onUpdate: () => void;
}

const storeOptions = [
  { value: '1', label: 'Matriz' },
  { value: '2', label: 'Hiper' },
  { value: '12', label: 'Super' },
];
const priorityOptions = [
  { value: 'alta', label: 'Alta' },
  { value: 'média', label: 'Média' },
  { value: 'baixa', label: 'Baixa' },
];
const statusOptions = [
  { value: false, label: 'Pendente' },
  { value: true, label: 'Concluído' },
];

export default function MaintenanceTable({ requests, onUpdate }: MaintenanceTableProps) {
  const [selected, setSelected] = useState<Maintenance | null>(null);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Maintenance | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteEquipment, setDeleteEquipment] = useState('');
  const [deleteResponsible, setDeleteResponsible] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const handleRowClick = (request: Maintenance) => {
    setSelected(request);
    setEditValues(request);
    setIsEditing(false);
    setOpen(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditValues(selected);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValues(selected);
  };

  function convertDateToISO(date: string) {
    return new Date(date).toISOString();
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editValues) return;
    const { name, value } = e.target;
    setEditValues({
      ...editValues,
      [name]: name === "location" ? String(value) : value,
    });
  };

  function statusToBoolean(status: boolean | string): boolean {
    if (typeof status === 'boolean') return status;
    if (typeof status === 'string') {
      return status === 'concluido' || status === 'true';
    }
    return false;
  }

  const handleSave = async () => {
    if (!editValues) return;
    const payload = {
      equipment: editValues.equipment,
      description: editValues.description,
      requestor: editValues.requestor,
      responsible: editValues.responsible,
      priority: editValues.priority,
      startDate: editValues.startDate ? editValues.startDate.slice(0, 10) : '',
      status: statusToBoolean(editValues.status),
      location: editValues.location,
      sector: editValues.sector,
      department: editValues.department || '',
    };
    try {
      const response = await fetch(`http://192.168.11.143:3014/maintenance/${editValues.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Erro ao atualizar manutenção');
      setSelected(editValues);
      setIsEditing(false);
      setOpen(false);
      if (onUpdate) onUpdate(); // Atualiza a lista no componente pai
    } catch (e) {
      console.log(e);
      alert('Erro ao atualizar manutenção');
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (
      deleteEquipment !== selected.equipment ||
      deleteResponsible !== selected.responsible
    ) {
      setDeleteError('Os nomes não conferem.');
      return;
    }
    try {
      const response = await fetch(`http://192.168.11.143:3014/maintenance/${selected.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao deletar manutenção');
      setOpen(false);
      setShowDeleteConfirm(false);
      setDeleteEquipment('');
      setDeleteResponsible('');
      setDeleteError('');
      if (onUpdate) onUpdate();
    } catch (e) {
      setDeleteError('Erro ao deletar manutenção');
    }
  };

  const handleConclude = async (id: number) => {
    const req = requests.find(r => r.id === id);
    if (!req) return;
    const payload = {
      status: true,
    };
    if (!window.confirm("Deseja concluir a manutenção?")) return;
    try {
      const response = await fetch(`http://192.168.11.143:3014/maintenance/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Erro ao concluir manutenção');
      if (onUpdate) onUpdate();
    } catch (e) {
      alert('Erro ao concluir manutenção');
    }
  };

  // Função utilitária para traduzir prioridade
  function traduzirPrioridade(priority: string) {
    switch (priority) {
      case 'HIGH':
        return 'Alta';
      case 'MEDIUM':
        return 'Média';
      case 'LOW':
        return 'Baixa';
      default:
        return priority;
    }
  }

  // Função utilitária para formatar data no padrão brasileiro
  function formatarDataBR(dateString?: string | null) {
    if (!dateString) return '';
    // Extrai apenas a parte da data (YYYY-MM-DD)
    const [ano, mes, dia] = dateString.slice(0, 10).split('-');
    return `${dia}/${mes}/${ano}`;
  }

  return (
    <>
      <div className="overflow-auto w-full h-[80vh]">
        <table className="min-w-full w-full text-base">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-6 py-4 text-left text-lg">Loja</th>
              <th className="px-6 py-4 text-left text-lg">Equipamento</th>
              <th className="px-6 py-4 text-left text-lg">Responsável</th>
              <th className="px-6 py-4 text-left text-lg">Setor</th>
              <th className="px-6 py-4 text-left text-lg">Departamento</th>
              <th className="px-6 py-4 text-left text-lg">Prioridade</th>
              <th className="px-6 py-4 text-left text-lg">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-500 text-lg">
                  Nenhuma manutenção encontrada
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr
                  key={request.id}
                  className="border-b cursor-pointer hover:bg-blue-50 transition h-16 text-base"
                  onClick={() => handleRowClick(request)}
                >
                  <td className="px-6 py-4">{request.location}</td>
                  <td className="px-6 py-4">{request.equipment}</td>
                  <td className="px-6 py-4">{request.responsible}</td>
                  <td className="px-6 py-4">{request.sector || ''}</td>
                  <td className="px-6 py-4">{request.department || ''}</td>
                  <td className="px-6 py-4 capitalize">{traduzirPrioridade(request.priority)}</td>
                  <td className="px-6 py-4">
                    {!request.status && (
                      <button
                        className="bg-green-600 text-white px-3 py-2 rounded text-base hover:bg-green-700"
                        onClick={e => { e.stopPropagation(); handleConclude(request.id); }}
                      >
                        Concluir
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-8">
            <Dialog.Title className="text-2xl font-bold mb-4">Detalhes da Manutenção</Dialog.Title>
            {selected && editValues && (
              <form className="space-y-2" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                <div>
                  <strong>Loja:</strong>{' '}
                  {isEditing ? (
                    <select
                      name="location"
                      value={editValues.location || ''}
                      onChange={handleChange}
                      className="border rounded px-2 py-1"
                    >
                      {storeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    editValues.location == '1'
                      ? 'Matriz'
                      : editValues.location == '2'
                      ? 'Hiper'
                      : 'Super'
                  )}
                </div>
                <div>
                  <strong>Equipamento:</strong>{' '}
                  {isEditing ? (
                    <input
                      name="equipment"
                      value={editValues.equipment}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    editValues.equipment
                  )}
                </div>
                <div>
                  <strong>Solicitante:</strong>{' '}
                  {isEditing ? (
                    <input
                      name="requestor"
                      value={editValues.requestor}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    editValues.requestor
                  )}
                </div>
                <div>
                  <strong>Responsável:</strong>{' '}
                  {isEditing ? (
                    <input
                      name="responsible"
                      value={editValues.responsible}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    editValues.responsible
                  )}
                </div>
                <div>
                  <strong>Setor:</strong>{' '}
                  {isEditing ? (
                    <input
                      name="sector"
                      value={editValues.sector || ''}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    editValues.sector
                  )}
                </div>
                <div>
                  <strong>Data do Pedido:</strong>{' '}
                  {isEditing ? (
                    <input
                      type="date"
                      name="startDate"
                      value={editValues.startDate ? editValues.startDate.slice(0, 10) : ""}
                      onChange={handleChange}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    formatarDataBR(editValues.startDate)
                  )}
                </div>
                <div>
                  <strong>Prioridade:</strong>{' '}
                  {isEditing ? (
                    <select
                      name="priority"
                      value={editValues.priority}
                      onChange={handleChange}
                      className="border rounded px-2 py-1"
                    >
                      <option value="HIGH">Alta</option>
                      <option value="MEDIUM">Média</option>
                      <option value="LOW">Baixa</option>
                    </select>
                  ) : (
                    traduzirPrioridade(editValues.priority)
                  )}
                </div>
                <div>
                  <strong>Status:</strong>{' '}
                  {isEditing ? (
                    <select
                      name="status"
                      value={String(editValues.status)}
                      onChange={handleChange}
                      className="border rounded px-2 py-1"
                    >
                      {statusOptions.map(opt => (
                        <option key={String(opt.value)} value={String(opt.value)}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    editValues.status ? 'Concluído' : 'Pendente'
                  )}
                </div>
                <div>
                  <strong>Descrição do Problema:</strong>{' '}
                  {isEditing ? (
                    <textarea
                      name="description"
                      value={editValues.description}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                      editValues.description
                  )}
                </div>
                <div>
                  <strong>Observações:</strong>{' '}
                  {isEditing ? (
                    <textarea
                      name="notes"
                      value={editValues.notes}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    editValues.notes
                  )}
                </div>
                <div>
                  <strong>Departamento:</strong>{' '}
                  {isEditing ? (
                    <input
                      type="text"
                      name="department"
                      value={editValues.department || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Departamento"
                    />
                  ) : (
                    editValues.department
                  )}
                </div>
                <div className="flex gap-2 mt-6">
                  {isEditing ? (
                    <>
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Salvar</button>
                      <button type="button" onClick={handleCancelEdit} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">Cancelar</button>
                    </>
                  ) : (
                    <button type="button" onClick={handleEdit} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">Editar</button>
                  )}
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">Fechar</button>
                  </Dialog.Close>
                </div>
              </form>
            )}
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Deletar
              </button>
            </div>
            {showDeleteConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                  <h3 className="text-lg font-bold mb-2">Confirme a exclusão</h3>
                  <p className="mb-2 text-sm">Digite o nome do equipamento e do responsável para confirmar:</p>
                  <input
                    className="border rounded px-2 py-1 mb-2 w-full"
                    placeholder="Nome do equipamento"
                    value={deleteEquipment}
                    onChange={e => setDeleteEquipment(e.target.value)}
                  />
                  <input
                    className="border rounded px-2 py-1 mb-2 w-full"
                    placeholder="Nome do responsável"
                    value={deleteResponsible}
                    onChange={e => setDeleteResponsible(e.target.value)}
                  />
                  {deleteError && <div className="text-red-500 text-sm mb-2">{deleteError}</div>}
                  <div className="flex gap-2 justify-end">
                    <button
                      className="bg-gray-300 px-3 py-1 rounded"
                      onClick={() => { setShowDeleteConfirm(false); setDeleteEquipment(''); setDeleteResponsible(''); setDeleteError(''); }}
                    >
                      Cancelar
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={handleDelete}
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}