import prisma from "../services/databaseClient.js";

export const getDashboardStats = async (req, res) => {
  try {
    // a. Total de chamados abertos (status: false)
    const openCount = await prisma.maintenance.count({ where: { status: false } });

    // b. Chamados abertos e prioridade 'HIGH'
    const highPriorityCount = await prisma.maintenance.count({
      where: { status: false, priority: 'HIGH' }
    });

    // c. Lista de chamados abertos e prioridade 'HIGH'
    const highPriorityRequests = await prisma.maintenance.findMany({
      where: { status: false, priority: 'HIGH' },
      select: { id: true, equipment: true, location: true },
      orderBy: { startDate: 'asc' }
    });

    res.status(200).json({
      openCount,
      highPriorityCount,
      highPriorityRequests
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar estatísticas do dashboard" });
  }
};

export const getFlowData = async (req, res) => {
  try {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 29); // 30 dias incluindo hoje
    startDate.setHours(0, 0, 0, 0);

    // Buscar todos os chamados criados e concluídos nos últimos 30 dias
    const maintenances = await prisma.maintenance.findMany({
      where: {
        OR: [
          { createdAt: { gte: startDate } },
          { completionDate: { gte: startDate } }
        ]
      },
      select: {
        createdAt: true,
        completionDate: true,
        status: true
      }
    });

    // Inicializar o array de datas
    const days = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      days.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
        Criados: 0,
        Concluídos: 0
      });
    }

    // Contabilizar criados e concluídos
    maintenances.forEach((m) => {
      // Criados
      const createdIdx = Math.floor((m.createdAt - startDate) / (1000 * 60 * 60 * 24));
      if (createdIdx >= 0 && createdIdx < 30) {
        days[createdIdx].Criados++;
      }
      // Concluídos
      if (m.status && m.completionDate) {
        const completedIdx = Math.floor((m.completionDate - startDate) / (1000 * 60 * 60 * 24));
        if (completedIdx >= 0 && completedIdx < 30) {
          days[completedIdx].Concluídos++;
        }
      }
    });

    res.status(200).json(days);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar dados de fluxo" });
  }
}; 