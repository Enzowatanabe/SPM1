"use client";
import React, { useEffect, useState } from "react";

// Mock de funções de busca (substituir por fetch real depois)
async function fetchClientes() {
  const res = await fetch('/api/clientes');
  const data = await res.json();
  // Garante que cada cliente tenha id, nome e valorTotal
  return (Array.isArray(data) ? data : []).map((c: any) => ({
    id: c.id,
    nome: c.nome,
    valorVenda: Number(c.valorTotal || 0)
  }));
}
async function fetchLancamentosDoCliente(nomeCliente: string) {
  const res = await fetch('/api/lancamentos');
  const data = await res.json();
  // Filtra apenas despesas relacionadas ao cliente
  return (Array.isArray(data) ? data : [])
    .filter((l: any) => l.transacao === 'despesa' && (
      (l.categoria && l.categoria.toLowerCase().includes(nomeCliente.toLowerCase())) ||
      (l.descricao && l.descricao.toLowerCase().includes(nomeCliente.toLowerCase()))
    ))
    .map((l: any) => ({
      id: l.id,
      descricao: l.descricao || l.categoria,
      valor: Number(l.valor || 0)
    }));
}
async function fetchFuncionarios() {
  const res = await fetch('/api/funcionarios');
  const data = await res.json();
  // Garante que cada funcionário tenha id, nome, funcao e valorDia
  return (Array.isArray(data) ? data : []).map((f: any) => ({
    id: f.id,
    nome: f.nome,
    funcao: f.cargo, // usa o campo cargo como funcao
    valorDia: Number(f.valorDia || 0)
  }));
}

export default function LucroPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [cliente, setCliente] = useState<any>(null);
  const [lancamentos, setLancamentos] = useState<any[]>([]);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [marceneiroId, setMarceneiroId] = useState("");
  const [montadorId, setMontadorId] = useState("");
  const [diasProducao, setDiasProducao] = useState(1);
  const [diasMontagem, setDiasMontagem] = useState(1);

  useEffect(() => {
    async function load() {
      setClientes(await fetchClientes());
      setFuncionarios(await fetchFuncionarios());
    }
    load();
  }, []);

  useEffect(() => {
    if (!clienteId) return;
    const c = clientes.find(c => c.id == clienteId);
    setCliente(c);
    if (c) fetchLancamentosDoCliente(c.nome).then(setLancamentos);
  }, [clienteId, clientes]);

  const marceneiro = funcionarios.find(f => f.id == marceneiroId);
  const montador = funcionarios.find(f => f.id == montadorId);
  const custoMarceneiro = marceneiro ? marceneiro.valorDia * diasProducao : 0;
  const custoMontador = montador ? montador.valorDia * diasMontagem : 0;
  const totalLancamentos = lancamentos.reduce((acc, l) => acc + l.valor, 0);
  const totalCustos = totalLancamentos + custoMarceneiro + custoMontador;
  const lucro = cliente ? cliente.valorVenda - totalCustos : 0;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px #0001", padding: 32 }}>
      <h2>Análise de Lucro</h2>
      <div style={{ marginBottom: 24 }}>
        <label>Cliente:<br />
          <select value={clienteId} onChange={e => setClienteId(e.target.value)} style={{ minWidth: 220, padding: 8, borderRadius: 6 }}>
            <option value="">Selecione um cliente</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </label>
      </div>
      {cliente && (
        <div style={{ marginBottom: 24 }}>
          <strong>Valor da Venda:</strong> R$ {cliente.valorVenda.toLocaleString()}
        </div>
      )}
      {cliente && (
        <>
          <h3>Lançamentos</h3>
          <ul>
            {lancamentos.map(l => (
              <li key={l.id}>{l.descricao}: R$ {l.valor.toLocaleString()}</li>
            ))}
          </ul>
          <h3>Custos de Produção e Montagem</h3>
          <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
            <div>
              <label>Marceneiro:<br />
                <select value={marceneiroId} onChange={e => setMarceneiroId(e.target.value)}>
                  <option value="">Selecione</option>
                  {funcionarios.filter(f => f.funcao && f.funcao.toLowerCase().includes("marceneiro")).map(f => (
                    <option key={f.id} value={f.id}>{f.nome} (R$ {f.valorDia}/dia)</option>
                  ))}
                </select>
              </label><br />
              <label>Dias de produção:<br />
                <input type="number" min={1} value={diasProducao} onChange={e => setDiasProducao(Number(e.target.value))} style={{ width: 60 }} />
              </label>
            </div>
            <div>
              <label>Montador:<br />
                <select value={montadorId} onChange={e => setMontadorId(e.target.value)}>
                  <option value="">Selecione</option>
                  {funcionarios.filter(f => f.funcao && f.funcao.toLowerCase().includes("montador")).map(f => (
                    <option key={f.id} value={f.id}>{f.nome} (R$ {f.valorDia}/dia)</option>
                  ))}
                </select>
              </label><br />
              <label>Dias de montagem:<br />
                <input type="number" min={1} value={diasMontagem} onChange={e => setDiasMontagem(Number(e.target.value))} style={{ width: 60 }} />
              </label>
            </div>
          </div>
          <h3>Resumo</h3>
          <ul>
            <li>Total de lançamentos: R$ {totalLancamentos.toLocaleString()}</li>
            <li>Custo marceneiro: R$ {custoMarceneiro.toLocaleString()}</li>
            <li>Custo montador: R$ {custoMontador.toLocaleString()}</li>
            <li><strong>Total de custos: R$ {totalCustos.toLocaleString()}</strong></li>
            <li><strong>Lucro/prejuízo: R$ {lucro.toLocaleString()}</strong></li>
          </ul>
        </>
      )}
    </div>
  );
} 