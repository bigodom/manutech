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
    });
  }

  return (
    <PageLayout title="Nova Manutenção" subtitle="Cadastre uma nova solicitação de manutenção">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Número da Loja */}
          <div>
            <label className="block font-medium mb-1">Número da Loja*</label>
            <select
              name="storeNumber"
              value={form.storeNumber}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
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
          <div>
            <label className="block font-medium mb-1">Equipamento*</label>
            <input
              type="text"
              name="equipment"
              value={form.equipment}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Ex: Impressora, Caixa, etc."
            />
          </div>
          {/* Data do Pedido */}
          <div>
            <label className="block font-medium mb-1">Data do Pedido*</label>
            <input
              type="date"
              name="orderDate"
              value={form.orderDate}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          {/* Solicitante */}
          <div>
            <label className="block font-medium mb-1">Nome do Solicitante*</label>
            <input
              type="text"
              name="requester"
              value={form.requester}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Seu nome"
            />
          </div>
          {/* Responsável pela Manutenção */}
          <div>
            <label className="block font-medium mb-1">Responsável pela Manutenção*</label>
            <input
              type="text"
              name="responsible"
              value={form.responsible}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Nome do responsável (opcional)"
            />
          </div>
          {/* Setor */}
          <div>
            <label className="block font-medium mb-1">Setor</label>
            <input
              type="text"
              name="sector"
              value={form.sector}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Ex: TI, Manutenção, etc. (opcional)"
            />
          </div>
          {/* Prioridade */}
          <div>
            <label className="block font-medium mb-1">Prioridade*</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Média</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>
        </div>
        {/* Descrição do Problema */}
        <div>
          <label className="block font-medium mb-1">Descrição do Problema</label>
          <textarea
            name="problem"
            value={form.problem}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            rows={3}
            placeholder="Descreva o problema"
          />
        </div>
        {/* Observações */}
        <div>
          <label className="block font-medium mb-1">Observações</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={2}
            placeholder="Observações adicionais (opcional)"
          />
        </div>
        {/* Botões */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700 transition"
          >
            Criar Manutenção
          </button>
        </div>
      </form>
    </PageLayout>
  );
} 