'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

// Links principais, menos os que têm dropdown
const links = [
  { href: "/", label: "Dashboard" },
  { href: "/orcamentos", label: "Orçamentos" },
  { href: "/agenda", label: "Agenda" },
  { href: "/documentos", label: "Documentos" },
  { href: "/funcionarios", label: "Funcionários" }, // ADICIONADO AQUI
  { href: "/fluxo-caixa", label: "Fluxo de Caixa" }, // Caso já tenha criado!
];

export default function Navbar() {
  const pathname = usePathname() || '';
  const [dropdownOpen, setDropdownOpen] = useState<false | 'clientes' | 'financeiro'>(false);

  // Fecha dropdown ao clicar fora
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      // Só fecha se clicar fora do dropdown
      if (!(e.target as HTMLElement).closest('.dropdown-menu') && !(e.target as HTMLElement).closest('.dropdown-btn')) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      window.addEventListener("mousedown", handleClick);
      return () => window.removeEventListener("mousedown", handleClick);
    }
  }, [dropdownOpen]);

  return (
    <nav
      style={{
        width: "100%",
        background: "#fff",
        borderBottom: "1px solid #e6e6e6",
        padding: "0 24px",
        height: 56,
        display: "flex",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 20, color: "#be7c25", letterSpacing: 1 }}>
        Ponto Móvel
      </div>
      <div style={{ display: "flex", gap: 18, marginLeft: 40, alignItems: "center" }}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              textDecoration: "none",
              color: pathname === link.href ? "#3182ce" : "#232323",
              fontWeight: pathname === link.href ? 600 : 400,
              background: pathname === link.href ? "#eef6fd" : "transparent",
              borderRadius: 8,
              padding: "7px 16px",
              fontSize: 17,
              transition: "background 0.2s",
            }}
          >
            {link.label}
          </Link>
        ))}

        {/* -------- Dropdown de Clientes -------- */}
        <div
          style={{ position: "relative" }}
          onClick={e => { e.stopPropagation(); setDropdownOpen(dropdownOpen === 'clientes' ? false : 'clientes'); }}
        >
          <button
            className="dropdown-btn"
            style={{
              background: pathname.startsWith('/clientes') ? "#eef6fd" : "transparent",
              color: pathname.startsWith('/clientes') ? "#3182ce" : "#232323",
              border: 'none',
              fontWeight: pathname.startsWith('/clientes') ? 600 : 400,
              fontSize: 17,
              borderRadius: 8,
              padding: "7px 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
            tabIndex={0}
          >
            Clientes
            <span style={{ fontSize: 15, marginLeft: 2 }}>▼</span>
          </button>
          {dropdownOpen === 'clientes' && (
            <div
              className="dropdown-menu"
              style={{
                position: "absolute",
                top: "110%",
                left: 0,
                minWidth: 190,
                background: "#fff",
                border: "1px solid #e6e6e6",
                borderRadius: 7,
                boxShadow: "0 6px 24px rgba(0,0,0,0.10)",
                padding: "6px 0",
                zIndex: 20,
                display: "flex",
                flexDirection: "column"
              }}
            >
              <Link
                href="/clientes"
                style={{
                  padding: "14px 24px",
                  color: pathname === '/clientes' ? "#3182ce" : "#232323",
                  textDecoration: "none",
                  borderRadius: 5,
                  fontWeight: pathname === '/clientes' ? 600 : 400,
                  background: pathname === '/clientes' ? "#eef6fd" : "transparent",
                  fontSize: 16,
                  marginBottom: 2
                }}
                onClick={() => setDropdownOpen(false)}
              >
                Listar Clientes
              </Link>
              <Link
                href="/clientes/cadastro"
                style={{
                  padding: "14px 24px",
                  color: pathname === '/clientes/cadastro' ? "#3182ce" : "#232323",
                  textDecoration: "none",
                  borderRadius: 5,
                  fontWeight: pathname === '/clientes/cadastro' ? 600 : 400,
                  background: pathname === '/clientes/cadastro' ? "#eef6fd" : "transparent",
                  fontSize: 16
                }}
                onClick={() => setDropdownOpen(false)}
              >
                Cadastrar Novo Cliente
              </Link>
            </div>
          )}
        </div>
        {/* -------- Fim do Dropdown de Clientes -------- */}

        {/* -------- Dropdown de Financeiro -------- */}
        <div
          style={{ position: "relative" }}
          onClick={e => { e.stopPropagation(); setDropdownOpen(dropdownOpen === 'financeiro' ? false : 'financeiro'); }}
        >
          <button
            className="dropdown-btn"
            style={{
              background: pathname.startsWith('/financeiro') ? "#eef6fd" : "transparent",
              color: pathname.startsWith('/financeiro') ? "#3182ce" : "#232323",
              border: 'none',
              fontWeight: pathname.startsWith('/financeiro') ? 600 : 400,
              fontSize: 17,
              borderRadius: 8,
              padding: "7px 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
            tabIndex={0}
          >
            Financeiro
            <span style={{ fontSize: 15, marginLeft: 2 }}>▼</span>
          </button>
          {dropdownOpen === 'financeiro' && (
            <div
              className="dropdown-menu"
              style={{
                position: "absolute",
                top: "110%",
                left: 0,
                minWidth: 190,
                background: "#fff",
                border: "1px solid #e6e6e6",
                borderRadius: 7,
                boxShadow: "0 6px 24px rgba(0,0,0,0.10)",
                padding: "6px 0",
                zIndex: 20,
                display: "flex",
                flexDirection: "column"
              }}
            >
              <Link
                href="/financeiro"
                style={{
                  padding: "14px 24px",
                  color: pathname === '/financeiro' ? "#3182ce" : "#232323",
                  textDecoration: "none",
                  borderRadius: 5,
                  fontWeight: pathname === '/financeiro' ? 600 : 400,
                  background: pathname === '/financeiro' ? "#eef6fd" : "transparent",
                  fontSize: 16,
                  marginBottom: 2
                }}
                onClick={() => setDropdownOpen(false)}
              >
                Lançamentos
              </Link>
              <Link
                href="/financeiro/contasapagar"
                style={{
                  padding: "14px 24px",
                  color: pathname === '/financeiro/contasapagar' ? "#3182ce" : "#232323",
                  textDecoration: "none",
                  borderRadius: 5,
                  fontWeight: pathname === '/financeiro/contasapagar' ? 600 : 400,
                  background: pathname === '/financeiro/contasapagar' ? "#eef6fd" : "transparent",
                  fontSize: 16,
                  marginBottom: 2
                }}
                onClick={() => setDropdownOpen(false)}
              >
                Contas a Pagar
              </Link>
              <Link
                href="/financeiro/lucro"
                style={{
                  padding: "14px 24px",
                  color: pathname === '/financeiro/lucro' ? "#3182ce" : "#232323",
                  textDecoration: "none",
                  borderRadius: 5,
                  fontWeight: pathname === '/financeiro/lucro' ? 600 : 400,
                  background: pathname === '/financeiro/lucro' ? "#eef6fd" : "transparent",
                  fontSize: 16
                }}
                onClick={() => setDropdownOpen(false)}
              >
                Análise de Lucro
              </Link>
            </div>
          )}
        </div>
        {/* -------- Fim do Dropdown de Financeiro -------- */}
      </div>
    </nav>
  );
}
