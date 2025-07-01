'use client';

import React, { useEffect, useState } from 'react';

type Orcamento = {
  id: number;
  cliente: string;
  projeto: string;
  valor: number;
  data: string;
};

export default function OrcamentosPage() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [form, setForm] = useState({ cliente: '', projeto: '', valor: '', data: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/orcamentos')
      .then(res => res.json())
      .then(data => setOrcamentos(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/orcamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente: form.cliente,
        projeto: form.projeto,
        valor: Number(form.valor),
        data: form.data,
      }),
    });

    if (res.ok) {
      const novo = await res.json();
      setOrcamentos([...orcamentos, novo]);
      setForm({ cliente: '', projeto: '', valor: '', data: '' });
    }
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Orçamentos</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <input
          placeholder="Cliente"
          value={form.cliente}
          onChange={e => setForm({ ...form, cliente: e.target.value })}
          required
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <input
          placeholder="Projeto"
          value={form.projeto}
          onChange={e => setForm({ ...form, projeto: e.target.value })}
          required
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <input
          placeholder="Valor"
          type="number"
          value={form.valor}
          onChange={e => setForm({ ...form, valor: e.target.value })}
          required
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <input
          placeholder="Data"
          type="date"
          value={form.data}
          onChange={e => setForm({ ...form, data: e.target.value })}
          required
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <button type="submit" disabled={loading} style={{ padding: 10, width: '100%' }}>
          {loading ? 'Salvando...' : 'Cadastrar'}
        </button>
      </form>

      <h3>Lista de Orçamentos</h3>
      <ul>
        {orcamentos.map(o => (
          <li key={o.id} style={{ marginBottom: 12, borderBottom: '1px solid #ddd', paddingBottom: 6 }}>
            <b>{o.cliente}</b> - {o.projeto} - R$ {o.valor} - {o.data}
          </li>
        ))}
      </ul>
      {orcamentos.length === 0 && <p>Nenhum orçamento cadastrado ainda.</p>}
    </main>
  );
}
