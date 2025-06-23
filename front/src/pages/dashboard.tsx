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
    <div className="p-8">
      <h1 className="font-bold text-3xl mb-8">Dashboard de Manutenção</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Card Chamados Abertos */}
        <Card>
          <CardHeader>
            <CardTitle>Chamados Abertos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-4xl font-bold">
              {loading ? '...' : stats?.openCount ?? 0}
            </span>
          </CardContent>
        </Card>
        {/* Card Alta Prioridade */}
        <Card>
          <CardHeader>
            <CardTitle>Alta Prioridade</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-4xl font-bold">
              {loading ? '...' : stats?.highPriorityCount ?? 0}
            </span>
          </CardContent>
        </Card>
        {/* Card Chamados Urgentes */}
        <Card>
          <CardHeader>
            <CardTitle>Chamados Urgentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {loading ? (
                <div>...</div>
              ) : stats?.highPriorityRequests.length ? (
                stats.highPriorityRequests.map((item) => (
                  <div
                    key={item.id}
                    className="py-2 border-b last:border-b-0 hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => setSelectedId(item.id)}
                  >
                    <div className="font-semibold text-primary underline">
                      {item.equipment}
                    </div>
                    <div className="text-sm text-muted-foreground">{item.location}</div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground">Nenhum chamado urgente</div>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Card do Gráfico de Fluxo */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Fluxo de Chamados (30 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <FlowChart data={flow} />
          </CardContent>
        </Card>
      </div>
      {/* Dialog para detalhes do chamado */}
      <Dialog open={selectedId !== null} onOpenChange={open => !open && setSelectedId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Chamado</DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <div>Carregando...</div>
          ) : detail ? (
            <div className="space-y-2">
              <div><b>Equipamento:</b> {detail.equipment}</div>
              <div><b>Descrição:</b> {detail.description || '-'}</div>
              <div><b>Solicitante:</b> {detail.requestor}</div>
              <div><b>Responsável:</b> {detail.responsible || '-'}</div>
              <div><b>Prioridade:</b> {detail.priority}</div>
              <div><b>Data de Início:</b> {detail.startDate ? new Date(detail.startDate).toLocaleString() : '-'}</div>
              <div><b>Status:</b> {detail.status ? 'Concluído' : 'Aberto'}</div>
              <div><b>Localização:</b> {detail.location || '-'}</div>
              <div><b>Criado em:</b> {new Date(detail.createdAt).toLocaleString()}</div>
              {detail.updatedAt && <div><b>Atualizado em:</b> {new Date(detail.updatedAt).toLocaleString()}</div>}
              {detail.completionDate && <div><b>Data de Conclusão:</b> {new Date(detail.completionDate).toLocaleString()}</div>}
              {detail.notes && <div><b>Notas:</b> {detail.notes}</div>}
            </div>
          ) : (
            <div>Não foi possível carregar os detalhes.</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardPage; 