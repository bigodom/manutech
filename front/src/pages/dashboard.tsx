import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import FlowChart from '@/components/dashboard/FlowChart';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Maintenance } from '@/types/Maintenance';

interface HighPriorityRequest {
  id: number;
  equipment: string;
  location: string;
}

interface StatsData {
  openCount: number;
  highPriorityCount: number;
  highPriorityRequests: HighPriorityRequest[];
}

interface FlowData {
  date: string;
  Criados: number;
  Concluídos: number;
  Abertos: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [flow, setFlow] = useState<FlowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<Maintenance | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, flowRes] = await Promise.all([
          fetch('http://192.168.11.143:3014/dashboard/stats'),
          fetch('http://192.168.11.143:3014/dashboard/flow')
        ]);
        const statsData = await statsRes.json();
        const flowData = await flowRes.json();
        setStats(statsData);
        setFlow(flowData);
      } catch (err) {
        // Trate erros conforme necessário
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedId !== null) {
      setDetailLoading(true);
      fetch(`http://192.168.11.143:3014/maintenance/${selectedId}`)
        .then(res => res.json())
        .then(data => setDetail(data))
        .finally(() => setDetailLoading(false));
    } else {
      setDetail(null);
    }
  }, [selectedId]);

  return (
    <div className="p-4 sm:p-6 overflow-auto lg:p-8 space-y-6">
      <h1 className="font-bold text-2xl sm:text-3xl text-foreground">Dashboard de Manutenção</h1>
      
      {/* Grid responsivo para os cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Card Chamados Abertos */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg text-muted-foreground">Chamados Abertos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl sm:text-4xl font-bold text-blue-600">
              {loading ? '...' : stats?.openCount ?? 0}
            </span>
          </CardContent>
        </Card>
        
        {/* Card Alta Prioridade */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg text-muted-foreground">Alta Prioridade</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl sm:text-4xl font-bold text-red-600">
              {loading ? '...' : stats?.highPriorityCount ?? 0}
            </span>
          </CardContent>
        </Card>
        
        {/* Card Chamados Urgentes */}
        <Card className="sm:col-span-2 lg:col-span-1 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg text-muted-foreground">Chamados Urgentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-32 overflow-y-auto">
              {loading ? (
                <div className="text-muted-foreground">Carregando...</div>
              ) : stats?.highPriorityRequests.length ? (
                stats.highPriorityRequests.map((item) => (
                  <div
                    key={item.id}
                    className="py-2 px-2 border-b last:border-b-0 hover:bg-accent transition-colors cursor-pointer rounded-sm"
                    onClick={() => setSelectedId(item.id)}
                  >
                    <div className="font-semibold text-primary underline text-sm sm:text-base">
                      {item.equipment}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{item.location}</div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground text-sm">Nenhum chamado urgente</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Card do Gráfico de Fluxo */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl text-foreground">Fluxo de Chamados (30 dias)</CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <div className="h-64 sm:h-80 lg:h-96">
            <FlowChart data={flow} />
          </div>
        </CardContent>
      </Card>
      {/* Dialog para detalhes do chamado */}
      <Dialog open={selectedId !== null} onOpenChange={open => !open && setSelectedId(null)}>
        <DialogContent className="max-w-lg mx-4 sm:mx-auto max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Detalhes do Chamado #{selectedId}</DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-muted-foreground">Carregando...</div>
            </div>
          ) : detail ? (
            <div className="space-y-3 text-sm sm:text-base">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-semibold text-muted-foreground">Equipamento:</span>
                  <span className="text-foreground">{detail.equipment}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-semibold text-muted-foreground">Descrição:</span>
                  <span className="text-foreground text-right sm:max-w-xs">{detail.description || '-'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-semibold text-muted-foreground">Solicitante:</span>
                  <span className="text-foreground">{detail.requestor}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-semibold text-muted-foreground">Responsável:</span>
                  <span className="text-foreground">{detail.responsible || '-'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-semibold text-muted-foreground">Prioridade:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    detail.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                    detail.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {detail.priority === 'HIGH' ? 'Alta' : detail.priority === 'MEDIUM' ? 'Média' : 'Baixa'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-semibold text-muted-foreground">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    detail.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {detail.status ? 'Concluído' : 'Aberto'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-semibold text-muted-foreground">Localização:</span>
                  <span className="text-foreground">{detail.location || '-'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-semibold text-muted-foreground">Data de Início:</span>
                  <span className="text-foreground">{detail.startDate ? new Date(detail.startDate).toLocaleString('pt-BR') : '-'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-semibold text-muted-foreground">Criado em:</span>
                  <span className="text-foreground">{new Date(detail.createdAt).toLocaleString('pt-BR')}</span>
                </div>
                {detail.updatedAt && (
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-semibold text-muted-foreground">Atualizado em:</span>
                    <span className="text-foreground">{new Date(detail.updatedAt).toLocaleString('pt-BR')}</span>
                  </div>
                )}
                {detail.completionDate && (
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-semibold text-muted-foreground">Data de Conclusão:</span>
                    <span className="text-foreground">{new Date(detail.completionDate).toLocaleString('pt-BR')}</span>
                  </div>
                )}
                {detail.notes && (
                  <div className="border-t pt-3">
                    <span className="font-semibold text-muted-foreground block mb-2">Notas:</span>
                    <span className="text-foreground text-sm bg-muted p-3 rounded">{detail.notes}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Não foi possível carregar os detalhes.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardPage; 