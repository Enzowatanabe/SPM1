"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Mock de funções de busca (substituir por fetch real depois)
async function fetchCliente(id: string) {
  // Buscar dados do cliente (incluindo valor da venda)
  return { id, nome: "Cliente Exemplo", valorVenda: 10000 };
}
async function fetchLancamentosDoCliente(nomeCliente: string) {
  // Buscar lançamentos relacionados ao cliente
  return [
    { id: 1, descricao: "Compra de MDF", valor: 2000 },
    { id: 2, descricao: "Ferragens", valor: 500 },
    { id: 3, descricao: "Entrega", valor: 300 },
  ];
}
async function fetchFuncionarios() {
  // Buscar lista de funcionários
  return [
    { id: 1, nome: "João Marceneiro", funcao: "Marceneiro", valorDia: 200 },
    { id: 2, nome: "Carlos Montador", funcao: "Montador", valorDia: 180 },
  ];
}

export default function LucroClientePage() {
  const params = useParams();
  const id = params?.id as string;

  const [cliente, setCliente] = useState<any>(null);
  const [lancamentos, setLancamentos] = useState<any[]>([]);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [marceneiroId, setMarceneiroId] = useState("");
  const [montadorId, setMontadorId] = useState("");
  const [diasProducao, setDiasProducao] = useState(1);
  const [diasMontagem, setDiasMontagem] = useState(1);

  useEffect(() => {
    async function load() {
      const c = await fetchCliente(id);
      setCliente(c);
      setLancamentos(await fetchLancamentosDoCliente(c.nome));
      setFuncionarios(await fetchFuncionarios());
    }
    load();
  }, [id]);

  const marceneiro = funcionarios.find(f => f.id == marceneiroId);
  const montador = funcionarios.find(f => f.id == montadorId);
  const custoMarceneiro = marceneiro ? marceneiro.valorDia * diasProducao : 0;
  const custoMontador = montador ? montador.valorDia * diasMontagem : 0;
  const totalLancamentos = lancamentos.reduce((acc, l) => acc + l.valor, 0);
  const totalCustos = totalLancamentos + custoMarceneiro + custoMontador;
  const lucro = cliente ? cliente.valorVenda - totalCustos : 0;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px #0001", padding: 32 }}>
      <h2>Análise de Lucro do Cliente</h2>
      {cliente && (
        <div style={{ marginBottom: 24 }}>
          <strong>Cliente:</strong> {cliente.nome}<br />
          <strong>Valor da Venda:</strong> R$ {cliente.valorVenda.toLocaleString()}
        </div>
      )}
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
              {funcionarios.filter(f => f.funcao === "Marceneiro").map(f => (
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
              {funcionarios.filter(f => f.funcao === "Montador").map(f => (
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
    </div>
  );
} 