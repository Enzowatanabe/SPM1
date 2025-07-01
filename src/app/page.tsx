'use client';

import './styles.css'; // ou './globals.css'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaFileAlt, FaCalendarAlt, FaMoneyBill, FaUserFriends, FaUserTie, FaCog } from "react-icons/fa"; // FaUserTie para Funcionários
import React, { useEffect, useState } from "react";

type Conta = {
  id: number;
  conta: string;
  descricao: string;
  valor: string;
  vencimento: string;
  dataPagamento: string;
  status: 'A PAGAR' | 'PAGA' | 'VENCIDA';
};

export default function Dashboard() {
  const pathname = usePathname();

  const [vencidas, setVencidas] = useState<Conta[]>([]);
  const [hoje, setHoje] = useState<Conta[]>([]);

  useEffect(() => {
    const contas: Conta[] = JSON.parse(localStorage.getItem("contasapagar") || "[]");
    const hojeStr = new Date().toISOString().slice(0, 10);

    setVencidas(contas.filter(
      c => (c.status === "A PAGAR" || c.status === "VENCIDA") && c.vencimento < hojeStr
    ));
    setHoje(contas.filter(
      c => c.status === "A PAGAR" && c.vencimento === hojeStr
    ));
  }, []);

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
          <Link href="/financeiro" className={`menu-btn${pathname.startsWith("/financeiro") ? " active" : ""}`}>
            <FaMoneyBill /> Financeiro
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
        {(hoje.length > 0 || vencidas.length > 0) && (
          <div style={{ marginBottom: 20 }}>
            {hoje.length > 0 && (
              <div style={{
                background: "#fffbe7",
                color: "#654400",
                padding: 16,
                borderRadius: 7,
                marginBottom: 8,
                border: "1px solid #f5e1a7"
              }}>
                <b>Contas para pagar hoje:</b>
                <ul style={{ margin: "8px 0 0 0", paddingLeft: 24 }}>
                  {hoje.map(c => (
                    <li key={c.id}>
                      {c.conta} – {c.descricao} (R$ {Number(c.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {vencidas.length > 0 && (
              <div style={{
                background: "#ffe4e6",
                color: "#b4002e",
                padding: 16,
                borderRadius: 7,
                marginBottom: 8,
                border: "1px solid #fac3c8"
              }}>
                <b>Contas vencidas:</b>
                <ul style={{ margin: "8px 0 0 0", paddingLeft: 24 }}>
                  {vencidas.map(c => (
                    <li key={c.id}>
                      {c.conta} – {c.descricao} (R$ {Number(c.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Seus cards de resumo */}
        <div className="cards-row">
          <div className="card">
            <div className="card-label">Saldo Atual</div>
            <div className="card-value">R$ 50.000,00</div>
          </div>
          <div className="card">
            <div className="card-label">Entradas do Mês</div>
            <div className="card-value">R$ 25.000,00</div>
          </div>
          <div className="card">
            <div className="card-label">Saídas do Mês</div>
            <div className="card-value">R$ 20.000,00</div>
          </div>
        </div>
        <div className="cards-row">
          <div className="card">
            <div className="card-label">Orçamentos Abertos</div>
            <div className="card-number">5</div>
          </div>
          <div className="card">
            <div className="card-label">Contas a Pagar</div>
            <div className="card-number">5</div>
          </div>
        </div>
        <div className="buttons-row">
          <button className="btn">Ver Agenda</button>
          <button className="btn">Ver Orçamentos</button>
          <button className="btn">Ver Financeiro</button>
        </div>
      </main>
    </div>
  );
}
