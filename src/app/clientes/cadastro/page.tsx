'use client';

import React, { useState } from "react";

type Parcela = {
  valor: string;
  data: string;
};

export default function CadastroCliente() {
  const [form, setForm] = useState({
    nome: "",
    celular: "",
    email: "",
    cpf: "",
    rg: "",
    enderecoEntrega: "",
    numeroEntrega: "",
    bairroEntrega: "",
    enderecoResidencial: "",
    numeroResidencial: "",
    bairroResidencial: "",
    valorTotal: "",
    valorSinal: "",
    dataSinal: "",
    parcelas: 1,
    descricao: "",
  });

  const [parcelas, setParcelas] = useState<Parcela[]>([{ valor: "", data: "" }]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleParcelasChange(e: React.ChangeEvent<HTMLInputElement>) {
    const qtd = Math.max(1, Math.min(24, Number(e.target.value) || 1));
    setForm({ ...form, parcelas: qtd });
    setParcelas(old =>
      Array(qtd)
        .fill(null)
        .map((_, i) => old[i] || { valor: "", data: "" })
    );
  }

  function handleParcelaChange(idx: number, campo: "valor" | "data", value: string) {
    setParcelas(prev =>
      prev.map((p, i) => (i === idx ? { ...p, [campo]: value } : p))
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cliente = { ...form, parcelas };
    const clientes = JSON.parse(localStorage.getItem("clientes") || "[]");
    localStorage.setItem("clientes", JSON.stringify([...clientes, cliente]));

    // --- LANÇAR NO FINANCEIRO ---
    // Lançar SINAL
    let novosLancamentos = [];
    if (form.valorSinal && form.dataSinal) {
      novosLancamentos.push({
        id: Date.now(),
        transacao: 'receita',
        categoria: form.nome,
        descricao: `Sinal - ${form.descricao}`,
        data: form.dataSinal,
        valor: Number(form.valorSinal),
        formaPagamento: 'pix',
        banco: 'Santander',
      });
    }

    // Lançar PARCELAS
    parcelas.forEach((parcela, i) => {
      if (parcela.valor && parcela.data) {
        novosLancamentos.push({
          id: Date.now() + (i+1),
          transacao: 'receita',
          categoria: form.nome,
          descricao: `Parcela ${i+1} - ${form.descricao}`,
          data: parcela.data,
          valor: Number(parcela.valor),
          formaPagamento: 'pix',
          banco: 'Santander',
        });
      }
    });

    // Salvar no localStorage de lançamentos/financeiro
    if (novosLancamentos.length > 0) {
      const lancamentosAntigos = JSON.parse(localStorage.getItem('lancamentos') || "[]");
      localStorage.setItem('lancamentos', JSON.stringify([...lancamentosAntigos, ...novosLancamentos]));
    }

    alert("Cliente cadastrado!");
    setForm({
      nome: "",
      celular: "",
      email: "",
      cpf: "",
      rg: "",
      enderecoEntrega: "",
      numeroEntrega: "",
      bairroEntrega: "",
      enderecoResidencial: "",
      numeroResidencial: "",
      bairroResidencial: "",
      valorTotal: "",
      valorSinal: "",
      dataSinal: "",
      parcelas: 1,
      descricao: "",
    });
    setParcelas([{ valor: "", data: "" }]);
  }

  // === ESTILOS INLINE - CUSTOM PADRÃO SISTEMA ===
  const box = { background: "#faf8f4", borderRadius: 9, padding: 20, marginBottom: 18, border: "1px solid #eee", boxShadow: "0 2px 10px #0001" };
  const sectionTitle = { fontWeight: 700, fontSize: 19, color: "#bb8927", marginBottom: 14, marginTop: 0 };
  const label = { fontWeight: 500, color: "#444", marginBottom: 3, display: "block" };
  const input = {
    border: "1px solid #e2e2e2",
    borderRadius: 7,
    padding: "9px 12px",
    fontSize: 16,
    background: "#fff",
    marginBottom: 12,
    width: "100%",
    transition: "border 0.18s"
  } as React.CSSProperties;

  return (
    <div style={{
      maxWidth: 700,
      margin: "40px auto",
      background: "#fff",
      borderRadius: 13,
      boxShadow: "0 2px 18px #0002",
      padding: 32,
      fontFamily: "inherit"
    }}>
      <h1 style={{ fontSize: 27, fontWeight: 700, marginBottom: 10, color: "#bb8927" }}>Cadastro de Cliente</h1>
      <form onSubmit={handleSubmit} autoComplete="off">
        {/* Dados Pessoais */}
        <div style={box}>
          <p style={sectionTitle}>Dados do Cliente</p>
          <label style={label}>Nome</label>
          <input required name="nome" value={form.nome} onChange={handleChange} style={input} />

          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={label}>Celular</label>
              <input required name="celular" value={form.celular} onChange={handleChange} style={input} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>Email</label>
              <input name="email" value={form.email} onChange={handleChange} style={input} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={label}>CPF</label>
              <input name="cpf" value={form.cpf} onChange={handleChange} style={input} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>RG</label>
              <input name="rg" value={form.rg} onChange={handleChange} style={input} />
            </div>
          </div>
        </div>

        {/* Endereço de Entrega */}
        <div style={box}>
          <p style={sectionTitle}>Endereço de Entrega</p>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 2 }}>
              <label style={label}>Endereço</label>
              <input name="enderecoEntrega" value={form.enderecoEntrega} onChange={handleChange} style={input} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>Número</label>
              <input name="numeroEntrega" value={form.numeroEntrega} onChange={handleChange} style={input} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>Bairro</label>
              <input name="bairroEntrega" value={form.bairroEntrega} onChange={handleChange} style={input} />
            </div>
          </div>
        </div>

        {/* Endereço Residencial */}
        <div style={box}>
          <p style={sectionTitle}>Endereço Residencial</p>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 2 }}>
              <label style={label}>Endereço</label>
              <input name="enderecoResidencial" value={form.enderecoResidencial} onChange={handleChange} style={input} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>Número</label>
              <input name="numeroResidencial" value={form.numeroResidencial} onChange={handleChange} style={input} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>Bairro</label>
              <input name="bairroResidencial" value={form.bairroResidencial} onChange={handleChange} style={input} />
            </div>
          </div>
        </div>

        {/* Financeiro */}
        <div style={box}>
          <p style={sectionTitle}>Financeiro</p>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={label}>Valor total da venda</label>
              <input name="valorTotal" value={form.valorTotal} onChange={handleChange} style={input} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>Valor do sinal</label>
              <input name="valorSinal" value={form.valorSinal} onChange={handleChange} style={input} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>Data do sinal</label>
              <input name="dataSinal" type="date" value={form.dataSinal} onChange={handleChange} style={input} />
            </div>
          </div>
          <div>
            <label style={label}>Parcelas</label>
            <input
              type="number"
              min={1}
              max={24}
              value={form.parcelas}
              style={{ ...input, width: 85, display: "inline-block" }}
              onChange={handleParcelasChange}
            />
          </div>
          {/* Parcelas Dinâmicas */}
          {parcelas.map((parcela, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
              <span style={{ minWidth: 74, fontWeight: 500, color: "#aa8900" }}>Parcela {idx + 1}:</span>
              <input
                placeholder="Valor"
                type="number"
                value={parcela.valor}
                min={0}
                style={{ ...input, width: 110, marginBottom: 0 }}
                onChange={e => handleParcelaChange(idx, "valor", e.target.value)}
                required={form.parcelas > 1}
              />
              <input
                type="date"
                value={parcela.data}
                style={{ ...input, width: 150, marginBottom: 0 }}
                onChange={e => handleParcelaChange(idx, "data", e.target.value)}
                required={form.parcelas > 1}
              />
            </div>
          ))}
        </div>

        {/* Descrição do Pedido */}
        <div style={box}>
          <label style={label}>Descrição do pedido</label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            rows={2}
            style={{ ...input, minHeight: 48, resize: "vertical" }}
          />
        </div>

        <button
          type="submit"
          style={{
            background: "#bb8927",
            color: "#fff",
            fontWeight: 600,
            border: "none",
            borderRadius: 7,
            padding: "12px 0",
            marginTop: 14,
            fontSize: 17,
            width: "100%",
            boxShadow: "0 1px 8px #0001",
            cursor: "pointer"
          }}>
          Salvar Cliente
        </button>
      </form>
    </div>
  );
}
