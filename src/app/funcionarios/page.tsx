'use client';

import React, { useState, useEffect } from "react";
// Remover importação do Dexie/db

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
  dataContratacao: string;
  status: 'Ativo' | 'Desligado';
  observacoes: string;
  valorDia: number;
  pagamentos?: Pagamento[];
};

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [form, setForm] = useState({
    nome: "",
    cargo: "",
    email: "",
    telefone: "",
    cpf: "",
    rg: "",
    dataContratacao: "",
    status: "Ativo",
    observacoes: "",
    valorDia: 0
  });

  // Controle do formulário de pagamento
  const [pagamento, setPagamento] = useState<{ [id: number]: Pagamento }>({});
  const [registrando, setRegistrando] = useState<{ [id: number]: boolean }>({});

  // Adicionar estado para edição
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Funcionario>>({});

  // Buscar funcionários da API
  async function carregarFuncionarios() {
    try {
      const res = await fetch('/api/funcionarios');
      const data = await res.json();
      setFuncionarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    }
  }

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "valorDia" ? Number(value) : value
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/funcionarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form })
    });
    setForm({
      nome: "",
      cargo: "",
      email: "",
      telefone: "",
      cpf: "",
      rg: "",
      dataContratacao: "",
      status: "Ativo",
      observacoes: "",
      valorDia: 0
    });
    carregarFuncionarios();
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

  async function registrarPagamento(id: number) {
    const pag = pagamento[id];
    if (!pag.valor || !pag.data) {
      alert("Preencha data e valor!");
      return;
    }

    const funcionario = funcionarios.find(f => f.id === id);
    if (!funcionario) return;
    const novosPagamentos = [...(funcionario.pagamentos || []), pag];
    await fetch(`/api/funcionarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pagamentos: novosPagamentos })
    });
    carregarFuncionarios();

    // Lança no fluxo de caixa
    const func = novosPagamentos.find(p => p.data === pag.data); // Encontra o pagamento recente
    if (func) {
      fetch('/api/lancamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transacao: 'despesa',
          categoria: 'Pagamento Funcionário',
          descricao: `${func.nome} (${func.cargo})${func.observacao ? ' - ' + func.observacao : ''}`,
          data: func.data,
          valor: Number(func.valor),
          formaPagamento: 'débito',
          banco: 'Outros',
        }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Lançamento criado com sucesso:', data);
      })
      .catch((error) => {
        console.error('Erro ao criar lançamento:', error);
      });
    }

    setRegistrando(prev => ({ ...prev, [id]: false }));
    setPagamento(prev => ({ ...prev, [id]: { data: "", valor: "", observacao: "" } }));
  }

  // Função para alterar status do funcionário
  async function alterarStatusFuncionario(id: number, novoStatus: 'Ativo' | 'Desligado') {
    await fetch(`/api/funcionarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: novoStatus })
    });
    carregarFuncionarios();
  }

  function iniciarEdicao(f: Funcionario) {
    setEditandoId(f.id);
    setEditForm({ ...f });
  }
  function cancelarEdicao() {
    setEditandoId(null);
    setEditForm({});
  }
  function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: name === "valorDia" ? Number(value) : value
    });
  }
  async function salvarEdicao(id: number) {
    await fetch(`/api/funcionarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    });
    setEditandoId(null);
    setEditForm({});
    carregarFuncionarios();
  }

  async function excluirFuncionario(id: number) {
    if (!window.confirm("Deseja realmente excluir este funcionário?")) return;
    await fetch(`/api/funcionarios/${id}`, { method: 'DELETE' });
    carregarFuncionarios();
  }

  // Atualizar salário diário inline
  async function atualizarSalario(id: number, valor: string) {
    await fetch(`/api/funcionarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valorDia: Number(valor) })
    });
    carregarFuncionarios();
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
        <input name="dataContratacao" type="date" placeholder="Data de Contratação" value={form.dataContratacao} onChange={handleChange} style={inputStyle} />
        <input name="valorDia" type="text" placeholder="Salário diário (R$)" value={form.valorDia} onChange={handleChange} style={inputStyle} />
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
            <th style={thtd}>Contratação</th>
            <th style={thtd}>Salário diário</th>
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
                <td style={thtd}>
                  {editandoId === f.id ? (
                    <input name="nome" value={editForm.nome || ""} onChange={handleEditChange} style={inputStyle} />
                  ) : f.nome}
                </td>
                <td style={thtd}>
                  {editandoId === f.id ? (
                    <input name="cargo" value={editForm.cargo || ""} onChange={handleEditChange} style={inputStyle} />
                  ) : f.cargo}
                </td>
                <td style={thtd}>
                  {editandoId === f.id ? (
                    <input name="email" value={editForm.email || ""} onChange={handleEditChange} style={inputStyle} />
                  ) : f.email}
                </td>
                <td style={thtd}>
                  {editandoId === f.id ? (
                    <input name="telefone" value={editForm.telefone || ""} onChange={handleEditChange} style={inputStyle} />
                  ) : f.telefone}
                </td>
                <td style={thtd}>
                  {editandoId === f.id ? (
                    <input name="cpf" value={editForm.cpf || ""} onChange={handleEditChange} style={inputStyle} />
                  ) : f.cpf}
                </td>
                <td style={thtd}>
                  {editandoId === f.id ? (
                    <input name="rg" value={editForm.rg || ""} onChange={handleEditChange} style={inputStyle} />
                  ) : f.rg}
                </td>
                <td style={thtd}>
                  {editandoId === f.id ? (
                    <input name="dataContratacao" type="date" value={editForm.dataContratacao || ""} onChange={handleEditChange} style={inputStyle} />
                  ) : (f.dataContratacao && new Date(f.dataContratacao).toLocaleDateString('pt-BR'))}
                </td>
                <td style={thtd}>
                  {editandoId === f.id ? (
                    <input name="valorDia" type="text" value={editForm.valorDia || ""} onChange={handleEditChange} style={{ ...inputStyle, width: 90 }} />
                  ) : (
                    <input
                      type="text"
                      value={f.valorDia || ""}
                      onChange={e => atualizarSalario(f.id, e.target.value)}
                      style={{ ...inputStyle, width: 90 }}
                    />
                  )}
                </td>
                <td style={thtd}>
                  {editandoId === f.id ? (
                    <select name="status" value={editForm.status || "Ativo"} onChange={handleEditChange} style={inputStyle}>
                      <option value="Ativo">Ativo</option>
                      <option value="Desligado">Desligado</option>
                    </select>
                  ) : (
                    <select
                      value={f.status}
                      onChange={async e => await alterarStatusFuncionario(f.id, e.target.value as 'Ativo' | 'Desligado')}
                      style={{ ...inputStyle, minWidth: 90, fontWeight: 600, color: f.status === 'Desligado' ? '#b4002e' : '#222' }}
                      disabled
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Desligado">Desligado</option>
                    </select>
                  )}
                </td>
                <td style={thtd}>
                  {editandoId === f.id ? (
                    <input name="observacoes" value={editForm.observacoes || ""} onChange={handleEditChange} style={inputStyle} />
                  ) : f.observacoes}
                </td>
                <td style={thtd}>
                  {editandoId === f.id ? (
                    <>
                      <button onClick={() => salvarEdicao(f.id)} style={{ ...inputStyle, minWidth: 80, background: "#3182ce", color: "#fff", fontWeight: 500 }} type="button">Salvar</button>
                      <button onClick={cancelarEdicao} style={{ ...inputStyle, minWidth: 80, background: "#eee", color: "#222" }} type="button">Cancelar</button>
                    </>
                  ) : (
                    <button onClick={() => iniciarEdicao(f)} style={{ ...inputStyle, minWidth: 80, background: "#eee", color: "#333" }} type="button">Editar</button>
                  )}
                  <button onClick={() => excluirFuncionario(f.id)} style={{ ...inputStyle, minWidth: 80, background: "#e74c3c", color: "#fff" }} type="button">Excluir</button>
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
