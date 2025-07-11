'use client';

import './styles.css'; // ou './globals.css'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaFileAlt, FaCalendarAlt, FaMoneyBill, FaUserFriends, FaUserTie, FaCog, FaExclamationTriangle, FaClock } from "react-icons/fa"; // Adicionando ícones para alertas
import React, { useEffect, useState } from "react";
import NotificationBadge from './components/NotificationBadge';

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

export default function Dashboard() {
  const pathname = usePathname() || '';

  const [vencidas, setVencidas] = useState<ContaAPagar[]>([]);
  const [hoje, setHoje] = useState<ContaAPagar[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    contasVencidas: 0,
    contasHoje: 0,
    totalContasAPagar: 0,
    valorContasVencidas: '0',
    valorContasHoje: '0'
  });

  // Estados para cards financeiros
  const [saldoAtual, setSaldoAtual] = useState<number | null>(null);
  const [entradasMes, setEntradasMes] = useState<number | null>(null);
  const [saidasMes, setSaidasMes] = useState<number | null>(null);
  const [aReceberMes, setAReceberMes] = useState<number | null>(null);
  // Novos estados para saídas do mês
  const [saidasJaRealizadas, setSaidasJaRealizadas] = useState<number | null>(null);
  const [saidasFuturas, setSaidasFuturas] = useState<number | null>(null);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        // Buscar contas vencidas
        const responseVencidas = await fetch('/api/contasapagar/vencidas');
        if (responseVencidas.ok) {
          const dataVencidas = await responseVencidas.json();
          setVencidas(dataVencidas.vencidas || []);
          setHoje(dataVencidas.hoje || []);
        }

        // Buscar estatísticas
        const responseStats = await fetch('/api/contasapagar/stats');
        if (responseStats.ok) {
          const dataStats = await responseStats.json();
          setStats(dataStats);
        }

        // Buscar lançamentos e contas pagas para os cards financeiros
        const [resLanc, resContas] = await Promise.all([
          fetch('/api/lancamentos'),
          fetch('/api/contasapagar')
        ]);
        const lancs: Lancamento[] = resLanc.ok ? await resLanc.json() : [];
        const contas: ContaAPagar[] = resContas.ok ? await resContas.json() : [];

        // Unir lançamentos e contas pagas igual ao fluxo de caixa
        const itens = [
          ...lancs.map(l => ({
            id: 'L' + l.id,
            transacao: l.transacao,
            valor: l.valor,
            data: l.data,
          })),
          ...contas.filter(c => c.status === 'PAGA' && c.dataPagamento).map(c => ({
            id: 'C' + c.id,
            transacao: 'despesa',
            valor: Number(c.valor),
            data: c.dataPagamento,
          }))
        ];

        // Datas
        const hojeStr = new Date().toISOString().slice(0, 10);
        const mesAtual = hojeStr.slice(0, 7); // yyyy-mm

        // Saldo acumulado até hoje
        const saldo = itens
          .filter(item => item.data <= hojeStr)
          .reduce((acc, cur) => cur.transacao === 'receita' ? acc + cur.valor : acc - cur.valor, 0);
        setSaldoAtual(saldo);

        // Entradas do mês (receita)
        const entradas = itens
          .filter(item => item.transacao === 'receita' && item.data.slice(0, 7) === mesAtual && item.data <= hojeStr)
          .reduce((acc, cur) => acc + cur.valor, 0);
        setEntradasMes(entradas);

        // Saídas do mês (despesa até hoje)
        const saidas = itens
          .filter(item => item.transacao === 'despesa' && item.data.slice(0, 7) === mesAtual && item.data <= hojeStr)
          .reduce((acc, cur) => acc + cur.valor, 0);
        setSaidasMes(saidas);

        // Saldo a receber no mês (receitas do mês atual com data futura)
        const aReceber = itens
          .filter(item => item.transacao === 'receita' && item.data.slice(0, 7) === mesAtual && item.data > hojeStr)
          .reduce((acc, cur) => acc + cur.valor, 0);
        setAReceberMes(aReceber);

        // NOVO: Saídas já realizadas no mês (até hoje)
        const saidasRealizadas = itens
          .filter(item => item.transacao === 'despesa' && item.data.slice(0, 7) === mesAtual && item.data <= hojeStr)
          .reduce((acc, cur) => acc + cur.valor, 0);
        setSaidasJaRealizadas(saidasRealizadas);

        // NOVO: Saídas futuras no mês (após hoje, mas ainda no mês)
        // Inclui lançamentos futuros, contas pagas futuras e contas a pagar futuras
        // 1. Lançamentos e contas pagas já estão em 'itens'
        const saidasFutLancEContasPagas = itens
          .filter(item => {
            if (item.transacao !== 'despesa') return false;
            if (item.data.slice(0, 7) !== mesAtual) return false;
            return item.data > hojeStr;
          })
          .reduce((acc, cur) => acc + cur.valor, 0);
        // 2. Contas a pagar (status 'A PAGAR') com vencimento futuro ainda neste mês
        const contasAPagarFuturas = contas
          .filter(c => c.status === 'A PAGAR' && c.vencimento && c.vencimento.slice(0, 7) === mesAtual && c.vencimento > hojeStr)
          .reduce((acc, cur) => acc + Number(cur.valor), 0);
        setSaidasFuturas(saidasFutLancEContasPagas + contasAPagarFuturas);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    buscarDados();
  }, []);

  // Calcular dias de atraso para cada conta vencida
  const calcularDiasAtraso = (dataVencimento: string) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = hoje.getTime() - vencimento.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Total de alertas (contas vencidas + contas que vencem hoje)
  const totalAlertas = vencidas.length + hoje.length;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">
          <img src="/logo-marcenaria.jpg" alt="Logo Ponto Móvel" width="160" />
          <span>PONTO MÓVEL<br />MARCENARIA</span>
        </div>
        <nav className="menu">
          <Link href="/" className={`menu-btn${pathname === "/" ? " active" : ""}`}>
            <FaHome /> Dashboard
          </Link>
          <Link href="/orcamentos" className={`menu-btn${pathname.startsWith("/orcamentos") ? " active" : ""}`}>
            <FaFileAlt /> Orçamentos
          </Link>
          <Link href="/financeiro" className={`menu-btn${pathname.startsWith("/financeiro") ? " active" : ""}`} style={{ position: 'relative' }}>
            <FaMoneyBill /> Financeiro
            <NotificationBadge count={totalAlertas} />
          </Link>
          <Link href="/agenda" className={`menu-btn${pathname.startsWith("/agenda") ? " active" : ""}`}>
            <FaCalendarAlt /> Agenda
          </Link>
          <Link href="/documentos" className={`menu-btn${pathname.startsWith("/documentos") ? " active" : ""}`}>
            <FaFileAlt /> Documentos
          </Link>
          <Link href="/clientes" className={`menu-btn${pathname.startsWith("/clientes") ? " active" : ""}`}>
            <FaUserFriends /> Clientes e Fornecedores
          </Link>
          {/* Funcionários */}
          <Link href="/funcionarios" className={`menu-btn${pathname.startsWith("/funcionarios") ? " active" : ""}`}>
            <FaUserTie /> Funcionários
          </Link>
        </nav>
        <div className="menu-bottom">
          <FaCog /> Config
        </div>
      </aside>
      <main className="main-content">
        <h1 style={{ fontSize: 38, fontWeight: 600, marginBottom: 32 }}>Dashboard</h1>

        {/* ALERTAS DE CONTAS */}
        {!loading && (hoje.length > 0 || vencidas.length > 0) && (
          <div style={{ marginBottom: 20 }}>
            {hoje.length > 0 && (
              <div style={{
                background: "#fffbe7",
                color: "#654400",
                padding: 16,
                borderRadius: 7,
                marginBottom: 8,
                border: "1px solid #f5e1a7",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <FaClock style={{ fontSize: "18px" }} />
                <div>
                  <b>Contas para pagar hoje ({hoje.length}):</b>
                  <ul style={{ margin: "8px 0 0 0", paddingLeft: 24 }}>
                    {hoje.map(c => (
                      <li key={c.id}>
                        {c.conta} – {c.descricao} (R$ {Number(c.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {vencidas.length > 0 && (
              <div style={{
                background: "#ffe4e6",
                color: "#b4002e",
                padding: 16,
                borderRadius: 7,
                marginBottom: 8,
                border: "1px solid #fac3c8",
                display: "flex",
                alignItems: "flex-start",
                gap: "8px"
              }}>
                <FaExclamationTriangle style={{ fontSize: "18px", marginTop: "2px" }} />
                <div>
                  <b>Contas vencidas ({vencidas.length}):</b>
                  <ul style={{ margin: "8px 0 0 0", paddingLeft: 24 }}>
                    {vencidas.map(c => {
                      const diasAtraso = calcularDiasAtraso(c.vencimento);
                      return (
                        <li key={c.id}>
                          {c.conta} – {c.descricao} (R$ {Number(c.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                          <span style={{ 
                            background: "#b4002e", 
                            color: "white", 
                            padding: "2px 6px", 
                            borderRadius: "4px", 
                            fontSize: "12px", 
                            marginLeft: "8px" 
                          }}>
                            {diasAtraso} {diasAtraso === 1 ? 'dia' : 'dias'} atrasado
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Seus cards de resumo */}
        <div className="cards-row">
          <div className="card">
            <div className="card-label">Saldo Atual</div>
            <div className="card-value">
              {saldoAtual === null ? '...' : 'R$ ' + saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="card">
            <div className="card-label">Entradas do Mês</div>
            <div className="card-value">
              {entradasMes === null ? '...' : 'R$ ' + entradasMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="card">
            <div className="card-label">Saídas do Mês</div>
            <div className="card-value">
              {saidasMes === null ? '...' : 'R$ ' + saidasMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
         <div className="card">
           <div className="card-label">Saldo a Receber no Mês</div>
           <div className="card-value">
             {aReceberMes === null ? '...' : 'R$ ' + aReceberMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
           </div>
         </div>
        </div>
        <div className="cards-row">
         <div className="card" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
           <div className="card-label">Saídas previstas até o fim do mês</div>
           <div className="card-value" style={{ color: '#b91c1c', fontSize: 28, fontWeight: 700 }}>
             {saidasFuturas === null ? '...' : 'R$ ' + saidasFuturas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
           </div>
         </div>
          <div className="card">
            <div className="card-label">Contas a Pagar</div>
            <div className="card-number">{stats.totalContasAPagar}</div>
          </div>
          <div className="card" style={{ 
            background: vencidas.length > 0 ? '#fef2f2' : '#f0f9ff',
            border: vencidas.length > 0 ? '1px solid #fecaca' : '1px solid #bae6fd'
          }}>
            <div className="card-label" style={{ color: vencidas.length > 0 ? '#dc2626' : '#0369a1' }}>
              {vencidas.length > 0 ? 'Contas Vencidas' : 'Contas em Dia'}
            </div>
            <div className="card-number" style={{ color: vencidas.length > 0 ? '#dc2626' : '#0369a1' }}>
              {vencidas.length}
            </div>
            {vencidas.length > 0 && (
              <div style={{ 
                fontSize: '12px', 
                color: '#dc2626', 
                marginTop: '4px',
                fontWeight: '500'
              }}>
                R$ {Number(stats.valorContasVencidas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            )}
          </div>
          {hoje.length > 0 && (
            <div className="card" style={{ 
              background: '#fffbe7',
              border: '1px solid #f5e1a7'
            }}>
              <div className="card-label" style={{ color: '#654400' }}>
                Vencem Hoje
              </div>
              <div className="card-number" style={{ color: '#654400' }}>
                {hoje.length}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#654400', 
                marginTop: '4px',
                fontWeight: '500'
              }}>
                R$ {Number(stats.valorContasHoje).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          )}
        </div>
        <div className="buttons-row">
          <button className="btn">Ver Agenda</button>
          <button className="btn">Ver Orçamentos</button>
          <button className="btn">Ver Financeiro</button>
          {vencidas.length > 0 && (
            <Link href="/financeiro/contasapagar" className="btn" style={{ 
              background: '#dc2626', 
              color: 'white',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FaExclamationTriangle />
              Ver Contas Vencidas
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
