'use client';

import React, { useState, useEffect } from 'react';

// Tipos
export type Conta = {
  id?: number;
  conta: string;
  descricao?: string;
  valor: string;
  vencimento: string;
  dataPagamento?: string;
  status: 'A PAGAR' | 'PAGA' | 'VENCIDA';
  createdAt?: string;
};

export default function ContasAPagar() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [filtro, setFiltro] = useState<'TODAS' | 'A PAGAR' | 'PAGA' | 'VENCIDA'>('TODAS');
  const [filtroTexto, setFiltroTexto] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formEdit, setFormEdit] = useState({
    conta: '',
    descricao: '',
    valor: '',
    vencimento: '',
    dataPagamento: '',
    status: 'A PAGAR' as 'A PAGAR' | 'PAGA' | 'VENCIDA',
  });
  const [form, setForm] = useState({
    conta: '',
    descricao: '',
    valor: '',
    vencimento: '',
    dataPagamento: '',
    status: 'A PAGAR' as 'A PAGAR' | 'PAGA' | 'VENCIDA',
  });
  const [loading, setLoading] = useState(false);

  // Carrega contas do backend
  async function carregarContas() {
    setLoading(true);
    try {
      const res = await fetch('/api/contasapagar');
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro desconhecido');
      }
      const data = await res.json();
      setContas(data);
    } catch (error: any) {
      alert('Erro ao carregar contas: ' + (error.message || error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarContas();
  }, []);

  // Atualiza vencidas automaticamente
  useEffect(() => {
    const hoje = new Date().toISOString().slice(0, 10);
    contas.forEach(async (c) => {
      if (c.status === 'A PAGAR' && c.vencimento < hoje) {
        await atualizarStatus(c.id!, 'VENCIDA');
      }
    });
    // eslint-disable-next-line
  }, [contas.length]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleChangeEdit(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
  }

  function iniciarEdicao(conta: Conta) {
    setEditandoId(conta.id!);
    setFormEdit({
      conta: conta.conta,
      descricao: conta.descricao || '',
      valor: conta.valor,
      vencimento: conta.vencimento,
      dataPagamento: conta.dataPagamento || '',
      status: conta.status,
    });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setFormEdit({
      conta: '',
      descricao: '',
      valor: '',
      vencimento: '',
      dataPagamento: '',
      status: 'A PAGAR',
    });
  }

  async function salvarEdicao() {
    if (!editandoId) return;
    
    if (!formEdit.conta || !formEdit.valor || !formEdit.vencimento) {
      alert('Preencha os campos obrigatórios!');
      return;
    }
    if (formEdit.status === 'PAGA' && !formEdit.dataPagamento) {
      alert('Preencha a data de pagamento!');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/contasapagar/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conta: formEdit.conta,
          descricao: formEdit.descricao,
          valor: String(formEdit.valor),
          vencimento: formEdit.vencimento,
          dataPagamento: formEdit.status === 'PAGA' ? formEdit.dataPagamento : '',
          status: formEdit.status,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro desconhecido');
      }
      await carregarContas();
      cancelarEdicao();
    } catch (error: any) {
      alert('Erro ao salvar alterações: ' + (error.message || error));
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.conta || !form.valor || !form.vencimento) {
      alert('Preencha os campos obrigatórios!');
      return;
    }
    if (form.status === 'PAGA' && !form.dataPagamento) {
      alert('Preencha a data de pagamento!');
      return;
    }
    const novaConta = {
      conta: form.conta,
      descricao: form.descricao,
      valor: String(form.valor),
      vencimento: form.vencimento,
      dataPagamento: form.status === 'PAGA' ? form.dataPagamento : '',
      status: form.status,
    };
    try {
      setLoading(true);
      const res = await fetch('/api/contasapagar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaConta),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro desconhecido');
      }
      await carregarContas();
      setForm({
        conta: '',
        descricao: '',
        valor: '',
        vencimento: '',
        dataPagamento: '',
        status: 'A PAGAR',
      });
    } catch (error: any) {
      alert('Erro ao salvar conta: ' + (error.message || error));
    } finally {
      setLoading(false);
    }
  }

  async function atualizarStatus(id: number, novo: Conta['status']) {
    try {
      setLoading(true);
      // Buscar a conta atual para enviar todos os campos
      const conta = contas.find(c => c.id === id);
      if (!conta) throw new Error('Conta não encontrada');
      const res = await fetch(`/api/contasapagar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...conta,
          status: novo,
          dataPagamento: novo === 'PAGA' ? new Date().toISOString().slice(0, 10) : '',
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro desconhecido');
      }
      await carregarContas();
    } catch (error: any) {
      alert('Erro ao atualizar status: ' + (error.message || error));
    } finally {
      setLoading(false);
    }
  }

  async function excluirConta(id: number) {
    if (!window.confirm('Excluir essa conta?')) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/contasapagar/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      await carregarContas();
    } catch (error) {
      alert('Erro ao excluir conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  // Filtro
  const contasFiltradas = contas.filter((c) => {
    // Filtro por status
    if (filtro !== 'TODAS' && c.status !== filtro) return false;
    // Filtro por texto (nome da conta)
    if (filtroTexto && !c.conta.toLowerCase().includes(filtroTexto.toLowerCase())) return false;
    return true;
  });

  // Destaques
  function getRowStyle(status: string) {
    if (status === 'A PAGAR') return { background: '#fffbe7', fontWeight: 600 };
    if (status === 'VENCIDA') return { background: '#ffe4e6', fontWeight: 700, color: '#b4002e' };
    return {};
  }

  // Função para formatar a data no formato brasileiro sem problemas de timezone
  function formatarDataBR(data: string) {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
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
        {form.status === 'PAGA' && (
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
            cursor: 'pointer',
          }}
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Cadastrar Conta'}
        </button>
      </form>
      {/* Filtro */}
      <div style={{ marginBottom: 13 }}>
        <div style={{ marginBottom: 8 }}>
          <b>Filtrar por status:</b>
          <button onClick={() => setFiltro('TODAS')} style={{ marginLeft: 9, marginRight: 2, background: filtro === 'TODAS' ? '#e7f2ff' : '#eee', border: 'none', borderRadius: 5, padding: '4px 13px', cursor: 'pointer', fontWeight: filtro === 'TODAS' ? 600 : 400 }}>Todas</button>
          <button onClick={() => setFiltro('A PAGAR')} style={{ marginRight: 2, background: filtro === 'A PAGAR' ? '#fffbe7' : '#eee', border: 'none', borderRadius: 5, padding: '4px 13px', cursor: 'pointer', fontWeight: filtro === 'A PAGAR' ? 600 : 400 }}>A Pagar</button>
          <button onClick={() => setFiltro('PAGA')} style={{ marginRight: 2, background: filtro === 'PAGA' ? '#e7fff2' : '#eee', border: 'none', borderRadius: 5, padding: '4px 13px', cursor: 'pointer', fontWeight: filtro === 'PAGA' ? 600 : 400 }}>Paga</button>
          <button onClick={() => setFiltro('VENCIDA')} style={{ background: filtro === 'VENCIDA' ? '#ffe4e6' : '#eee', border: 'none', borderRadius: 5, padding: '4px 13px', cursor: 'pointer', fontWeight: filtro === 'VENCIDA' ? 600 : 400, color: '#b4002e' }}>Vencida</button>
        </div>
        <div>
          <b>Pesquisar por nome da conta:</b>
          <input
            type="text"
            placeholder="Digite o nome da conta..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            style={{ 
              marginLeft: 8, 
              padding: '6px 12px', 
              borderRadius: 5, 
              border: '1px solid #ddd', 
              minWidth: 200,
              fontSize: 14
            }}
          />
          {filtroTexto && (
            <button 
              onClick={() => setFiltroTexto('')}
              style={{ 
                marginLeft: 8, 
                background: '#f3f4f6', 
                border: '1px solid #d1d5db', 
                borderRadius: 5, 
                padding: '6px 12px', 
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              Limpar
            </button>
          )}
        </div>
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
          {loading && (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', color: '#888', padding: 20 }}>Carregando...</td>
            </tr>
          )}
          {!loading && contasFiltradas.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', color: '#888', padding: 20 }}>Nenhuma conta encontrada.</td>
            </tr>
          )}
          {contasFiltradas.map((c) => (
            <tr key={c.id} style={getRowStyle(c.status)}>
              <td style={{ padding: 8 }}>
                {editandoId === c.id ? (
                  <input
                    name="conta"
                    value={formEdit.conta}
                    onChange={handleChangeEdit}
                    style={{ padding: 4, borderRadius: 4, border: '1px solid #ddd', width: '100%' }}
                  />
                ) : (
                  c.conta
                )}
              </td>
              <td style={{ padding: 8 }}>
                {editandoId === c.id ? (
                  <input
                    name="descricao"
                    value={formEdit.descricao}
                    onChange={handleChangeEdit}
                    style={{ padding: 4, borderRadius: 4, border: '1px solid #ddd', width: '100%' }}
                  />
                ) : (
                  c.descricao
                )}
              </td>
              <td style={{ padding: 8 }}>
                {editandoId === c.id ? (
                  <input
                    name="valor"
                    type="number"
                    step="0.01"
                    value={formEdit.valor}
                    onChange={handleChangeEdit}
                    style={{ padding: 4, borderRadius: 4, border: '1px solid #ddd', width: '100%' }}
                  />
                ) : (
                  Number(c.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                )}
              </td>
              <td style={{ padding: 8 }}>
                {editandoId === c.id ? (
                  <input
                    name="vencimento"
                    type="date"
                    value={formEdit.vencimento}
                    onChange={handleChangeEdit}
                    style={{ padding: 4, borderRadius: 4, border: '1px solid #ddd' }}
                  />
                ) : (
                  c.vencimento ? formatarDataBR(c.vencimento) : ''
                )}
              </td>
              <td style={{ padding: 8 }}>
                {editandoId === c.id ? (
                  formEdit.status === 'PAGA' ? (
                    <input
                      name="dataPagamento"
                      type="date"
                      value={formEdit.dataPagamento}
                      onChange={handleChangeEdit}
                      style={{ padding: 4, borderRadius: 4, border: '1px solid #ddd' }}
                    />
                  ) : (
                    ''
                  )
                ) : (
                  c.dataPagamento
                    ? formatarDataBR(c.dataPagamento)
                    : c.status === 'PAGA' ? <i style={{ color: '#b4002e' }}>Sem data</i> : ''
                )}
              </td>
              <td style={{ padding: 8 }}>
                {editandoId === c.id ? (
                  <select
                    name="status"
                    value={formEdit.status}
                    onChange={handleChangeEdit}
                    style={{
                      background: 'none',
                      border: '1px solid #eee',
                      borderRadius: 5,
                      fontWeight: 'bold',
                      color: formEdit.status === 'VENCIDA' ? '#b4002e' : '#232323',
                    }}
                  >
                    <option value="A PAGAR">A PAGAR</option>
                    <option value="PAGA">PAGA</option>
                    <option value="VENCIDA">VENCIDA</option>
                  </select>
                ) : (
                  <select
                    value={c.status}
                    onChange={(e) => c.id && atualizarStatus(c.id, e.target.value as Conta['status'])}
                    style={{
                      background: 'none',
                      border: '1px solid #eee',
                      borderRadius: 5,
                      fontWeight: 'bold',
                      color: c.status === 'VENCIDA' ? '#b4002e' : '#232323',
                    }}
                  >
                    <option value="A PAGAR">A PAGAR</option>
                    <option value="PAGA">PAGA</option>
                    <option value="VENCIDA">VENCIDA</option>
                  </select>
                )}
              </td>
              <td style={{ padding: 8 }}>
                {editandoId === c.id ? (
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button 
                      onClick={salvarEdicao}
                      disabled={loading}
                      style={{ 
                        background: '#10b981', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: 5, 
                        padding: '4px 8px', 
                        cursor: 'pointer',
                        fontSize: 12
                      }}
                    >
                      {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button 
                      onClick={cancelarEdicao}
                      style={{ 
                        background: '#6b7280', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: 5, 
                        padding: '4px 8px', 
                        cursor: 'pointer',
                        fontSize: 12
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button 
                      onClick={() => iniciarEdicao(c)}
                      style={{ 
                        background: '#3b82f6', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: 5, 
                        padding: '4px 8px', 
                        cursor: 'pointer',
                        fontSize: 12
                      }}
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => c.id && excluirConta(c.id)} 
                      style={{ 
                        background: '#eee', 
                        color: '#c02626', 
                        border: 'none', 
                        borderRadius: 5, 
                        padding: '4px 8px', 
                        cursor: 'pointer',
                        fontSize: 12
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
