'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Parcela = { valor: string; data: string };
type Cliente = {
  nome: string;
  celular: string;
  email: string;
  cpf: string;
  rg: string;
  enderecoEntrega: string;
  numeroEntrega: string;
  bairroEntrega: string;
  enderecoResidencial: string;
  numeroResidencial: string;
  bairroResidencial: string;
  valorTotal: string;
  valorSinal: string;
  dataSinal: string;
  parcelas: number;
  descricao: string;
  parcelasDetalhe?: Parcela[];
};

export default function ListaClientes() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [visualizando, setVisualizando] = useState<any | null>(null);
  const [editando, setEditando] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function carregarClientes() {
    setLoading(true);
    const res = await fetch('/api/clientes');
    let data;
    try {
      data = await res.json();
    } catch {
      data = [];
    }
    setClientes(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  async function excluirCliente(id: number) {
    if (!window.confirm("Deseja realmente excluir este cliente?")) return;
    await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
    carregarClientes();
  }

  function getDataVenda(cliente: any) {
    if (cliente.dataSinal) return cliente.dataSinal;
    if (cliente.parcelasDetalhe && cliente.parcelasDetalhe.length > 0 && cliente.parcelasDetalhe[0].data)
      return cliente.parcelasDetalhe[0].data;
    return "";
  }

  // MODAL
  function ModalCliente({ cliente, onClose }: { cliente: any; onClose: () => void }) {
    return (
      <div style={{
        position: "fixed",
        zIndex: 1001,
        left: 0, top: 0, width: "100vw", height: "100vh",
        background: "rgba(30,30,30,0.27)",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}
        onClick={onClose}
      >
        <div
          style={{
            background: "#fff",
            padding: 32,
            borderRadius: 12,
            minWidth: 410,
            maxWidth: "97vw",
            boxShadow: "0 6px 36px #0002",
            position: "relative",
            fontFamily: "inherit"
          }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute", right: 18, top: 12, background: "#faf9f5", border: "none", fontSize: 18,
              color: "#bb8927", borderRadius: 99, padding: "3px 12px", fontWeight: 700, cursor: "pointer"
            }}
            aria-label="Fechar"
          >×</button>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 24, color: "#bb8927", marginBottom: 15 }}>{cliente.nome}</h2>
          <div style={{ marginBottom: 10 }}>
            <b>Data da Venda:</b>{" "}
            {getDataVenda(cliente) ? new Date(getDataVenda(cliente)).toLocaleDateString('pt-BR') : <span style={{ color: "#ccc" }}>--</span>}
          </div>
          <div style={{ marginBottom: 7 }}><b>Celular:</b> {cliente.celular}</div>
          <div style={{ marginBottom: 7 }}><b>Email:</b> {cliente.email}</div>
          <div style={{ marginBottom: 7 }}><b>CPF:</b> {cliente.cpf} &nbsp;&nbsp; <b>RG:</b> {cliente.rg}</div>
          <hr style={{ margin: "14px 0" }} />
          <div>
            <b>Endereço de Entrega:</b><br />
            {cliente.enderecoEntrega}, nº {cliente.numeroEntrega}, {cliente.bairroEntrega}
          </div>
          <div style={{ marginTop: 4 }}>
            <b>Endereço Residencial:</b><br />
            {cliente.enderecoResidencial}, nº {cliente.numeroResidencial}, {cliente.bairroResidencial}
          </div>
          <hr style={{ margin: "14px 0" }} />
          <div style={{ marginBottom: 7 }}>
            <b>Valor Total:</b> R$ {Number(cliente.valorTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ marginBottom: 7 }}>
            <b>Valor do Sinal:</b> R$ {Number(cliente.valorSinal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} &nbsp;
            <b>Data do Sinal:</b> {cliente.dataSinal ? new Date(cliente.dataSinal).toLocaleDateString('pt-BR') : "--"}
          </div>
          {/* Parcelas */}
          {cliente.parcelasDetalhadas && cliente.parcelasDetalhadas.length > 0 && (
            <div style={{ marginBottom: 7 }}>
              <b>Parcelas:</b>
              <ol style={{ margin: "5px 0 0 16px", padding: 0 }}>
                {cliente.parcelasDetalhadas.map((p: any, i: number) =>
                  <li key={i}>
                    Valor: R$ {Number(p.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} &nbsp; | &nbsp;
                    Data: {p.data ? new Date(p.data).toLocaleDateString('pt-BR') : "--"}
                  </li>
                )}
              </ol>
            </div>
          )}
          <hr style={{ margin: "14px 0" }} />
          <div>
            <b>Descrição do Pedido:</b><br />
            <span style={{ whiteSpace: "pre-line", color: "#333" }}>{cliente.descricao}</span>
          </div>
        </div>
      </div>
    );
  }

  // MODAL DE EDIÇÃO
  function ModalEditarCliente({ cliente, onClose, onSalvo }: { cliente: any, onClose: () => void, onSalvo: () => void }) {
    const [form, setForm] = useState({ ...cliente });
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      await fetch(`/api/clientes/${cliente.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      onSalvo();
      onClose();
    }
    return (
      <div style={{ position: "fixed", zIndex: 1001, left: 0, top: 0, width: "100vw", height: "100vh", background: "rgba(30,30,30,0.27)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
        <form onClick={e => e.stopPropagation()} onSubmit={handleSubmit} style={{ background: "#fff", padding: 32, borderRadius: 12, minWidth: 410, maxWidth: "97vw", boxShadow: "0 6px 36px #0002", position: "relative", fontFamily: "inherit" }}>
          <button type="button" onClick={onClose} style={{ position: "absolute", right: 18, top: 12, background: "#faf9f5", border: "none", fontSize: 18, color: "#bb8927", borderRadius: 99, padding: "3px 12px", fontWeight: 700, cursor: "pointer" }} aria-label="Fechar">×</button>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 24, color: "#bb8927", marginBottom: 15 }}>Editar Cliente</h2>
          <label>Nome</label>
          <input name="nome" value={form.nome} onChange={handleChange} style={{ width: '100%', marginBottom: 10 }} />
          <label>Celular</label>
          <input name="celular" value={form.celular} onChange={handleChange} style={{ width: '100%', marginBottom: 10 }} />
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} style={{ width: '100%', marginBottom: 10 }} />
          <label>CPF</label>
          <input name="cpfCnpj" value={form.cpfCnpj || form.cpf || ''} onChange={handleChange} style={{ width: '100%', marginBottom: 10 }} />
          <label>RG</label>
          <input name="rg" value={form.rg || ''} onChange={handleChange} style={{ width: '100%', marginBottom: 10 }} />
          <label>Endereço de Entrega</label>
          <input name="enderecoEntrega" value={form.enderecoEntrega || ''} onChange={handleChange} style={{ width: '100%', marginBottom: 10 }} />
          <label>Número Entrega</label>
          <input name="numeroEntrega" value={form.numeroEntrega || ''} onChange={handleChange} style={{ width: '100%', marginBottom: 10 }} />
          <label>Bairro Entrega</label>
          <input name="bairroEntrega" value={form.bairroEntrega || ''} onChange={handleChange} style={{ width: '100%', marginBottom: 10 }} />
          <label>Endereço Residencial</label>
          <input name="enderecoResidencial" value={form.enderecoResidencial || ''} onChange={handleChange} style={{ width: '100%', marginBottom: 10 }} />
          <label>Número Residencial</label>
          <input name="numeroResidencial" value={form.numeroResidencial || ''} onChange={handleChange} style={{ width: '100%', marginBottom: 10 }} />
          <label>Bairro Residencial</label>
          <input name="bairroResidencial" value={form.bairroResidencial || ''} onChange={handleChange} style={{ width: '100%', marginBottom: 10 }} />
          <label>Descrição</label>
          <textarea name="descricao" value={form.descricao || ''} onChange={handleChange} style={{ width: '100%', marginBottom: 10 }} />
          <button type="submit" style={{ background: "#bb8927", color: "#fff", fontWeight: 600, border: "none", borderRadius: 7, padding: "12px 0", marginTop: 14, fontSize: 17, width: "100%", boxShadow: "0 1px 8px #0001", cursor: "pointer" }}>Salvar</button>
        </form>
      </div>
    );
  }

  // Substituir o setVisualizando(c) do botão 'Ver' por uma função que busca o cliente completo
  async function verClienteCompleto(id: number) {
    const res = await fetch(`/api/clientes/${id}`);
    const data = await res.json();
    setVisualizando(data);
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 30 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#bb8927", marginBottom: 22 }}>Lista de Clientes</h1>
      {loading && <div style={{ textAlign: 'center', color: '#bb8927', marginBottom: 18 }}>Carregando...</div>}
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fcfcfc" }}>
        <thead>
          <tr style={{ background: "#f3f3f3" }}>
            <th style={thtd}>#</th>
            <th style={thtd}>Nome</th>
            <th style={thtd}>Data da Venda</th>
            <th style={thtd}>Celular</th>
            <th style={thtd}>Email</th>
            <th style={thtd}>Valor Total</th>
            <th style={thtd}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {(!Array.isArray(clientes) || clientes.length === 0) && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: 30, color: "#aaa" }}>Nenhum cliente cadastrado.</td>
            </tr>
          )}
          {Array.isArray(clientes) && clientes.map((c, i) => (
            <tr key={c.id || i} style={{ borderBottom: "1px solid #eee" }}>
              <td style={thtd}>{i + 1}</td>
              <td style={thtd}>{c.nome}</td>
              <td style={thtd}>
                {getDataVenda(c)
                  ? new Date(getDataVenda(c)).toLocaleDateString('pt-BR')
                  : <span style={{ color: "#ccc" }}>Sem data</span>
                }
              </td>
              <td style={thtd}>{c.celular}</td>
              <td style={thtd}>{c.email}</td>
              <td style={thtd}>
                {c.valorTotal
                  ? "R$ " + Number(c.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                  : "--"}
              </td>
              <td style={thtd}>
                <button
                  onClick={() => verClienteCompleto(c.id)}
                  style={{ background: "#ececec", border: "none", borderRadius: 6, padding: "4px 14px", marginRight: 6, color: "#1a3867", fontWeight: 500, cursor: "pointer" }}
                >
                  Ver
                </button>
                <button
                  onClick={() => setEditando(c)}
                  style={{ background: "#fffbe6", border: "none", borderRadius: 6, padding: "4px 14px", marginRight: 6, color: "#bb8927", fontWeight: 500, cursor: "pointer" }}
                >
                  Editar
                </button>
                <button
                  onClick={() => router.push(`/clientes/${c.id}/lucro`)}
                  style={{ background: "#e0f7fa", border: "none", borderRadius: 6, padding: "4px 14px", marginRight: 6, color: "#007bff", fontWeight: 500, cursor: "pointer" }}
                >
                  Analisar Lucro
                </button>
                <button
                  onClick={() => excluirCliente(c.id)}
                  style={{ background: "#fdeaea", border: "none", borderRadius: 6, padding: "4px 14px", color: "#be3434", fontWeight: 500, cursor: "pointer" }}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {visualizando && <ModalCliente cliente={visualizando} onClose={() => setVisualizando(null)} />}
      {editando && <ModalEditarCliente cliente={editando} onClose={() => setEditando(null)} onSalvo={carregarClientes} />}
    </div>
  );
}

const thtd: React.CSSProperties = { padding: 8, textAlign: "left", borderBottom: "1px solid #eee", fontSize: 15 };
