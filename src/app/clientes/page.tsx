'use client';

import React, { useEffect, useState } from "react";

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
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [visualizando, setVisualizando] = useState<Cliente | null>(null);

  useEffect(() => {
    const salvos = JSON.parse(localStorage.getItem("clientes") || "[]");
    // Compatibilidade: se não houver parcelasDetalhe, usa "parcelas" antigo.
    const ajustados = salvos.map((c: any) => ({
      ...c,
      parcelasDetalhe: c.parcelasDetalhe || c.parcelas || [],
    }));
    setClientes(ajustados);
  }, []);

  function excluirCliente(idx: number) {
    if (!window.confirm("Deseja realmente excluir este cliente?")) return;
    const novaLista = clientes.filter((_, i) => i !== idx);
    setClientes(novaLista);
    localStorage.setItem("clientes", JSON.stringify(novaLista));
  }

  function getDataVenda(cliente: Cliente) {
    if (cliente.dataSinal) return cliente.dataSinal;
    if (cliente.parcelasDetalhe && cliente.parcelasDetalhe.length > 0 && cliente.parcelasDetalhe[0].data)
      return cliente.parcelasDetalhe[0].data;
    return "";
  }

  // MODAL
  function ModalCliente({ cliente, onClose }: { cliente: Cliente; onClose: () => void }) {
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
          {cliente.parcelasDetalhe && cliente.parcelasDetalhe.length > 0 && (
            <div style={{ marginBottom: 7 }}>
              <b>Parcelas:</b>
              <ol style={{ margin: "5px 0 0 16px", padding: 0 }}>
                {cliente.parcelasDetalhe.map((p, i) =>
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

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 30 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#bb8927", marginBottom: 22 }}>Lista de Clientes</h1>
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
          {clientes.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: 30, color: "#aaa" }}>Nenhum cliente cadastrado.</td>
            </tr>
          )}
          {clientes.map((c, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
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
                  onClick={() => setVisualizando(c)}
                  style={{
                    background: "#ececec",
                    border: "none",
                    borderRadius: 6,
                    padding: "4px 14px",
                    marginRight: 6,
                    color: "#1a3867",
                    fontWeight: 500,
                    cursor: "pointer"
                  }}
                >
                  Ver
                </button>
                <button
                  onClick={() => excluirCliente(i)}
                  style={{
                    background: "#fdeaea",
                    border: "none",
                    borderRadius: 6,
                    padding: "4px 14px",
                    color: "#be3434",
                    fontWeight: 500,
                    cursor: "pointer"
                  }}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL DE VISUALIZAÇÃO */}
      {visualizando &&
        <ModalCliente
          cliente={visualizando}
          onClose={() => setVisualizando(null)}
        />
      }
    </div>
  );
}

const thtd: React.CSSProperties = {
  padding: 8,
  fontSize: 15,
  border: "1px solid #f2f2f2",
  textAlign: "left"
};
