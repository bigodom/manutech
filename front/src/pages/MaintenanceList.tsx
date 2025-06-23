import React, { useState, useEffect } from 'react';
// Caminhos ajustados para serem absolutos ou assumindo que os componentes estão no mesmo diretório ou em um diretório acessível
import  PageLayout from '@/components/layout/PageLayout'; 
import  MaintenanceTable from '@/components/maintenance/MaintenanceTable';
import type { Maintenance } from '@/types/Maintenance';

const storeOptions = [
  { value: 'all', label: 'Todas' },
  { value: '1', label: '1 - Matriz' },
  { value: '2', label: '2 - Hiper' },
  { value: '12', label: '12 - Super' },
];

const priorityOptions = [
  { value: 'all', label: 'Todas' },
  { value: 'HIGH', label: 'HIGH' },
  { value: 'MEDIUM', label: 'MEDIUM' },
  { value: 'LOW', label: 'LOW' },
];

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'false', label: 'Pendente' }, // 'false' para status boolean pendente
  { value: 'true', label: 'Concluído' },  // 'true' para status boolean concluído
];


export default function MaintenanceList() { 
  const [requests, setRequests] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    store: 'all',
    priority: 'all',
    status: 'false',
    search: '',
  });

  const fetchMaintenanceRequests = async () => {
    try {
      setLoading(true); 
      setError(null); 

      // Certifique-se de que este IP é o mesmo que o do seu backend
      const response = await fetch('http://192.168.11.143:3014/maintenance'); 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Maintenance[] = await response.json();
      setRequests(data);
    } catch (e: any) {
      console.error("Erro ao buscar manutenções:", e);
      setError(`Falha ao carregar as solicitações: ${e.message}`);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []); 

  const handleUpdate = () => {
    fetchMaintenanceRequests(); // Refetch a lista quando uma manutenção é atualizada
  };


  const filteredRequests = requests.filter((request) => {
    // Para loja, usando 'location' que o backend retorna. 
    // Adapte a lógica se 'location' não for diretamente o número da loja.
    const matchesStore = filters.store === 'all' ||
      String(request.location) === String(filters.store);
                         
    const matchesPriority = filters.priority === 'all' || request.priority === filters.priority;
    
    // Ajuste para status boolean
    const matchesStatus = filters.status === 'all' || 
                          request.status.toString() === filters.status;
    
    const matchesSearch = !filters.search ||
      request.equipment.toLowerCase().includes(filters.search.toLowerCase()) ||
      (request.requestor || '').toLowerCase().includes(filters.search.toLowerCase()) || 
      (request.responsible || '').toLowerCase().includes(filters.search.toLowerCase()); 

    return matchesStore && matchesPriority && matchesStatus && matchesSearch;
  });

  return (
    <PageLayout title="Lista de Manutenções" subtitle="Gerencie todas as solicitações de manutenção">
      <div className="bg-white p-6 rounded-lg shadow">
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
          <div>
            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Loja</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={filters.store}
              onChange={e => setFilters(f => ({ ...f, store: e.target.value }))}
            >
              {storeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Prioridade</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={filters.priority}
              onChange={e => setFilters(f => ({ ...f, priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' | 'all' }))}
            >
              {priorityOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Status</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={filters.status}
              onChange={e => setFilters(f => ({ ...f, status: e.target.value as 'false' | 'true' | 'all' }))}
            >
              {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Buscar</label>
            <input
              className="w-full border rounded px-2 py-1"
              placeholder="Equipamento ou solicitante..."
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            />
          </div>
        </div>
        
        {/* Botão Nova Manutenção */}
        <div className="flex justify-end mb-4">
          <button
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700 transition"
            onClick={() => window.location.href = '/new-maintenance'}
          >
            Nova Manutenção
          </button>
        </div>

        {/* Exibição condicional de loading, erro ou tabela */}
        {loading && (
          <div className="flex justify-center items-center h-48">
            <p className="text-blue-600 text-lg">Carregando manutenções...</p>
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center h-48">
            <p className="text-red-500 text-lg">Erro: {error}</p>
          </div>
        )}
        {!loading && !error && (
          <MaintenanceTable requests={filteredRequests} onUpdate={handleUpdate} />
        )}
      </div>
    </PageLayout>
  );
}
