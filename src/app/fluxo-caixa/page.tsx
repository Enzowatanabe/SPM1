'use client';

import React, { useEffect, useState } from "react";

type Lancamento = {
  id: number;
  transacao: 'despesa' | 'receita';
  categoria: string;
  descricao: string;
  data: string;
  valor: number;
  formaPagamento: string;
  banco: string;
};

type ContaAPagar = {
  id: number;
  conta: string;
  descricao: string;
  valor: string;
  vencimento: string;
  dataPagamento: string;
  status: 'A PAGAR' | 'PAGA' | 'VENCIDA';
};

type ItemFluxo = {
  id: number | string;
  tipo: 'Lançamento' | 'Conta a Pagar';
  transacao: 'despesa' | 'receita';
  categoria: string;
  descricao: string;
  data: string;
  valor: number;
  status?: string;
  contaId?: number;
};

function formatDateBr(date: string) {
  if (!date) return '';
  const parts = date.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return date;
}

export default function FluxoCaixa() {
  const [itens, setItens] = useState<ItemFluxo[]>([]);
  const [filtroData, setFiltroData] = useState('');
  const [filtroTransacao, setFiltroTransacao] = useState<'todas' | 'receita' | 'despesa'>('todas');
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    const lancs: Lancamento[] = JSON.parse(localStorage.getItem("lancamentos") || "[]");
    const contas: ContaAPagar[] = JSON.parse(localStorage.getItem("contasapagar") || "[]");

    const lancsFluxo: ItemFluxo[] = lancs.map(l => ({
      id: "L" + l.id,
      tipo: "Lançamento",
      transacao: l.transacao,
      categoria: l.categoria,
      descricao: l.descricao,
      data: l.data,
      valor: l.valor,
    }));

    const contasFluxo: ItemFluxo[] = contas.map(c => ({
      id: "C" + c.id,
      tipo: "Conta a Pagar",
      transacao: 'despesa',
      categoria: c.conta,
      descricao: c.descricao,
      data: c.status === "PAGA" && c.dataPagamento ? c.dataPagamento : c.vencimento,
      valor: Number(c.valor),
      status: c.status,
      contaId: c.id
    }));

    setItens([...lancsFluxo, ...contasFluxo].sort((a, b) => (a.data > b.data ? 1 : -1)));
  }, [forceUpdate]);

  const filtrados = itens.filter(item => {
    if (filtroTransacao !== "todas" && item.transacao !== filtroTransacao) return false;
    if (filtroData && item.data !== filtroData) return false;
    return true;
  });

  const total = filtrados.reduce(
    (acc, cur) => cur.transacao === "receita" ? acc + cur.valor : acc - cur.valor,
    0
  );

  function marcarComoPaga(contaId: number) {
    const contas: ContaAPagar[] = JSON.parse(localStorage.getItem("contasapagar") || "[]");
    const hoje = new Date().toISOString().slice(0, 10);
    const contasAtualizadas = contas.map(c =>
      c.id === contaId
        ? { ...c, status: "PAGA", dataPagamento: hoje }
        : c
    );
    localStorage.setItem("contasapagar", JSON.stringify(contasAtualizadas));
    setForceUpdate(f => f + 1);
  }

  const simpleBtn: React.CSSProperties = {
    border: '1px solid #d0d0d0',
    background: 'none',
    color: '#222',
    borderRadius: 6,
    padding: '5px 14px',
    fontSize: 15,
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'background .16s, border .16s',
    margin: 0
  };

  return (
    <main style={{ maxWidth: 940, margin: "40px auto", background: "#fff", borderRadius: 10, padding: 24 }}>
      <h2 style={{ textAlign: "center", marginBottom: 18 }}>Fluxo de Caixa</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontWeight: 500, marginRight: 6 }}>Data:</label>
          <input
            type="date"
            value={filtroData}
            onChange={e => setFiltroData(e.target.value)}
            style={{ padding: 6, borderRadius: 6, border: "1px solid #ddd" }}
          />
        </div>
        <div>
          <label style={{ fontWeight: 500, marginRight: 6 }}>Transação:</label>
          <select
            value={filtroTransacao}
            onChange={e => setFiltroTransacao(e.target.value as any)}
            style={{ padding: 6, borderRadius: 6, border: "1px solid #ddd" }}
          >
            <option value="todas">Todas</option>
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
        </div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={th}>Tipo</th>
            <th style={th}>Transação</th>
            <th style={th}>Categoria</th>
            <th style={th}>Descrição</th>
            <th style={th}>Data</th>
            <th style={th}>Valor</th>
            <th style={th}>Status</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {filtrados.length === 0 && (
            <tr>
              <td colSpan={8} style={{ textAlign: "center", padding: 20, color: "#aaa" }}>Nenhum item encontrado.</td>
            </tr>
          )}
          {filtrados.map(item => (
            <tr key={item.id}>
              <td style={td}>{item.tipo}</td>
              <td style={{
                ...td,
                color: item.transacao === "receita" ? "#15803d" : "#be123c",
                fontWeight: "bold"
              }}>
                {item.transacao.charAt(0).toUpperCase() + item.transacao.slice(1)}
              </td>
              <td style={td}>{item.categoria}</td>
              <td style={td}>{item.descricao}</td>
              <td style={td}>{formatDateBr(item.data)}</td>
              <td style={{
                ...td,
                color: item.transacao === "receita" ? "#15803d" : "#be123c",
                fontWeight: 600
              }}>
                {item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </td>
              <td style={td}>
                {item.tipo === "Conta a Pagar" ? (item.status || "-") : "-"}
              </td>
              <td style={td}>
                {item.tipo === "Conta a Pagar" && (item.status === "A PAGAR" || item.status === "VENCIDA") && (
                  <button
                    onClick={() => item.contaId && marcarComoPaga(item.contaId)}
                    style={simpleBtn}
                    onMouseOver={e => e.currentTarget.style.background = "#f2f2f2"}
                    onMouseOut={e => e.currentTarget.style.background = "none"}
                  >
                    Marcar como paga
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{
        fontWeight: 700,
        fontSize: 20,
        textAlign: "right",
        color: total >= 0 ? "#137a23" : "#be123c",
        marginTop: 12
      }}>
        Total do período: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </div>
    </main>
  );
}

const th: React.CSSProperties = { padding: 9, textAlign: "left", borderBottom: "1px solid #eee" };
const td: React.CSSProperties = { padding: 8, borderBottom: "1px solid #f5f5f5" };
