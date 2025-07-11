// src/utils/gerarLancamentosDoCliente.ts

export async function gerarLancamentosDoCliente(cliente: any) {
  // Remove lançamentos antigos desse cliente antes de criar novos (usando categoria=nome)
  // Agora, removendo via API não implementado, apenas adiciona novos via API

  let novosLancamentos = [];

  // Sinal
  if (cliente.valorSinal && cliente.dataSinal) {
    novosLancamentos.push({
      transacao: "receita",
      categoria: cliente.nome,
      descricao: "Sinal de " + cliente.nome,
      data: cliente.dataSinal,
      valor: Number(cliente.valorSinal),
      formaPagamento: cliente.formaPagamentoSinal || "pix",
      banco: cliente.bancoSinal || "Santander",
    });
  }

  // Parcelas
  for (let i = 1; i <= 6; i++) {
    const valor = cliente[`valorParcela${i}`];
    const data = cliente[`dataParcela${i}`];
    if (valor && data) {
      novosLancamentos.push({
        transacao: "receita",
        categoria: cliente.nome,
        descricao: `Parcela ${i} - ${cliente.nome}`,
        data,
        valor: Number(valor),
        formaPagamento: cliente[`formaPagamentoParcela${i}`] || "pix",
        banco: cliente[`bancoParcela${i}`] || "Santander",
      });
    }
  }

  // Salva via API
  for (const lanc of novosLancamentos) {
    await fetch('/api/lancamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lanc),
    });
  }
}
