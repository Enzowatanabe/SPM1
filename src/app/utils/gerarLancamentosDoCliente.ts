// src/utils/gerarLancamentosDoCliente.ts

export function gerarLancamentosDoCliente(cliente: any) {
  // Remove lançamentos antigos desse cliente antes de criar novos (usando categoria=nome)
  let lancamentosSalvos = JSON.parse(localStorage.getItem('lancamentos') || '[]');
  lancamentosSalvos = lancamentosSalvos.filter(
    (l: any) => l.categoria !== cliente.nome || !l.descricao.startsWith("Sinal") && !l.descricao.startsWith("Parcela")
  );

  let novosLancamentos = [];

  // Sinal
  if (cliente.valorSinal && cliente.dataSinal) {
    novosLancamentos.push({
      id: Date.now() + Math.floor(Math.random() * 10000),
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
        id: Date.now() + i * 1000 + Math.floor(Math.random() * 1000),
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

  const atualizados = [...lancamentosSalvos, ...novosLancamentos];
  localStorage.setItem("lancamentos", JSON.stringify(atualizados));
}
