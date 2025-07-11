'use client';

import React, { useState, useEffect } from 'react';

type Lancamento = {
  id: number;
  transacao: 'despesa' | 'receita';
  categoria: string;
  descricao: string;
  data: string;
  valor: number;
  formaPagamento: 'débito' | 'crédito' | 'pix';
  banco: 'Santander' | 'Inter' | 'Outros';
};

const bancos = ['Santander', 'Inter', 'Outros'] as const;

function AnaliseLucro() {
  return (
    <div style={{ padding: 32 }}>
      <h3>Análise de Lucro</h3>
      <p>Selecione um cliente para analisar o lucro...</p>
      {/* Aqui será implementada a lógica de análise de lucro */}
    </div>
  );
}

export default function FinanceiroPage() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [form, setForm] = useState({
    transacao: 'despesa',
    categoria: '',
    descricao: '',
    data: '',
    valor: '',
    formaPagamento: 'débito',
    banco: 'Santander',
  });
  const [saldo, setSaldo] = useState(0);
  const [aba, setAba] = useState<'lancamentos'>('lancamentos');

  // FILTROS
  const [filtroTransacao, setFiltroTransacao] = useState<'todas' | 'receita' | 'despesa'>('todas');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroDescricao, setFiltroDescricao] = useState('');
  const [filtroMes, setFiltroMes] = useState('');
  // Estado para categorias únicas (para o combobox)
  const [categoriasUnicas, setCategoriasUnicas] = useState<string[]>([]);

  useEffect(() => {
    async function carregarLancamentos() {
      const res = await fetch('/api/lancamentos');
      const data = await res.json();
      setLancamentos(data);
      calcularSaldo(data);
      // Atualiza categorias únicas
      const cats = Array.from(new Set(data.map((l: Lancamento) => l.categoria))).filter((cat): cat is string => Boolean(cat));
      setCategoriasUnicas(cats);
    }
    carregarLancamentos();
  }, []);

  function calcularSaldo(arr: Lancamento[]) {
    const saldoAtual = arr.reduce(
      (acc, cur) =>
        cur.transacao === 'receita' ? acc + cur.valor : acc - cur.valor,
      0
    );
    setSaldo(saldoAtual);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const novo = {
      transacao: form.transacao as 'despesa' | 'receita',
      categoria: form.categoria,
      descricao: form.descricao,
      data: form.data,
      valor: Number(form.valor),
      formaPagamento: form.formaPagamento as 'débito' | 'crédito' | 'pix',
      banco: form.banco as 'Santander' | 'Inter' | 'Outros',
    };
    await fetch('/api/lancamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novo),
    });
    // Recarrega lançamentos
    const res = await fetch('/api/lancamentos');
    const data = await res.json();
    setLancamentos(data);
    calcularSaldo(data);
    // Atualiza categorias únicas, incluindo a nova se não existir
    setCategoriasUnicas(prev => {
      if (!prev.includes(form.categoria) && form.categoria) {
        return [...prev, form.categoria];
      }
      return prev;
    });
    setForm({
      transacao: 'despesa',
      categoria: '',
      descricao: '',
      data: '',
      valor: '',
      formaPagamento: 'débito',
      banco: 'Santander',
    });
  }

  async function excluir(id: number) {
    await fetch(`/api/lancamentos/${id}`, { method: 'DELETE' });
    // Recarrega lançamentos
    const res = await fetch('/api/lancamentos');
    const data = await res.json();
    setLancamentos(data);
    calcularSaldo(data);
  }

  // ---- FILTRO DOS RESULTADOS ----
  const mesesUnicos = Array.from(
    new Set(lancamentos.map((l) => l.data?.slice(0, 7)))
  ).filter(Boolean);

  // Aplicando todos os filtros juntos
  const filtrados = lancamentos.filter((l) => {
    // Filtra tipo de transação
    if (filtroTransacao !== 'todas' && l.transacao !== filtroTransacao) return false;
    // Filtra categoria
    if (filtroCategoria && l.categoria !== filtroCategoria) return false;
    // Filtra descrição
    if (filtroDescricao && !l.descricao.toLowerCase().includes(filtroDescricao.toLowerCase())) return false;
    // Filtra mês
    if (filtroMes && l.data?.slice(0, 7) !== filtroMes) return false;
    return true;
  });

  return (
    <main
      style={{
        maxWidth: 940,
        margin: '40px auto',
        background: '#fff',
        borderRadius: 10,
        padding: 24,
        fontFamily: 'sans-serif',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Financeiro</h2>
      {/* Removido o seletor de abas */}
      {aba === 'lancamentos' && (
        <>
          <div
            style={{
              textAlign: 'center',
              fontSize: 22,
              fontWeight: 'bold',
              color: saldo >= 0 ? '#138a23' : '#c02626',
              marginBottom: 20,
            }}
          >
            Saldo Atual: R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>

          {/* FILTROS */}
          <div style={{
            display: 'flex',
            gap: 12,
            marginBottom: 16,
            alignItems: 'center',
            flexWrap: 'wrap',
            background: '#f5f5f5',
            borderRadius: 8,
            padding: 12,
            justifyContent: 'space-between'
          }}>
            <div>
              <label style={{ fontWeight: 500, marginRight: 6 }}>Transação:</label>
              <select value={filtroTransacao} onChange={e => setFiltroTransacao(e.target.value as any)}
                style={{ padding: 6, borderRadius: 6, border: '1px solid #ddd', marginRight: 10 }}>
                <option value="todas">Todas</option>
                <option value="receita">Receita</option>
                <option value="despesa">Despesa</option>
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 500, marginRight: 6 }}>Categoria:</label>
              <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}
                style={{ padding: 6, borderRadius: 6, border: '1px solid #ddd', marginRight: 10, minWidth: 120 }}>
                <option value="">Todas</option>
                {categoriasUnicas.map((cat) => (
                  <option value={cat} key={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 500, marginRight: 6 }}>Descrição:</label>
              <input
                value={filtroDescricao}
                onChange={e => setFiltroDescricao(e.target.value)}
                placeholder="Buscar"
                style={{ padding: 6, borderRadius: 6, border: '1px solid #ddd', minWidth: 120 }}
              />
            </div>
            <div>
              <label style={{ fontWeight: 500, marginRight: 6 }}>Mês:</label>
              <select value={filtroMes} onChange={e => setFiltroMes(e.target.value)}
                style={{ padding: 6, borderRadius: 6, border: '1px solid #ddd', minWidth: 90 }}>
                <option value="">Todos</option>
                {mesesUnicos.map(mes => (
                  <option value={mes} key={mes}>
                    {mes.split('-')[1]}/{mes.split('-')[0]}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                setFiltroTransacao('todas');
                setFiltroCategoria('');
                setFiltroDescricao('');
                setFiltroMes('');
              }}
              style={{
                padding: '6px 16px',
                border: 'none',
                borderRadius: 5,
                background: '#ececec',
                cursor: 'pointer',
                fontWeight: 500
              }}>
              Limpar Filtros
            </button>
          </div>

          {/* FORMULÁRIO */}
          <form
            onSubmit={handleSubmit}
            style={{
              marginBottom: 32,
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              alignItems: 'center',
              background: '#f9f9f9',
              borderRadius: 8,
              padding: 12,
            }}
          >
            <select
              name="transacao"
              value={form.transacao}
              onChange={handleChange}
              required
              style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
            >
              <option value="despesa">Despesa</option>
              <option value="receita">Receita</option>
            </select>
            {/* Campo de categoria como combobox editável */}
            <input
              name="categoria"
              placeholder="Categoria (Cliente/Fornecedor)"
              value={form.categoria}
              onChange={handleChange}
              required
              list="categorias"
              style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', width: 140 }}
            />
            <datalist id="categorias">
              {categoriasUnicas.map((cat) => (
                <option value={cat} key={cat} />
              ))}
            </datalist>
            <input
              name="descricao"
              placeholder="Descrição"
              value={form.descricao}
              onChange={handleChange}
              required
              style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', flex: 2, minWidth: 120 }}
            />
            <input
              name="data"
              type="date"
              value={form.data}
              onChange={handleChange}
              required
              style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', width: 120 }}
            />
            <input
              name="valor"
              placeholder="Valor"
              type="number"
              min={0}
              step="0.01"
              value={form.valor}
              onChange={handleChange}
              required
              style={{
                padding: 8,
                borderRadius: 6,
                border: '1px solid #ddd',
                width: 110,
                color: '#1370be',
                fontWeight: 600,
              }}
            />
            <select
              name="formaPagamento"
              value={form.formaPagamento}
              onChange={handleChange}
              required
              style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', width: 108 }}
            >
              <option value="débito">Débito</option>
              <option value="crédito">Crédito</option>
              <option value="pix">PIX</option>
            </select>
            <select
              name="banco"
              value={form.banco}
              onChange={handleChange}
              required
              style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', width: 100 }}
            >
              {bancos.map((banco) => (
                <option value={banco} key={banco}>
                  {banco}
                </option>
              ))}
            </select>
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
                minWidth: 98,
              }}
            >
              Adicionar
            </button>
          </form>
          <div style={{
            margin: '0 0 18px 0',
            padding: '8px 0',
            fontWeight: 'bold',
            fontSize: 18,
            color: filtrados.length === 0 ? '#555' :
              filtrados.every(l => l.transacao === 'receita') ? '#138a23'
                : filtrados.every(l => l.transacao === 'despesa') ? '#c02626'
                : '#313131'
          }}>
            Soma dos itens filtrados:&nbsp;
            {filtrados.length === 0 ? 'R$ 0,00' :
              'R$ ' + filtrados
                .reduce((acc, cur) => cur.transacao === 'receita'
                  ? acc + cur.valor
                  : acc - cur.valor, 0)
                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>

          <h3 style={{ marginBottom: 10 }}>Extrato</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f4f4f4' }}>
                <th style={{ padding: 8, textAlign: 'left' }}>Transação</th>
                <th style={{ padding: 8, textAlign: 'left' }}>Categoria</th>
                <th style={{ padding: 8, textAlign: 'left' }}>Descrição</th>
                <th style={{ padding: 8, textAlign: 'center' }}>Data</th>
                <th style={{ padding: 8, textAlign: 'right' }}>Valor</th>
                <th style={{ padding: 8, textAlign: 'center' }}>Forma Pgto.</th>
                <th style={{ padding: 8, textAlign: 'center' }}>Banco</th>
                <th style={{ padding: 8 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: '#888', padding: 24 }}>
                    Nenhum lançamento encontrado.
                  </td>
                </tr>
              )}
              {filtrados.map((l) => (
                <tr key={l.id}>
                  <td
                    style={{
                      padding: 8,
                      color: l.transacao === 'receita' ? '#138a23' : '#c02626',
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                    }}
                  >
                    {l.transacao}
                  </td>
                  <td style={{ padding: 8 }}>{l.categoria}</td>
                  <td style={{ padding: 8 }}>{l.descricao}</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>
                    {l.data && l.data.split('-').reverse().join('/')}
                  </td>
                  <td
                    style={{
                      padding: 8,
                      textAlign: 'right',
                      color: l.transacao === 'receita' ? '#138a23' : '#c02626',
                      fontWeight: 'bold',
                    }}
                  >
                    R$ {l.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: 8, textAlign: 'center' }}>{l.formaPagamento.toUpperCase()}</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>{l.banco}</td>
                  <td style={{ padding: 8 }}>
                    <button
                      onClick={() => excluir(l.id)}
                      style={{
                        background: '#eee',
                        border: 'none',
                        borderRadius: 5,
                        padding: '4px 10px',
                        color: '#c02626',
                        cursor: 'pointer',
                      }}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}
