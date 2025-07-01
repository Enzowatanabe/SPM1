'use client';

import React, { useState, useEffect } from 'react';

type Conta = {
  id: number;
  conta: string;
  descricao: string;
  valor: string;
  vencimento: string;
  dataPagamento: string;
  status: 'A PAGAR' | 'PAGA' | 'VENCIDA';
};

export default function ContasAPagar() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [filtro, setFiltro] = useState<'TODAS' | 'A PAGAR' | 'PAGA' | 'VENCIDA'>('TODAS');
  const [form, setForm] = useState({
    conta: '',
    descricao: '',
    valor: '',
    vencimento: '',
    dataPagamento: '',
    status: 'A PAGAR' as 'A PAGAR' | 'PAGA' | 'VENCIDA',
  });

  // Carrega contas do localStorage
  useEffect(() => {
    const salvo = localStorage.getItem('contasapagar');
    if (salvo) setContas(JSON.parse(salvo));
  }, []);

  // Atualiza vencidas automaticamente
  useEffect(() => {
    const hoje = new Date().toISOString().slice(0, 10);
    const atualizadas = contas.map(c =>
      c.status === 'A PAGAR' && c.vencimento < hoje
        ? { ...c, status: 'VENCIDA' as const }
        : c
    );
    if (JSON.stringify(atualizadas) !== JSON.stringify(contas)) {
      setContas(atualizadas);
      localStorage.setItem('contasapagar', JSON.stringify(atualizadas));
    }
    // eslint-disable-next-line
  }, [contas.length]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.conta || !form.valor || !form.vencimento) {
      alert("Preencha os campos obrigatórios!");
      return;
    }
    if (form.status === "PAGA" && !form.dataPagamento) {
      alert("Preencha a data de pagamento!");
      return;
    }
    const novaConta: Conta = {
      id: Date.now(),
      conta: form.conta,
      descricao: form.descricao,
      valor: form.valor,
      vencimento: form.vencimento,
      dataPagamento: form.status === "PAGA" ? form.dataPagamento : "",
      status: form.status,
    };
    const listaNova = [...contas, novaConta];
    setContas(listaNova);
    localStorage.setItem('contasapagar', JSON.stringify(listaNova));
    setForm({
      conta: '',
      descricao: '',
      valor: '',
      vencimento: '',
      dataPagamento: '',
      status: 'A PAGAR'
    });
  }

  function atualizarStatus(id: number, novo: Conta['status']) {
    const listaNova = contas.map(c =>
      c.id === id
        ? {
            ...c,
            status: novo,
            dataPagamento:
              novo === 'PAGA'
                ? c.dataPagamento || new Date().toISOString().slice(0, 10)
                : ''
          }
        : c
    );
    setContas(listaNova);
    localStorage.setItem('contasapagar', JSON.stringify(listaNova));
  }

  function excluirConta(id: number) {
    if (!window.confirm("Excluir essa conta?")) return;
    const listaNova = contas.filter(c => c.id !== id);
    setContas(listaNova);
    localStorage.setItem('contasapagar', JSON.stringify(listaNova));
  }

  // Filtro
  const contasFiltradas = contas.filter(c => filtro === 'TODAS' ? true : c.status === filtro);

  // Destaques
  function getRowStyle(status: string) {
    if (status === 'A PAGAR') return { background: '#fffbe7', fontWeight: 600 };
    if (status === 'VENCIDA') return { background: '#ffe4e6', fontWeight: 700, color: '#b4002e' };
    return {};
  }

  // Função para formatar a data no formato brasileiro sem problemas de timezone
  function formatarDataBR(data: string) {
    if (!data) return "";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  return (
    <main style={{ maxWidth: 1100, margin: '40px auto', background: '#fff', borderRadius: 10, padding: 24, fontFamily: 'sans-serif', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 18 }}>Contas a Pagar</h2>
      {/* Formulário */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 18 }}>
        <input
          name="conta"
          placeholder="Conta (ex: Energia)"
          value={form.conta}
          onChange={handleChange}
          required
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', minWidth: 100 }}
        />
        <input
          name="descricao"
          placeholder="Descrição"
          value={form.descricao}
          onChange={handleChange}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', minWidth: 100 }}
        />
        <input
          name="valor"
          type="number"
          step="0.01"
          placeholder="Valor (R$)"
          value={form.valor}
          onChange={handleChange}
          required
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', minWidth: 80 }}
        />
        <input
          name="vencimento"
          type="date"
          placeholder="Vencimento"
          value={form.vencimento}
          onChange={handleChange}
          required
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
        >
          <option value="A PAGAR">A PAGAR</option>
          <option value="PAGA">PAGA</option>
          <option value="VENCIDA">VENCIDA</option>
        </select>
        {form.status === "PAGA" && (
          <input
            name="dataPagamento"
            type="date"
            placeholder="Data de Pagamento"
            value={form.dataPagamento}
            onChange={handleChange}
            required
            style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
          />
        )}
        <button
          type="submit"
          style={{
            background: '#3182ce',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: 6,
            padding: '8px 18px',
            cursor: 'pointer'
          }}
        >
          Cadastrar Conta
        </button>
      </form>
      {/* Filtro */}
      <div style={{ marginBottom: 13 }}>
        <b>Filtrar por status:</b>
        <button onClick={() => setFiltro('TODAS')} style={{ marginLeft: 9, marginRight: 2, background: filtro === 'TODAS' ? "#e7f2ff" : "#eee", border: "none", borderRadius: 5, padding: "4px 13px", cursor: "pointer", fontWeight: filtro === 'TODAS' ? 600 : 400 }}>Todas</button>
        <button onClick={() => setFiltro('A PAGAR')} style={{ marginRight: 2, background: filtro === 'A PAGAR' ? "#fffbe7" : "#eee", border: "none", borderRadius: 5, padding: "4px 13px", cursor: "pointer", fontWeight: filtro === 'A PAGAR' ? 600 : 400 }}>A Pagar</button>
        <button onClick={() => setFiltro('PAGA')} style={{ marginRight: 2, background: filtro === 'PAGA' ? "#e7fff2" : "#eee", border: "none", borderRadius: 5, padding: "4px 13px", cursor: "pointer", fontWeight: filtro === 'PAGA' ? 600 : 400 }}>Paga</button>
        <button onClick={() => setFiltro('VENCIDA')} style={{ background: filtro === 'VENCIDA' ? "#ffe4e6" : "#eee", border: "none", borderRadius: 5, padding: "4px 13px", cursor: "pointer", fontWeight: filtro === 'VENCIDA' ? 600 : 400, color: "#b4002e" }}>Vencida</button>
      </div>
      {/* Tabela */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15, fontSize: 15 }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={{ padding: 8 }}>Conta</th>
            <th style={{ padding: 8 }}>Descrição</th>
            <th style={{ padding: 8 }}>Valor (R$)</th>
            <th style={{ padding: 8 }}>Vencimento</th>
            <th style={{ padding: 8 }}>Data de Pagamento</th>
            <th style={{ padding: 8 }}>Status</th>
            <th style={{ padding: 8 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {contasFiltradas.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', color: '#888', padding: 20 }}>Nenhuma conta encontrada.</td>
            </tr>
          )}
          {contasFiltradas.map(c => (
            <tr key={c.id} style={getRowStyle(c.status)}>
              <td style={{ padding: 8 }}>{c.conta}</td>
              <td style={{ padding: 8 }}>{c.descricao}</td>
              <td style={{ padding: 8 }}>{Number(c.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td style={{ padding: 8 }}>
                {c.vencimento ? formatarDataBR(c.vencimento) : ''}
              </td>
              <td style={{ padding: 8 }}>
                {c.dataPagamento
                  ? formatarDataBR(c.dataPagamento)
                  : (c.status === "PAGA" ? <i style={{ color: "#b4002e" }}>Sem data</i> : '')}
              </td>
              <td style={{ padding: 8 }}>
                <select
                  value={c.status}
                  onChange={e => atualizarStatus(c.id, e.target.value as Conta['status'])}
                  style={{
                    background: "none",
                    border: "1px solid #eee",
                    borderRadius: 5,
                    fontWeight: "bold",
                    color: c.status === "VENCIDA" ? "#b4002e" : "#232323"
                  }}
                >
                  <option value="A PAGAR">A PAGAR</option>
                  <option value="PAGA">PAGA</option>
                  <option value="VENCIDA">VENCIDA</option>
                </select>
              </td>
              <td style={{ padding: 8 }}>
                <button onClick={() => excluirConta(c.id)} style={{ background: "#eee", color: "#c02626", border: "none", borderRadius: 5, padding: "4px 10px", cursor: "pointer" }}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
