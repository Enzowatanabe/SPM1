'use client';

import React, { useState, useEffect } from "react";

type Pagamento = {
  data: string;
  valor: string;
  observacao: string;
};

type Funcionario = {
  id: number;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  dataContratacao: string;
  status: string;
  observacoes: string;
  pagamentos: Pagamento[];
};

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [form, setForm] = useState<Omit<Funcionario, "id" | "pagamentos">>({
    nome: "",
    cargo: "",
    email: "",
    telefone: "",
    cpf: "",
    rg: "",
    dataNascimento: "",
    dataContratacao: "",
    status: "Ativo",
    observacoes: ""
  });

  // Controle do formulário de pagamento
  const [pagamento, setPagamento] = useState<{ [id: number]: Pagamento }>({});
  const [registrando, setRegistrando] = useState<{ [id: number]: boolean }>({});

  // Carregar funcionários apenas 1x ao montar o componente
  useEffect(() => {
    const dados = localStorage.getItem("funcionarios");
    if (dados) setFuncionarios(JSON.parse(dados));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const novoFuncionario: Funcionario = {
      ...form,
      id: Date.now(),
      pagamentos: []
    };
    const novos = [...funcionarios, novoFuncionario];
    setFuncionarios(novos);
    localStorage.setItem("funcionarios", JSON.stringify(novos));
    setForm({
      nome: "",
      cargo: "",
      email: "",
      telefone: "",
      cpf: "",
      rg: "",
      dataNascimento: "",
      dataContratacao: "",
      status: "Ativo",
      observacoes: ""
    });
  }

  function iniciarRegistroPagamento(id: number) {
    setRegistrando(prev => ({ ...prev, [id]: true }));
    setPagamento(prev => ({
      ...prev,
      [id]: { data: new Date().toISOString().slice(0, 10), valor: "", observacao: "" }
    }));
  }

  function cancelarRegistroPagamento(id: number) {
    setRegistrando(prev => ({ ...prev, [id]: false }));
  }

  function alterarPagamento(id: number, campo: keyof Pagamento, valor: string) {
    setPagamento(prev => ({
      ...prev,
      [id]: { ...prev[id], [campo]: valor }
    }));
  }

  function registrarPagamento(id: number) {
    const pag = pagamento[id];
    if (!pag.valor || !pag.data) {
      alert("Preencha data e valor!");
      return;
    }

    // Cópia profunda para garantir atualização
    const novos = funcionarios.map(f =>
      f.id === id
        ? {
            ...f,
            pagamentos: [...(f.pagamentos || []), pag]
          }
        : f
    );
    setFuncionarios(novos);
    localStorage.setItem("funcionarios", JSON.stringify(novos)); // << Salva exatamente o array novo!

    // Lança no fluxo de caixa
    const lancamentos = JSON.parse(localStorage.getItem("lancamentos") || "[]");
    const func = novos.find(f => f.id === id);
    lancamentos.push({
      id: Date.now(),
      transacao: "despesa",
      categoria: "Pagamento Funcionário",
      descricao: `${func?.nome} (${func?.cargo})${pag.observacao ? " - " + pag.observacao : ""}`,
      data: pag.data,
      valor: Number(pag.valor),
      formaPagamento: "débito",
      banco: "Outros"
    });
    localStorage.setItem("lancamentos", JSON.stringify(lancamentos));

    setRegistrando(prev => ({ ...prev, [id]: false }));
    setPagamento(prev => ({ ...prev, [id]: { data: "", valor: "", observacao: "" } }));
  }

  // ---- Estilos ----
  const inputStyle: React.CSSProperties = {
    border: "1px solid #ececec",
    borderRadius: 6,
    padding: "8px 12px",
    fontSize: 16,
    marginBottom: 6,
    minWidth: 130
  };
  const thtd: React.CSSProperties = {
    padding: 8,
    fontSize: 15,
    border: "1px solid #f2f2f2",
    textAlign: "left"
  };

  return (
    <div style={{ maxWidth: 1100, margin: "32px auto", background: "#fff", borderRadius: 10, boxShadow: "0 2px 14px #0001", padding: 32 }}>
      <h1 style={{ fontSize: 28, marginBottom: 28, fontWeight: 700 }}>Funcionários</h1>

      {/* FORMULÁRIO */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 40, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <input required name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} style={inputStyle} />
        <input required name="cargo" placeholder="Cargo" value={form.cargo} onChange={handleChange} style={inputStyle} />
        <input name="email" placeholder="E-mail" value={form.email} onChange={handleChange} style={inputStyle} />
        <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} style={inputStyle} />
        <input name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} style={inputStyle} />
        <input name="rg" placeholder="RG" value={form.rg} onChange={handleChange} style={inputStyle} />
        <input name="dataNascimento" type="date" placeholder="Data de Nascimento" value={form.dataNascimento} onChange={handleChange} style={inputStyle} />
        <input name="dataContratacao" type="date" placeholder="Data de Contratação" value={form.dataContratacao} onChange={handleChange} style={inputStyle} />
        <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
          <option value="Ativo">Ativo</option>
          <option value="Desligado">Desligado</option>
        </select>
        <input name="observacoes" placeholder="Observações" value={form.observacoes} onChange={handleChange} style={inputStyle} />
        <button type="submit" style={{ ...inputStyle, background: "#bb8927", color: "#fff", cursor: "pointer", fontWeight: 600, minWidth: 130 }}>Cadastrar</button>
      </form>

      {/* LISTA DE FUNCIONÁRIOS */}
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fcfcfc" }}>
        <thead>
          <tr style={{ background: "#f3f3f3" }}>
            <th style={thtd}>#</th>
            <th style={thtd}>Nome</th>
            <th style={thtd}>Cargo</th>
            <th style={thtd}>E-mail</th>
            <th style={thtd}>Telefone</th>
            <th style={thtd}>CPF</th>
            <th style={thtd}>RG</th>
            <th style={thtd}>Nascimento</th>
            <th style={thtd}>Contratação</th>
            <th style={thtd}>Status</th>
            <th style={thtd}>Obs.</th>
            <th style={thtd}></th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.map((f, i) => (
            <React.Fragment key={f.id}>
              <tr>
                <td style={thtd}>{i + 1}</td>
                <td style={thtd}>{f.nome}</td>
                <td style={thtd}>{f.cargo}</td>
                <td style={thtd}>{f.email}</td>
                <td style={thtd}>{f.telefone}</td>
                <td style={thtd}>{f.cpf}</td>
                <td style={thtd}>{f.rg}</td>
                <td style={thtd}>{f.dataNascimento && new Date(f.dataNascimento).toLocaleDateString('pt-BR')}</td>
                <td style={thtd}>{f.dataContratacao && new Date(f.dataContratacao).toLocaleDateString('pt-BR')}</td>
                <td style={thtd}>{f.status}</td>
                <td style={thtd}>{f.observacoes}</td>
                <td style={thtd}>
                  {registrando[f.id] ? (
                    <span>
                      <input
                        type="date"
                        value={pagamento[f.id]?.data || ""}
                        onChange={e => alterarPagamento(f.id, "data", e.target.value)}
                        style={{ ...inputStyle, width: 120, marginBottom: 2 }}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Valor"
                        value={pagamento[f.id]?.valor || ""}
                        onChange={e => alterarPagamento(f.id, "valor", e.target.value)}
                        style={{ ...inputStyle, width: 90, marginBottom: 2 }}
                        required
                      />
                      <input
                        placeholder="Obs."
                        value={pagamento[f.id]?.observacao || ""}
                        onChange={e => alterarPagamento(f.id, "observacao", e.target.value)}
                        style={{ ...inputStyle, width: 110, marginBottom: 2 }}
                      />
                      <button
                        onClick={() => registrarPagamento(f.id)}
                        style={{ ...inputStyle, minWidth: 80, background: "#3182ce", color: "#fff", fontWeight: 500 }}
                        type="button"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => cancelarRegistroPagamento(f.id)}
                        style={{ ...inputStyle, minWidth: 80, background: "#eee", color: "#222" }}
                        type="button"
                      >
                        Cancelar
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => iniciarRegistroPagamento(f.id)}
                      style={{ ...inputStyle, minWidth: 80, background: "#eee", color: "#333" }}
                      type="button"
                    >
                      Registrar pagamento
                    </button>
                  )}
                </td>
              </tr>
              {f.pagamentos && f.pagamentos.length > 0 && (
                <tr>
                  <td colSpan={12} style={{ background: "#fcf4e7", border: "1px solid #f6e1b7", fontSize: 15 }}>
                    <b>Pagamentos:</b>
                    <ul style={{ margin: 8, paddingLeft: 25 }}>
                      {f.pagamentos.map((p, idx) => (
                        <li key={idx}>
                          Data: {p.data ? new Date(p.data).toLocaleDateString('pt-BR') : ""} | Valor: R$ {Number(p.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} {p.observacao && <>| {p.observacao}</>}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
