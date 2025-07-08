import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';

export function NewMaintenance() {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    storeNumber: '',
    equipment: '',
    orderDate: today,
    requester: '',
    responsible: '',
    sector: '',
    priority: 'LOW',
    problem: '',
    notes: '',
    department: '', // Added department field
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    function handleDateToISO(date: string) {
      return new Date(date).toISOString();
    }
    // Mapeamento dos campos do frontend para o backend
    const payload = {
      equipment: form.equipment,
      description: form.problem, 
      requestor: form.requester, 
      responsible: form.responsible,
      sector: form.sector,
      priority: form.priority.toUpperCase(),
      startDate: handleDateToISO(form.orderDate),
      status: false, 
      location: form.storeNumber, 
      notes: form.notes, 
      department: form.department, // Added department field
    };

    try {
      console.log(payload);
      const response = await fetch('http://192.168.11.143:3014/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar manutenção');
      }

      // Limpa o formulário e mostra sucesso
      setForm({
        storeNumber: '',
        equipment: '',
        orderDate: today,
        requester: '',
        responsible: '',
        sector: '',
        priority: 'LOW',
        problem: '',
        notes: '',
        department: '', // Reset department field
      });
      console.log(response);
      alert('Manutenção criada com sucesso!');
    } catch (error) {
      alert('Erro ao criar manutenção');
    }
  }

  function handleCancel() {
    setForm({
      storeNumber: '',
      equipment: '',
      orderDate: today,
      requester: '',
      responsible: '',
      sector: '',
      priority: 'LOW',
      problem: '',
      notes: '',
      department: '', // Reset department field
    });
  }

  return (
    <PageLayout title="Nova Manutenção" subtitle="Cadastre uma nova solicitação de manutenção">
      <div className="min-h-screen flex flex-col px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="bg-white max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 rounded-lg shadow space-y-4 sm:space-y-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Número da Loja */}
            <div className="col-span-1">
              <label className="block text-sm font-medium mb-2 text-gray-700">Número da Loja*</label>
              <select
                name="storeNumber"
                value={form.storeNumber}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Selecione</option>
                <option value="1">1 - Matriz</option>
                <option value="2">2 - Hiper</option>
                <option value="3">3 - HiperLanches</option>
                <option value="11">11 - HiperLanches Filial</option>
                <option value="12">12 - Super</option>
              </select>
            </div>
            {/* Equipamento */}
            <div className="col-span-1">
              <label className="block text-sm font-medium mb-2 text-gray-700">Equipamento*</label>
              <input
                type="text"
                name="equipment"
                value={form.equipment}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ex: Impressora, Caixa, etc."
              />
            </div>
            {/* Data do Pedido */}
            <div className="col-span-1 sm:col-span-1">
              <label className="block text-sm font-medium mb-2 text-gray-700">Data do Pedido*</label>
              <input
                type="date"
                name="orderDate"
                value={form.orderDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            {/* Solicitante */}
            <div className="col-span-1">
              <label className="block text-sm font-medium mb-2 text-gray-700">Nome do Solicitante*</label>
              <input
                type="text"
                name="requester"
                value={form.requester}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Seu nome"
              />
            </div>
            {/* Responsável pela Manutenção */}
            <div className="col-span-1">
              <label className="block text-sm font-medium mb-2 text-gray-700">Responsável pela Manutenção*</label>
              <input
                type="text"
                name="responsible"
                value={form.responsible}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Nome do responsável (opcional)"
              />
            </div>
            {/* Setor */}
            <div className="col-span-1">
              <label className="block text-sm font-medium mb-2 text-gray-700">Setor</label>
              <input
                type="text"
                name="sector"
                value={form.sector}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ex: TI, Manutenção, etc. (opcional)"
              />
            </div>
            {/* Prioridade */}
            <div className="col-span-1">
              <label className="block text-sm font-medium mb-2 text-gray-700">Prioridade*</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>
            {/* Departamento */}
            <div className="col-span-1">
              <label className="block text-sm font-medium mb-2 text-gray-700">Departamento*</label>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ex: TI, Manutenção, etc."
              />
            </div>
          </div>
          {/* Descrição do Problema */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Descrição do Problema*</label>
            <textarea
              name="problem"
              value={form.problem}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              rows={3}
              placeholder="Descreva o problema"
            />
          </div>
          {/* Observações */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Observações</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              rows={2}
              placeholder="Observações adicionais (opcional)"
            />
          </div>
          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-md hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Criar Manutenção
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}